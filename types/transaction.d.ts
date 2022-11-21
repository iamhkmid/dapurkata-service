import { boolean, string } from "yup/lib/locale";
import { TAPI } from "./api";
import { TDB } from "./gContext";
import { TGQLUser } from "./user";

export type TGQLBankTransfer = {
  status_code: "201";
  status_message: "Success, Bank Transfer transaction is created";
  transaction_id: "be03df7d-2f97-4c8c-a53c-8959f1b67295";
  order_id: "1571823229";
  merchant_id: "G812785002";
  gross_amount: "44000.00";
  currency: "IDR";
  payment_type: "bank_transfer";
  transaction_time: "2019-10-23 16:33:49";
  transaction_status: "pending";
  va_numbers: [
    {
      bank: "bca";
      va_number: "812785002530231";
    }
  ];
  fraud_status: "accept";
};

export type TDBPaymentType = {
  id: string;
  name: string;
  isEnabled: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TGQLPaymentService = {
  id: string;
  name: string;
  isEnabled: boolean;
  icon: string;
  description: string;
  PaymentType?: TDBPaymentType;
  createdAt: Date;
  updatedAt: Date;
};
export type TGQLPaymentType = {
  id: string;
  name: string;
  isEnabled: boolean;
  description: string;
  PaymentService: TGQLPaymentService[];
  createdAt: Date;
  updatedAt: Date;
};
export type TPaymentBT =
  | "BCA_BANK_TRANSFER"
  | "BNI_BANK_TRANSFER"
  | "BRI_BANK_TRANSFER"
  | "MANDIRI_BILL_BANK_TRANSFER"
  | "PERMATA_BANK_TRANSFER";
export type TPaymentStore = "INDOMARET" | "ALFAMART";
export type TGQLArgsOrder = {
  data: {
    orderType: string;
    recipientId?: string;
    bookId?: string;
    amount?: number;
    courierCode: string;
    courierService: string;
    payment: TPaymentBT | TPaymentStore;
  };
};
type TArgsChangeShippingStatus = {
  orderId: string;
  data: {
    shippingStatus: string;
    receiptNumber: string;
  };
};
type TGQLChangeShippingStatus = {
  message: string;
};
export type TGQLArgsPaymentType = { isEnabled: boolean };

export type TPropsCCost = {
  api: TAPI;
  destination: string;
  service: string;
  weight: number;
  courier: string;
};
export type TOrderSCart = {
  amount: number;
  Book: {
    id: string;
    title: string;
    price: number;
    weight: number;
    discount: number;
  };
};
export type TPropsSCWeight = {
  shoppingCart: TOrderSCart[];
};

export type TbuyNowItemsWeight = {
  book: { id: string; weight: number };
  amount: number;
};

export type TShippingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country_code: string;
};

export type TCustomerDetail = {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  shipping_address: TShippingAddress;
};

export type TItemDetails = {
  id: string;
  itemId: string;
  price: number;
  quantity: number;
  name: string;
};
export type TTransactionDetails = {
  order_id: string;
  gross_amount: number;
};
export type TGQLHowToPay = { name: string; stages: string[] };

export type TPSCartItems = {
  shoppingCart: TOrderSCart[];
  courier: { code: string; service: string; cost: number };
};
export type TSCartItems = (p: TPSCartItems) => {
  item_details: TItemDetails[];
  gross_amount: number;
};
export type TPBuyNowItems = {
  book: {
    id: string;
    title: string;
    weight: number;
    price: number;
    discount: number;
  };
  amount: number;
  courier: { code: string; service: string; cost: number };
};
export type TBuyNowItems = (p: TPBuyNowItems) => {
  item_details: TItemDetails[];
  gross_amount: number;
};

export type TGQLCourierDetail = {
  id: string;
  service: string;
  description: string;
  cost: number;
  Courier: {
    code: string;
    name: string;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type TGQLOrder = {
  id: string;
  PaymentService?: {
    id: string;
    name: string;
    isEnabled: boolean;
    icon: string;
    description: string;
    PaymentType?: {
      id: string;
      name: string;
      icon: string;
      isEnabled: boolean;
      description: string;
    };
  };
  paymentServiceId: string;
  userId: string;
  User?: TGQLUser;
  grossAmount: number;
  currency: string;
  transactionTime: Date;
  expirationTime: Date;
  transactionStatus: string;
  shippingStatus: string;
  receiptNumber?: string;
  fraudStatus: string;
  ItemDetails?: TGQLItemDetail[];
  PaymentInfo?: TGQLPaymentInfo[];
  CustomerDetail?: TGQLCustomerDetail;
  CourierService?: TGQLCourierService;
  createdAt: Date;
  updatedAt: Date;
};
export type TGQLUserOrder = {
  id: string;
  paymentServiceId: string;
  PaymentService?: {
    id: string;
    name: string;
    isEnabled: boolean;
    icon: string;
    description: string;
    PaymentType?: {
      id: string;
      name: string;
      icon: string;
      isEnabled: boolean;
      description: string;
    };
  };
  grossAmount: number;
  currency: string;
  transactionTime: Date;
  expirationTime: Date;
  transactionStatus: string;
  shippingStatus: string;
  receiptNumber?: string;
  fraudStatus: string;
  ItemDetails?: TGQLItemDetail[];
  PaymentInfo?: TGQLPaymentInfo[];
  CustomerDetail?: TGQLCustomerDetail;
  CourierService?: TGQLCourierService;
  createdAt: Date;
  updatedAt: Date;
};

type TGQLPaymentInfo = { name: string; value: string };

type TGQLItemDetail = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  orderId: string;
};

type TGQLCustomerDetail = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  orderId: string;
  ShippingAddress: TGQLShippingAddress;
  createdAt: Date;
  updatedAt: Date;
};

type TGQLShippingAddress = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  customerDetailId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TGQLOrderPaymentInfo = {
  id: string;
  PaymentService?: {
    id: string;
    name: string;
    isEnabled: boolean;
    icon: string;
    description: string;
    PaymentType?: {
      id: string;
      name: string;
      icon: string;
      isEnabled: boolean;
      description: string;
    };
  };
  grossAmount: number;
  currency: string;
  transactionTime: Date;
  expirationTime: Date;
  transactionStatus: string;
  fraudStatus: string;
  PaymentInfo?: TGQLPaymentInfo[];
};
