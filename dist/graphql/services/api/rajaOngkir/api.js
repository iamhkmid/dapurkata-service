"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rajaOngkirAPI = void 0;
const axios_1 = __importDefault(require("axios"));
exports.rajaOngkirAPI = axios_1.default.create({
    baseURL: process.env.RAJAONGKIR_URL,
    headers: {
        Accept: "application/json",
        key: process.env.RAJAONGKIR_API_KEY,
    },
    withCredentials: true,
});
