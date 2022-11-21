import { ApolloError } from "apollo-server-express";
import cuid from "cuid";
import { TMidtransPayType } from "../../../types/api";
import {
  TTransactionQuery,
  TTransactionMutation,
  TOrder,
  TOrderPaymentInfoMutation,
  TTransactionSubcription,
} from "../../../types/graphql";
import { TGQLPaymentType, TItemDetails } from "../../../types/transaction";
import {
  buyNowItems,
  buyNowWeight,
  courierCost,
  sCartItems,
  sCartWeight,
} from "./utils";
import { validateUser } from "../../utils/validateUser";
import { withFilter } from "graphql-subscriptions";
import pubsub from "../../services/pubsub";
import { db } from "../../services/db";
import { TNotification } from "../../../types/notification";

export const Query: TTransactionQuery = {
  paymentType: async (_, { isEnabled }, { db }) => {
    const paymentTypes = await db.paymentType.findMany({
      include: { PaymentService: true },
    });
    if (isEnabled) {
      const filterActive = paymentTypes.reduce((acc, curr) => {
        if (curr.isEnabled) {
          return [
            ...acc,
            {
              ...curr,
              PaymentService: curr.PaymentService.filter(
                (val) => val.isEnabled
              ),
            },
          ];
        } else {
          return acc;
        }
      }, [] as TGQLPaymentType[]);
      return filterActive;
    } else {
      return paymentTypes;
    }
  },
  howToPay: async (_, { paymentId }, { db }) => {
    const htp = await db.paymentService.findUnique({
      where: { id: paymentId },
    });
    const objHtp = JSON.parse(htp.howToPay);
    if (Array.isArray(objHtp)) {
      return objHtp;
    } else {
      return null;
    }
  },
  order: async (_, { orderId }, { db, user }) => {
    const findOrder = await db.order.findUnique({
      where: { id: orderId },
    });
    validateUser({
      target: "SPECIFIC_USER_OR_ADMIN",
      targetId: findOrder?.userId,
      currRole: user.role,
      currId: user.id,
    });
    return findOrder;
  },
  ordersListUser: async (_, __, { db, user }) => {
    const findUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, Order: true },
    });
    validateUser({
      target: "SPECIFIC_USER",
      targetId: findUser?.id,
      currRole: user.role,
      currId: user.id,
    });
    return findUser.Order;
  },
  ordersListUsers: async (_, { userId }, { db, user }) => {
    if (userId) {
      const orders = await db.order.findMany({ where: { userId } });
      return orders;
    } else {
      const orders = await db.order.findMany();
      return orders;
    }
  },
};

