import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    paymentType(isEnabled: Boolean): [PaymentType] @auth(requires: AUTH)
    howToPay(paymentId: ID!): [HowToPay]
    order(orderId: ID!): Order @auth(requires: AUTH)
    ordersListUser: [Order] @auth(requires: USER)
    ordersListUsers(userId: ID): [Order] @auth(requires: ADMIN)
  }

  type Mutation {
    order(data: OrderInput!): OrderPaymentInfo @auth(requires: USER)
    changeShippingStatus(
      orderId: ID!
      data: changeShippingStatusData!
    ): ChangeShippingStatus @auth(requires: ADMIN)
  }

  type Subscription {
    orderInfo(orderId: ID!): OrderInfoSubscription
  }

  type ChangeShippingStatus {
    message: String
  }

  input changeShippingStatusData {
    shippingStatus: enumShippingStatus
    receiptNumber: String
  }
  enum enumShippingStatus {
    unProcessed
    inProcess
    inShipping
  }

  enum orderFilter {
    ALL
    USER
  }

  type OrderInfoSubscription {
    orderId: String
    transactionTime: Date
    transactionStatus: String
    fraudStatus: String
  }

  type PaymentType {
    id: ID
    name: String
    PaymentService: [PaymentService]
    isEnabled: Boolean
    icon: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type PaymentService {
    id: ID
    name: String
    icon: String
    description: String
    isEnabled: Boolean
    PaymentType: PaymentType
    createdAt: Date
    updatedAt: Date
  }

  input OrderInput {
    orderType: String!
    recipientId: String
    bookId: String
    amount: Int
    courierCode: String!
    courierService: String!
    payment: String!
  }

  type Order {
    id: ID
    PaymentServiceId: String
    PaymentService: PaymentService
    CourierDetail: CourierDetail
    userId: String
    User: User
    grossAmount: Int
    currency: String
    transactionTime: Date
    transactionStatus: String
    shippingStatus: String
    receiptNumber: String
    expirationTime: Date
    fraudStatus: String
    ItemDetail: [ItemDetail]
    PaymentInfo: [PaymentInfo]
    CustomerDetail: CustomerDetail
    createdAt: Date
    updatedAt: Date
  }

  type CourierDetail {
    id: ID
    service: String
    description: String
    cost: Int
    Courier: Courier
    createdAt: Date
    updatedAt: Date
  }

  type OrderPaymentInfo {
    id: ID
    PaymentService: PaymentService
    grossAmount: Int
    currency: String
    transactionTime: Date
    transactionStatus: String
    shippingStatus: String
    receiptNumber: String
    expirationTime: Date
    fraudStatus: String
    PaymentInfo: [PaymentInfo]
  }

  type ItemDetail {
    id: ID
    name: String
    price: Int
    quantity: Int
    orderId: String
    createdAt: Date
    updatedAt: Date
  }

  type PaymentInfo {
    id: ID
    name: String
    value: String
    orderId: String
    createdAt: Date
    updatedAt: Date
  }

  type CustomerDetail {
    id: ID
    firstName: String
    lastName: String
    email: String
    phone: String
    orderId: String
    ShippingAddress: ShippingAddress
    createdAt: Date
    updatedAt: Date
  }

  type ShippingAddress {
    id: ID
    firstName: String
    lastName: String
    email: String
    phone: String
    address: String
    city: String
    postalCode: String
    countryCode: String
    customerDetailId: String
    createdAt: Date
    updatedAt: Date
  }

  type HowToPay {
    name: String
    stages: [String]
  }
`;

export default typeDefs;
