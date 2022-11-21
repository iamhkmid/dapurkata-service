import { ApolloError } from "apollo-server-express";
import { AxiosResponse } from "axios";
import { midtransAPI as api } from "./api";
import { TAPIConvenienceStore } from "../../../../types/api";
import {
  TAPIResCSAlfamart,
  TAPIResCSIndomaret,
} from "../../../../types/midtrans";

export const convenienceStore: TAPIConvenienceStore = {
  Indomaret: async (values) => {
    const data = {
      payment_type: "cstore",
      cstore: {
        store: "indomaret",
        message: "Pembayaran buku Penerbit DapurKata",
      },
      ...values,
    };
    try {
      const response: AxiosResponse<TAPIResCSIndomaret> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
  Alfamart: async (values) => {
    const data = {
      payment_type: "cstore",
      cstore: {
        store: "alfamart",
        message: "Pembayaran buku Penerbit DapurKata",
        alfamart_free_text_1: "1st row of receipt,",
        alfamart_free_text_2: "This is the 2nd row,",
        alfamart_free_text_3: "3rd row. The end.",
      },
      ...values,
    };
    try {
      const response: AxiosResponse<TAPIResCSAlfamart> = await api.post(
        `/charge`,
        data
      );
      return response.data;
    } catch (error) {
      throw new ApolloError(`error fetch data on server`);
    }
  },
};