export const Mutation: TTransactionMutation = {
  order: async (_, { data }, { api, db, user }) => {
    const recipient = await db.recipient.findUnique({
      where: { id: data.recipientId },
      include: { User: true, City: { include: { Province: true } } },
    });
    validateUser({
      target: "SPECIFIC_USER",
      targetId: recipient.User.id,
      currRole: user.role,
      currId: user.id,
    });
    type TBookStocks = { bookId: string; stock: number }[];
    type TCourierService = {
      code: string;
      service: string;
      cost: number;
      description: string;
    };
    const orderId = cuid();
    let item_details: TItemDetails[];
    let gross_amount: number;
    let bookStocks: TBookStocks;
    let courier: TCourierService;

    if (data.orderType === "shoppingcart") {
      const sCart = await db.shoppingCart.findMany({
        where: { userId: recipient.userId },
        select: {
          amount: true,
          Book: {
            select: {
              id: true,
              title: true,
              price: true,
              weight: true,
              discount: true,
              stock: true,
            },
          },
        },
      });
      bookStocks = sCart.reduce(
        (acc, curr) => [
          ...acc,
          { bookId: curr.Book.id, stock: curr.Book.stock - curr.amount },
        ],
        [] as TBookStocks
      );

      const weight = sCartWeight({ shoppingCart: sCart });
      const checkCost = await courierCost({
        api,
        courier: data.courierCode,
        service: data.courierService,
        destination: recipient.cityId,
        weight,
      });
      const items = sCartItems({
        shoppingCart: sCart,
        courier: {
          code: data.courierCode,
          service: data.courierService,
          cost: checkCost.cost,
        },
      });
      courier = checkCost;
      item_details = items.item_details;
      gross_amount = items.gross_amount;
    } else if (data.orderType === "buy-now") {
      const book = await db.book.findUnique({
        where: { id: data.bookId },
        select: {
          id: true,
          title: true,
          weight: true,
          price: true,
          discount: true,
          stock: true,
        },
      });
      bookStocks = [{ bookId: data.bookId, stock: book.stock - data.amount }];
      const weight = await buyNowWeight({
        book,
        amount: data.amount,
      });
      const checkCost = await courierCost({
        api,
        courier: data.courierCode,
        service: data.courierService,
        destination: recipient.cityId,
        weight,
      });
      const Items = buyNowItems({
        book,
        amount: data.amount,
        courier: {
          code: data.courierCode,
          service: data.courierService,
          cost: checkCost.cost,
        },
      });
      courier = checkCost;
      item_details = Items.item_details;
      gross_amount = Items.gross_amount;
    } else {
      throw new ApolloError(`Order type not found`);
    }
    // REQUEST CHARGE TO PAYMENT GATEWAY
    const charge = await api.midtrans({
      type: data.payment as TMidtransPayType,
      value: {
        transaction_details: { gross_amount, order_id: orderId },
        item_details,
        customer_details: {
          first_name: recipient.User.firstName,
          last_name: recipient.User.lastName,
          email: recipient.User.email,
          phone: recipient.User.phone,
          shipping_address: {
            first_name: recipient.firstName,
            last_name: recipient.lastName,
            email: recipient.email,
            phone: recipient.phone,
            city: recipient.City.name,
            postal_code: recipient.City.postalCode,
            address: recipient.address,
            country_code: "IDN",
          },
        },
      },
    });
    if (charge.fraud_status === "deny" || charge.status_code !== "201")
      throw new ApolloError(`Transaction rejected`);

    const transactionTime = new Date(`${charge.transaction_time} GMT+7`);
    const exprDuration = 86400000; /* 24hours */
    const expirationTime = new Date(transactionTime.getTime() + exprDuration);
    // SAVE DATA TO DB
    const order = await db.order.create({
      data: {
        id: charge.order_id,
        grossAmount: gross_amount,
        currency: charge.currency,
        fraudStatus: charge.fraud_status || "not available",
        transactionStatus: charge.transaction_status,
        shippingStatus: "unProcessed",
        transactionTime,
        expirationTime,
        ItemDetails: { create: item_details },
        User: { connect: { id: user.id } },
        CustomerDetail: {
          create: {
            firstName: recipient.User.firstName,
            lastName: recipient.User.lastName || undefined,
            email: recipient.User.email,
            phone: recipient.User.phone || undefined,
            ShippingAddress: {
              create: {
                firstName: recipient.firstName,
                lastName: recipient.lastName,
                email: recipient.email,
                phone: recipient.phone,
                city: recipient.City.name,
                postalCode: recipient.City.postalCode,
                address: recipient.address,
                countryCode: "IDN",
              },
            },
          },
        },
        PaymentInfo: { create: charge.paymentInfo },
        PaymentService: { connect: { id: charge.paymentServiceId } },
        CourierDetail: {
          create: {
            service: courier.service,
            description: courier.description,
            cost: courier.cost,
            Courier: { connect: { code: "jne" } },
          },
        },
      },
      include: {
        ItemDetails: true,
        PaymentService: { include: { PaymentType: true } },
      },
    });

    try {
      if (order) {
        // reset shoppingcart
        if (data.orderType === "shoppingcart") {
          await db.shoppingCart.deleteMany({ where: { userId: user.id } });
        }
        // decrement book stock
        bookStocks.forEach(async (val) => {
          await db.$queryRaw`UPDATE book SET stock = ${val.stock} WHERE book_id = ${val.bookId};`;
        });

        // PUSH NOTIFICATION WITH WEBSOCKET
        const itemsName = order.ItemDetails.reduce((acc, curr) => {
          if (acc.length === 0) {
            return `${curr.name} x${curr.quantity} Rp.${curr.price}`;
          } else {
            return `${acc}, ${curr.name} x${curr.quantity} Rp.${curr.price}`;
          }
        }, "");
        const notif = await db.notification.create({
          data: {
            title: "Pesanan Ditambahkan",
            message: `Silahkan lakukan pembayaranmu 😉️. Total pembayaran Rp.${order.grossAmount} melalui ${order.PaymentService.PaymentType.name} > ${order.PaymentService.name}. Detail pembayaran : ${itemsName}.`,
            valueName: "ORDER_DETAIL",
            valueId: order.id,
            User: { connect: { id: order.userId } },
          },
        });
        if (!!notif)
          pubsub.publish("NOTIFICATION", {
            notification: {
              id: notif.id,
              title: notif.title,
              message: notif.message,
              valueName: notif.valueName,
              valueId: notif.valueId,
              userId: notif.userId,
              createdAt: notif.createdAt,
              updatedAt: notif.updatedAt,
            } as TNotification,
          });
      }
    } catch (err) {
      throw new ApolloError("Error update data pesanan");
    }
    return order;
  },
  changeShippingStatus: async (_, { orderId, data }, { db }) => {
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { transactionStatus: true },
    });
    if (order.transactionStatus !== "settlement")
      throw new ApolloError("Pesanan Belum dibayar");
    await db.order.update({
      where: { id: orderId },
      data: {
        shippingStatus: data.shippingStatus,
        receiptNumber: data.receiptNumber,
      },
    });
    return { message: "Berhasil ubah status pengiriman" };
  },
};

export const Subscription: TTransactionSubcription = {
  orderInfo: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("UPDATE_ORDER_STATUS"),
      async (payload, variables, context) => {
        const order = await db.order.findUnique({
          where: { id: payload.orderInfo.orderId },
          select: { userId: true },
        });
        return (
          payload.orderInfo.orderId === variables.orderId &&
          context.user.id === order.userId
        );
      }
    ),
  },
};

export const Order: TOrder = {
  PaymentService: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { PaymentService: { include: { PaymentType: true } } },
    });
    return findOrder.PaymentService;
  },
  CourierDetail: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { CourierDetail: { include: { Courier: true } } },
    });
    return findOrder.CourierDetail;
  },
  User: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { User: true },
    });
    return findOrder.User;
  },
  ItemDetail: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { ItemDetails: true },
    });
    return findOrder.ItemDetails;
  },
  CustomerDetail: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { CustomerDetail: { include: { ShippingAddress: true } } },
    });
    return findOrder.CustomerDetail;
  },
  PaymentInfo: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { PaymentInfo: true },
    });
    return findOrder.PaymentInfo;
  },
};

export const OrderPaymentInfo: TOrderPaymentInfoMutation = {
  PaymentService: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { PaymentService: { include: { PaymentType: true } } },
    });
    return findOrder.PaymentService;
  },
  PaymentInfo: async ({ id }, _, { db }) => {
    const findOrder = await db.order.findUnique({
      where: { id },
      select: { PaymentInfo: true },
    });
    return findOrder.PaymentInfo;
  },
};
