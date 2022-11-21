"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankTransfer = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const api_1 = require("./api");
exports.bankTransfer = {
    BNI: async (values) => {
        const data = Object.assign({ payment_type: "bank_transfer", bank_transfer: { bank: "bni" } }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
    BCA: async (values) => {
        const data = Object.assign({ payment_type: "bank_transfer", bank_transfer: {
                bank: "bca",
            } }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
    BRI: async (values) => {
        const data = Object.assign({ payment_type: "bank_transfer", bank_transfer: { bank: "bri" } }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
    MandiriBill: async (values) => {
        const data = Object.assign({ payment_type: "echannel" }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
    Permata: async (values) => {
        const data = Object.assign({ payment_type: "bank_transfer", bank_transfer: { bank: "permata" } }, values);
        try {
            const response = await api_1.midtransAPI.post(`/charge`, data);
            return response.data;
        }
        catch (error) {
            throw new apollo_server_express_1.ApolloError(`error fetch data on server`);
        }
    },
};
