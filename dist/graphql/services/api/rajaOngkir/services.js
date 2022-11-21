"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rajaOngkir = void 0;
const qs_1 = __importDefault(require("qs"));
const apollo_server_errors_1 = require("apollo-server-errors");
const api_1 = require("./api");
exports.rajaOngkir = {
    getProvinces: async () => {
        try {
            const provinces = await api_1.rajaOngkirAPI.get("/province", {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return provinces.data.rajaongkir.results;
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError(`Error fetch data on server`);
        }
    },
    getProvince: async ({ province_id }) => {
        try {
            const province = await api_1.rajaOngkirAPI.get(`/province?id=${province_id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return province.data.rajaongkir.results;
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError(`Error fetch data on server`);
        }
    },
    getCities: async ({ province_id }) => {
        const url = province_id ? `/city?province=${province_id}` : "/city";
        try {
            const cities = await api_1.rajaOngkirAPI.get(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return cities.data.rajaongkir.results;
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError(`Error fetch data on server`);
        }
    },
    getCity: async ({ city_id, province_id }) => {
        const url = province_id
            ? `/city?id=${city_id}&province=${province_id}`
            : `/city?id=${city_id}`;
        try {
            const city = await api_1.rajaOngkirAPI.get(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return city.data.rajaongkir.results;
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError(`Error fetch data on server`);
        }
    },
    getCost: async (args) => {
        const data = qs_1.default.stringify(args);
        try {
            const cost = await api_1.rajaOngkirAPI.post(`/cost`, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return cost.data.rajaongkir.results[0];
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError(`Error fetch data on server`);
        }
    },
};
