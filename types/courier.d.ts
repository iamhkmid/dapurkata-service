import { TAPI } from "./api";

export type TGQLCourier = {
  code: string;
  name: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TGQLArgsCourier = { isEnabled: boolean };
export type TGQLArgsProvinces = { province_id: string };
export type TGQLArgsCities = { province_id: string };
export type TGQLArgsCity = { city_id: string; province_id: string };
export type TGQLArgsCost = {
  destination: string;
  weight: number;
  courier: string;
};
