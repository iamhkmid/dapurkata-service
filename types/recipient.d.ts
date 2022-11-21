export type TGQLRecipient = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  City: {
    Province: {
      id: string;
      name: string;
    };
    id: string;
    name: string;
    postalCode: string;
  };
  address: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TDBCRcptData = {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  address: string;
  postalCode: string;
};

export type TDBURcptData = {
  recipientId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  address: string;
  postalCode: string;
};

export type TArgsCRcptData = {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  cityId: string;
  address: string;
};

export type TArgsURcptData = {
  recipientId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  cityId: string;
  address: string;
};

export type TArgsCreateRcpt = {
  data: TArgsCRcptData;
};
export type TArgsUpdateRcpt = {
  data: TArgsURcptData;
};
