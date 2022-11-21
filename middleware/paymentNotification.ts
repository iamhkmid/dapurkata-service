import CryptoJS from "crypto-js";
import { encode } from "js-base64";
import { db } from "../graphql/services/db";
import { TNotifPaymentBody } from "../types/api";
import pubsub from "../graphql/services/pubsub";
import { NextFunction, Request, Response } from "express";
import { TNotification } from "../types/notification";

const paymentNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: TNotifPaymentBody = req.body;
  const signatureKey: string = body.signature_key;
  const orderId: string = body.order_id;
  const statusCode: string = body.status_code;
  const grossAmount: string = body.gross_amount;
  const serverKey: string = process.env.MIDTRANS_SERVER_KEY;
  const transactionTime: string = body.transaction_time;
  const transactionStatus: string = body.transaction_status;
  const fraudStatus: string = body.fraud_status;

  const validBody =
    !!orderId &&
    !!statusCode &&
    !!grossAmount &&
    !!signatureKey &&
    !!transactionTime &&
    !!transactionStatus &&
    !!fraudStatus;

  if (validBody) {
    const calcSignatureKey = CryptoJS.SHA512(
      orderId + statusCode + grossAmount + serverKey
    );
    if (signatureKey === calcSignatureKey.toString()) {
      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your database to 'challenge'
          // and response with 200 OK
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your database to 'success'
          // and response with 200 OK
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        try {
          const order = await db.order.update({
            where: { id: orderId },
            data: {
              transactionTime: new Date(`${transactionTime} GMT+7`),
              transactionStatus: transactionStatus,
              shippingStatus: "inProcess",
              fraudStatus: fraudStatus,
            },
            include: {
              ItemDetails: true,
              PaymentService: { include: { PaymentType: true } },
            },
          });
          if (!!order) {
            try {
              const itemsName = order.ItemDetails.reduce((acc, curr) => {
                if (acc.length === 0) {
                  return `${curr.name} x${curr.quantity} Rp.${curr.price}`;
                } else {
                  return `${acc}, ${curr.name} x${curr.quantity} Rp.${curr.price}`;
                }
              }, "");
              const notif = await db.notification.create({
                data: {
                  title: "Pembayaran Berhasil",
                  message: `Terimakasih telah melakukan pembayaran 🥰️. Total pembayaran Rp.${order.grossAmount} melalui ${order.PaymentService.PaymentType.name} > ${order.PaymentService.name}. Detail pembayaran : ${itemsName}.`,
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
            } catch (error) {}

            pubsub.publish("UPDATE_ORDER_STATUS", {
              orderInfo: {
                orderId: order.id,
                transactionTime: order.transactionTime,
                transactionStatus: order.transactionStatus,
                fraudStatus: order.fraudStatus,
              },
            });
          }
        } catch (err) {
        } finally {
          res.status(200).end();
        }
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your database to 'failure'
        // and response with 200 OK
        try {
          const order = await db.order.update({
            where: { id: orderId },
            data: {
              transactionTime: new Date(`${transactionTime} GMT+7`),
              transactionStatus: transactionStatus,
              fraudStatus: fraudStatus,
            },
          });
          if (!!order) {
            pubsub.publish("UPDATE_ORDER_STATUS", {
              orderInfo: {
                orderId: order.id,
                transactionTime: order.transactionTime,
                transactionStatus: order.transactionStatus,
                fraudStatus: order.fraudStatus,
              },
            });
          }
        } catch (err) {
        } finally {
          res.status(200).end();
        }
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your database to 'pending' / waiting payment
        // and response with 200 OK
        try {
          const order = await db.order.update({
            where: { id: orderId },
            data: {
              transactionTime: new Date(`${transactionTime} GMT+7`),
              transactionStatus: transactionStatus,
              fraudStatus: fraudStatus,
            },
          });
          if (!!order) {
            pubsub.publish("UPDATE_ORDER_STATUS", {
              orderInfo: {
                orderId: order.id,
                transactionTime: order.transactionTime,
                transactionStatus: order.transactionStatus,
                fraudStatus: order.fraudStatus,
              },
            });
          }
        } catch (err) {
        } finally {
          res.status(200).end();
        }
      }
    } else {
      res.status(403).end();
    }
  } else {
    res.status(403).end();
  }
};

export default paymentNotification;
