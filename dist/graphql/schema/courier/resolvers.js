"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
exports.Query = {
    courier: async (_, { isEnabled }, { db }) => {
        const couriers = await db.courier.findMany();
        if (isEnabled) {
            return couriers.filter((val) => val.isEnabled);
        }
        else {
            return couriers;
        }
    },
    provinces: async (_, __, { api }) => await api.rajaOngkir.getProvinces(),
    province: async (_, args, { api }) => await api.rajaOngkir.getProvince(args),
    cities: async (_, args, { api }) => await api.rajaOngkir.getCities(args),
    city: async (_, args, { api }) => await api.rajaOngkir.getCity(args),
    courierCost: async (_, args, { api }) => {
        const data = Object.assign({ origin: process.env.ORIGIN_CITY_ID }, args);
        return await api.rajaOngkir.getCost(data);
    },
};
