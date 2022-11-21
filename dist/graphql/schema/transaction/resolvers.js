"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentInfo = exports.Order = exports.Subscription = exports.Mutation = exports.Query = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const cuid_1 = __importDefault(require("cuid"));
const utils_1 = require("./utils");
const validateUser_1 = require("../../utils/validateUser");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = __importDefault(require("../../services/pubsub"));
const db_1 = require("../../services/db");
exports.Query = {
    paymentType: async (_, { isEnabled }, { db }) => {
        const paymentTypes = await db.paymentType.findMany({
            include: { PaymentService: true },
        });
        if (isEnabled) {
            const filterActive = paymentTypes.reduce((acc, curr) => {
                if (curr.isEnabled) {
                    return [
                        ...acc,
                        Object.assign(Object.assign({}, curr), { PaymentService: curr.PaymentService.filter((val) => val.isEnabled) }),
                    ];
                }
                else {
                    return acc;
                }
            }, []);
            return filterActive;
        }
        else {
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
        }
        else {
            return null;
        }
    },
    order: async (_, { orderId }, { db, user }) => {
        const findOrder = await db.order.findUnique({
            where: { id: orderId },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER_OR_ADMIN",
            targetId: findOrder === null || findOrder === void 0 ? void 0 : findOrder.userId,
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
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER",
            targetId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            currRole: user.role,
            currId: user.id,
        });
        return findUser.Order;
    },
    ordersListUsers: async (_, { userId }, { db, user }) => {
        if (userId) {
            const orders = await db.order.findMany({ where: { userId } });
            return orders;
        }
        else {
            const orders = await db.order.findMany();
            return orders;
        }
    },
};
exports.Mutation = {
    order: async (_, { data }, { api, db, user }) => {
        const recipient = await db.recipient.findUnique({
            where: { id: data.recipientId },
            include: { User: true, City: { include: { Province: true } } },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER",
            targetId: recipient.User.id,
            currRole: user.role,
            currId: user.id,
        });
        const orderId = (0, cuid_1.default)();
        let item_details;
        let gross_amount;
        let bookStocks;
        let courier;
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
            bookStocks = sCart.reduce((acc, curr) => [
                ...acc,
                { bookId: curr.Book.id, stock: curr.Book.stock - curr.amount },
            ], []);
            const weight = (0, utils_1.sCartWeight)({ shoppingCart: sCart });
            const checkCost = await (0, utils_1.courierCost)({
                api,
                courier: data.courierCode,
                service: data.courierService,
                destination: recipient.cityId,
                weight,
            });
            const items = (0, utils_1.sCartItems)({
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
        }
        else if (data.orderType === "buy-now") {
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
            const weight = await (0, utils_1.buyNowWeight)({
                book,
                amount: data.amount,
            });
            const checkCost = await (0, utils_1.courierCost)({
                api,
                courier: data.courierCode,
                service: data.courierService,
                destination: recipient.cityId,
                weight,
            });
            const Items = (0, utils_1.buyNowItems)({
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
        }
        else {
            throw new apollo_server_express_1.ApolloError(`Order type not found`);
        }
        // REQUEST CHARGE TO PAYMENT GATEWAY
        const charge = await api.midtrans({
            type: data.payment,
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
            throw new apollo_server_express_1.ApolloError(`Transaction rejected`);
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
                    await db.$queryRaw `UPDATE book SET stock = ${val.stock} WHERE book_id = ${val.bookId};`;
                });
                // PUSH NOTIFICATION WITH WEBSOCKET
                const itemsName = order.ItemDetails.reduce((acc, curr) => {
                    if (acc.length === 0) {
                        return `${curr.name} x${curr.quantity} Rp.${curr.price}`;
                    }
                    else {
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
                    pubsub_1.default.publish("NOTIFICATION", {
                        notification: {
                            id: notif.id,
                            title: notif.title,
                            message: notif.message,
                            valueName: notif.valueName,
                            valueId: notif.valueId,
                            userId: notif.userId,
                            createdAt: notif.createdAt,
                            updatedAt: notif.updatedAt,
                        },
                    });
            }
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("Error update data pesanan");
        }
        return order;
    },
    changeShippingStatus: async (_, { orderId, data }, { db }) => {
        const order = await db.order.findUnique({
            where: { id: orderId },
            select: { transactionStatus: true },
        });
        if (order.transactionStatus !== "settlement")
            throw new apollo_server_express_1.ApolloError("Pesanan Belum dibayar");
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
exports.Subscription = {
    orderInfo: {
        subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.default.asyncIterator("UPDATE_ORDER_STATUS"), async (payload, variables, context) => {
            const order = await db_1.db.order.findUnique({
                where: { id: payload.orderInfo.orderId },
                select: { userId: true },
            });
            return (payload.orderInfo.orderId === variables.orderId &&
                context.user.id === order.userId);
        }),
    },
};
exports.Order = {
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
exports.OrderPaymentInfo = {
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
