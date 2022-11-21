import { ApolloError } from "apollo-server-errors";
import Axios from "axios";
import { encode } from "js-base64";
import { TAPIMidtrans } from "../../../../types/api";
import { TGQLPaymentInfo } from "../../../../types/transaction";
import { bankTransfer } from "./bankTransfer";
import { convenienceStore } from "./convenienceStore";
const serverKey = encode(`${process.env.MIDTRANS_SERVER_KEY}:`);

export const midtransAPI = Axios.create({
  baseURL: process.env.MIDTRANS_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${serverKey}`,
  },
  withCredentials: true,
});

export const midtrans: TAPIMidtrans = async (props) => {
  switch (props.type) {
    case "BCA_BANK_TRANSFER": {
      const { item_details, customer_details, transaction_details } =
        props.value;
      const charge = await bankTransfer.BCA({
        item_details,
        customer_details,
        transaction_details,
      });
      const { va_numbers, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "bank", value: "BCA" },
        { name: "va_number", value: va_numbers[0].va_number },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    case "BNI_BANK_TRANSFER": {
      const { item_details, customer_details, transaction_details } =
        props.value;
      const charge = await bankTransfer.BNI({
        item_details,
        customer_details,
        transaction_details,
      });
      const { va_numbers, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "bank", value: "BNI" },
        { name: "va_number", value: va_numbers[0].va_number },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    case "BRI_BANK_TRANSFER": {
      const { item_details, customer_details, transaction_details } =
        props.value;
      const charge = await bankTransfer.BRI({
        item_details,
        customer_details,
        transaction_details,
      });
      const { va_numbers, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "bank", value: "BRI" },
        { name: "va_number", value: va_numbers[0].va_number },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    case "MANDIRI_BILL_BANK_TRANSFER": {
      const { item_details, customer_details, transaction_details } =
        props.value;

      const charge = await bankTransfer.MandiriBill({
        item_details,
        customer_details,
        transaction_details,
        echannel: { bill_info1: "payment for", bill_info2: "book" },
      });
      const { bill_key, biller_code, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "bank", value: "Mandiri" },
        { name: "bill_key", value: bill_key },
        { name: "biller_code", value: biller_code },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    case "PERMATA_BANK_TRANSFER": {
      const { item_details, customer_details, transaction_details } =
        props.value;
      const charge = await bankTransfer.Permata({
        item_details,
        customer_details,
        transaction_details,
      });
      const { permata_va_number, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "bank", value: "Permata" },
        { name: "va_number", value: permata_va_number },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    case "INDOMARET_CSTORE": {
      const { item_details, customer_details, transaction_details } =
        props.value;
      const charge = await convenienceStore.Indomaret({
        item_details,
        customer_details,
        transaction_details,
      });
      const { payment_code, store, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "store", value: store },
        { name: "payment_code", value: payment_code },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    case "ALFAMART_CSTORE": {
      const { item_details, customer_details, transaction_details } =
        props.value;
      const charge = await convenienceStore.Indomaret({
        item_details,
        customer_details,
        transaction_details,
      });
      const { payment_code, store, ...rest } = charge;
      const paymentInfo: TGQLPaymentInfo[] = [
        { name: "store", value: store },
        { name: "payment_code", value: payment_code },
      ];
      return { ...rest, paymentInfo, paymentServiceId: props.type };
    }
    default: {
      throw new ApolloError("Payment Type not found");
    }
  }
};
