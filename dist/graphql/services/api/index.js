"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./midtrans/api");
const services_1 = require("./rajaOngkir/services");
const api = { rajaOngkir: services_1.rajaOngkir, midtrans: api_1.midtrans };
exports.default = api;
