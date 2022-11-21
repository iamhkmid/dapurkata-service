"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    recipient(recipientId: ID!): Recipient @auth(requires: AUTH)
    recipients(userId: ID!): [Recipient] @auth(requires: AUTH)
  }
  type Mutation {
    createRecipient(data: cRcptData!): Recipient @auth(requires: USER)
    updateRecipient(data: uRcptData!): Recipient @auth(requires: USER)
    deleteRecipient(recipientId: ID!): Message @auth(requires: USER)
  }

  type Message {
    message: String
  }

  type Recipient {
    id: ID
    firstName: String
    lastName: String
    email: String
    phone: String
    City: City
    address: String
    userId: String
    User: User
    createdAt: Date
    updatedAt: Date
  }

  type City {
    id: ID
    name: String
    postalCode: String
    Province: Province
  }

  type Province {
    id: ID
    name: String
  }

  input cRcptData {
    firstName: String!
    lastName: String
    email: String!
    phone: String!
    cityId: String!
    address: String!
  }

  input uRcptData {
    recipientId: String!
    firstName: String!
    lastName: String
    email: String!
    phone: String!
    cityId: String!
    address: String!
  }
`;
exports.default = typeDefs;
