type TAPIResBTBill = {
  bill_key: string;
  biller_code: string;
};

type TAPIResBTVaNum = {
  va_numbers: {
    bank: string;
    va_number: string;
  }[];
};

type TAPIResBTVaNumPermata = {
  permata_va_number: string;
};

type TAPIResCSCodeAlfamart = {
  payment_code: string;
  store: string;
};

type TAPIResCSCodeIndomaret = {
  payment_code: string;
  store: string;
};

type TAPIChargeRes = {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id?: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
};

type TAPIParamsCharge = {
  transaction_details: { order_id: string; gross_amount: number };
  customer_details?: {
    email?: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  };
  item_details?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
};

type TAPIParamsEchannel = {
  echannel: {
    bill_info1: string;
    bill_info2: string;
  };
};

//Parameters
export type TAPIParamsBTBNI = TAPIParamsCharge;
export type TAPIParamsBTBCA = TAPIParamsCharge;
export type TAPIParamsBTBRI = TAPIParamsCharge;
export type TAPIParamsBTPermata = TAPIParamsCharge;
export type TAPIParamsBTMandiriBill = TAPIParamsEchannel & TAPIParamsCharge;
export type TAPIParamsCSIndomaret = TAPIParamsCharge;
export type TAPIParamsCSAlfamart = TAPIParamsCharge;

//Response
export type TAPIResBTBNI = TAPIResBTVaNum & TAPIChargeRes;
export type TAPIResBTBCA = TAPIResBTVaNum & TAPIChargeRes;
export type TAPIResBTBRI = TAPIResBTVaNum & TAPIChargeRes;
export type TAPIResBTMandiriBill = TAPIResBTBill & TAPIChargeRes;
export type TAPIResBTPermata = TAPIResBTVaNumPermata & TAPIChargeRes;
export type TAPIResCSIndomaret = TAPIResCSCodeIndomaret & TAPIChargeRes;
export type TAPIResCSAlfamart = TAPIResCSCodeAlfamart & TAPIChargeRes;
