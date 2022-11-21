"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    footerPhone: FooterPhone
    footerAddress: FooterAddress
    footerMessage: FooterMessage
    footerSocialMedia: [FooterSocialMedia]
  }

  type Mutation {
    updateFooterPhone(id: ID!, phone: String!): FooterPhone
      @auth(requires: ADMIN)
    updateFooterAddress(id: ID!, address: String!): FooterAddress
      @auth(requires: ADMIN)
    updateFooterMessage(id: ID!, message: String!): FooterMessage
      @auth(requires: ADMIN)
    updateFooterSocialMedia(
      id: ID!
      isEnabled: Boolean!
      url: String!
    ): FooterSocialMedia @auth(requires: ADMIN)
  }

  type FooterPhone {
    id: ID
    type: String
    phone: String
  }
  type FooterAddress {
    id: ID
    type: String
    address: String
  }
  type FooterMessage {
    id: ID
    type: String
    message: String
  }
  type FooterSocialMedia {
    id: ID
    type: String
    name: String
    url: String
    isEnabled: Boolean
  }
`;
exports.default = typeDefs;
