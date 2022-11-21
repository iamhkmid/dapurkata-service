import Axios from "axios";

export const rajaOngkirAPI = Axios.create({
  baseURL: process.env.RAJAONGKIR_URL,
  headers: {
    Accept: "application/json",
    key: process.env.RAJAONGKIR_API_KEY,
  },
  withCredentials: true,
});
