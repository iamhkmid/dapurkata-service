export type TAPIProvince = {
  province_id: string;
  province: string;
};

export type TAPICity = {
  city_id: string;
  city_name: string;
  province_id: string;
  province: string;
  type: string;
  postal_code: string;
};

export type TAPICost = {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cost: { value: number; etd: string; note: string }[];
  }[];
};

export type TAxiosProvinces = {
  rajaongkir: {
    query: [];
    status: { code: number; description: string };
    results: TAPIProvince[];
  };
};

export type TAxiosProvince = {
  rajaongkir: {
    query: { id: string };
    status: { code: number; description: string };
    results: TAPIProvince;
  };
};

export type TAxiosCities = {
  rajaongkir: {
    query: { province: string };
    status: { code: number; description: string };
    results: TAPICity[];
  };
};

export type TAxiosCity = {
  rajaongkir: {
    query: { id: string; province: string };
    status: { code: number; description: string };
    results: TAPICity;
  };
};

export type TAxiosCost = {
  rajaongkir: {
    query: {
      origin: string;
      destination: string;
      weight: number;
      courier: string;
    };
    status: { code: number; description: string };
    origin_details: {
      city_id: string;
      province_id: string;
      province: string;
      type: string;
      city_name: string;
      postal_code: string;
    };
    destination_details: {
      city_id: string;
      province_id: string;
      province: string;
      type: string;
      city_name: string;
      postal_code: string;
    };
    results: TAPICost[];
  };
};
