import { ApolloError } from "apollo-server-express";
import { AxiosResponse } from "axios";
import { midtransAPI as api } from "./api";
import { TAPIBankTransfer } from "../../../../types/api";
import {
  TAPIResBTBCA,
  TAPIResBTBNI,
  TAPIResBTBRI,
  TAPIResBTMandiriBill,
  TAPIResBTPermata,
} from "../../../../types/midtrans";

export const bankTransfer: TAPIBankTransfer = {
  BNI: async (values) => {
    const data = {
      payment_type: "bank_transfer",
      bank_transfer: { bank: "bni" },
      ...values,
    };
    try {
      const response: AxiosResponse<TAPIResBTBNI> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
  BCA: async (values) => {
    const data = {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bca",
      },
      ...values,
    };
    try {
      const response: AxiosResponse<TAPIResBTBCA> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
  BRI: async (values) => {
    const data = {
      payment_type: "bank_transfer",
      bank_transfer: { bank: "bri" },
      ...values,
    };
    try {
      const response: AxiosResponse<TAPIResBTBRI> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
  MandiriBill: async (values) => {
    const data = { payment_type: "echannel", ...values };
    try {
      const response: AxiosResponse<TAPIResBTMandiriBill> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
  Permata: async (values) => {
    const data = {
      payment_type: "bank_transfer",
      bank_transfer: { bank: "permata" },
      ...values,
    };
    try {
      const response: AxiosResponse<TAPIResBTPermata> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
};
