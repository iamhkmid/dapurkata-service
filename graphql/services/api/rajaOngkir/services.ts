import Axios, { AxiosResponse } from "axios";
import qs from "qs";
import { ApolloError } from "apollo-server-errors";
import { TAPIRajaOngkir } from "../../../../types/api";
import {
  TAxiosCities,
  TAxiosCity,
  TAxiosCost,
  TAxiosProvince,
  TAxiosProvinces,
} from "../../../../types/rajaOngkir";
import { rajaOngkirAPI as api } from "./api";

export const rajaOngkir: TAPIRajaOngkir = {
  getProvinces: async () => {
    try {
      const provinces: AxiosResponse<TAxiosProvinces> = await api.get(
        "/province",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return provinces.data.rajaongkir.results;
    } catch (error) {
      throw new ApolloError(`Error fetch data on server`);
    }
  },
  getProvince: async ({ province_id }) => {
    try {
      const province: AxiosResponse<TAxiosProvince> = await api.get(
        `/province?id=${province_id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return province.data.rajaongkir.results;
    } catch (error) {
      throw new ApolloError(`Error fetch data on server`);
    }
  },
  getCities: async ({ province_id }) => {
    const url = province_id ? `/city?province=${province_id}` : "/city";
    try {
      const cities: AxiosResponse<TAxiosCities> = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return cities.data.rajaongkir.results;
    } catch (error) {
      throw new ApolloError(`Error fetch data on server`);
    }
  },
  getCity: async ({ city_id, province_id }) => {
    const url = province_id
      ? `/city?id=${city_id}&province=${province_id}`
      : `/city?id=${city_id}`;
    try {
      const city: AxiosResponse<TAxiosCity> = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return city.data.rajaongkir.results;
    } catch (error) {
      throw new ApolloError(`Error fetch data on server`);
    }
  },
  getCost: async (args) => {
    const data = qs.stringify(args);
    try {
      const cost: AxiosResponse<TAxiosCost> = await api.post(`/cost`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return cost.data.rajaongkir.results[0];
    } catch (error) {
      throw new ApolloError(`Error fetch data on server`);
    }
  },
};
