"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    publisher(publisherId: ID!): Publisher
    publishers: [Publisher]
  }

  type Mutation {
    createPublisher(data: cPublisherData!): Publisher @auth(requires: ADMIN)
    updatePublisher(publisherId: ID!, data: uPublisherData!): Publisher
      @auth(requires: ADMIN)
    deletePublisher(publisherId: ID!): Publisher @auth(requires: ADMIN)
  }

  input cPublisherData {
    name: String
  }
  input uPublisherData {
    name: String
  }

  type Publisher {
    id: ID
    name: String
    Book: [Book]
    createdAt: Date
    updatedAt: Date
  }
`;
exports.default = typeDefs;
