"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.midtrans = exports.midtransAPI = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const axios_1 = __importDefault(require("axios"));
const js_base64_1 = require("js-base64");
const bankTransfer_1 = require("./bankTransfer");
const convenienceStore_1 = require("./convenienceStore");
const serverKey = (0, js_base64_1.encode)(`${process.env.MIDTRANS_SERVER_KEY}:`);
exports.midtransAPI = axios_1.default.create({
    baseURL: process.env.MIDTRANS_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${serverKey}`,
    },
    withCredentials: true,
});
const midtrans = async (props) => {
    switch (props.type) {
        case "BCA_BANK_TRANSFER": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await bankTransfer_1.bankTransfer.BCA({
                item_details,
                customer_details,
                transaction_details,
            });
            const { va_numbers } = charge, rest = __rest(charge, ["va_numbers"]);
            const paymentInfo = [
                { name: "bank", value: "BCA" },
                { name: "va_number", value: va_numbers[0].va_number },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        case "BNI_BANK_TRANSFER": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await bankTransfer_1.bankTransfer.BNI({
                item_details,
                customer_details,
                transaction_details,
            });
            const { va_numbers } = charge, rest = __rest(charge, ["va_numbers"]);
            const paymentInfo = [
                { name: "bank", value: "BNI" },
                { name: "va_number", value: va_numbers[0].va_number },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        case "BRI_BANK_TRANSFER": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await bankTransfer_1.bankTransfer.BRI({
                item_details,
                customer_details,
                transaction_details,
            });
            const { va_numbers } = charge, rest = __rest(charge, ["va_numbers"]);
            const paymentInfo = [
                { name: "bank", value: "BRI" },
                { name: "va_number", value: va_numbers[0].va_number },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        case "MANDIRI_BILL_BANK_TRANSFER": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await bankTransfer_1.bankTransfer.MandiriBill({
                item_details,
                customer_details,
                transaction_details,
                echannel: { bill_info1: "payment for", bill_info2: "book" },
            });
            const { bill_key, biller_code } = charge, rest = __rest(charge, ["bill_key", "biller_code"]);
            const paymentInfo = [
                { name: "bank", value: "Mandiri" },
                { name: "bill_key", value: bill_key },
                { name: "biller_code", value: biller_code },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        case "PERMATA_BANK_TRANSFER": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await bankTransfer_1.bankTransfer.Permata({
                item_details,
                customer_details,
                transaction_details,
            });
            const { permata_va_number } = charge, rest = __rest(charge, ["permata_va_number"]);
            const paymentInfo = [
                { name: "bank", value: "Permata" },
                { name: "va_number", value: permata_va_number },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        case "INDOMARET_CSTORE": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await convenienceStore_1.convenienceStore.Indomaret({
                item_details,
                customer_details,
                transaction_details,
            });
            const { payment_code, store } = charge, rest = __rest(charge, ["payment_code", "store"]);
            const paymentInfo = [
                { name: "store", value: store },
                { name: "payment_code", value: payment_code },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        case "ALFAMART_CSTORE": {
            const { item_details, customer_details, transaction_details } = props.value;
            const charge = await convenienceStore_1.convenienceStore.Indomaret({
                item_details,
                customer_details,
                transaction_details,
            });
            const { payment_code, store } = charge, rest = __rest(charge, ["payment_code", "store"]);
            const paymentInfo = [
                { name: "store", value: store },
                { name: "payment_code", value: payment_code },
            ];
            return Object.assign(Object.assign({}, rest), { paymentInfo, paymentServiceId: props.type });
        }
        default: {
            throw new apollo_server_errors_1.ApolloError("Payment Type not found");
        }
    }
};
exports.midtrans = midtrans;
