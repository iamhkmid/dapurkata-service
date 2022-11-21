import { TAPI } from "../../../types/api";
import { midtrans } from "./midtrans/api";
import { rajaOngkir } from "./rajaOngkir/services";

const api: TAPI = { rajaOngkir, midtrans };

export default api;
