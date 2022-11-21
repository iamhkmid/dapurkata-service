"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    author(authorId: ID!): Author
    authors: [Author]
  }

  type Mutation {
    createAuthor(data: cAuthorData!): Author @auth(requires: ADMIN)
    updateAuthor(authorId: ID!, data: uAuthorData!): Author
      @auth(requires: ADMIN)
    deleteAuthor(authorId: ID!): Author @auth(requires: ADMIN)
  }

  input cAuthorData {
    name: String
  }
  input uAuthorData {
    name: String
  }

  type Author {
    id: ID
    name: String
    Book: [Book]
    createdAt: Date
    updatedAt: Date
  }
`;
exports.default = typeDefs;
