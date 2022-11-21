"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convenienceStore = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const api_1 = require("./api");
exports.convenienceStore = {
    Indomaret: async (values) => {
        const data = Object.assign({ payment_type: "cstore", cstore: {
                store: "indomaret",
                message: "Pembayaran buku Penerbit DapurKata",
            } }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
    Alfamart: async (values) => {
        const data = Object.assign({ payment_type: "cstore", cstore: {
                store: "alfamart",
                message: "Pembayaran buku Penerbit DapurKata",
                alfamart_free_text_1: "1st row of receipt,",
                alfamart_free_text_2: "This is the 2nd row,",
                alfamart_free_text_3: "3rd row. The end.",
            } }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
};
