"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    category(categoryId: ID!): Category
    categories: [Category]
  }

  type Mutation {
    createCategory(data: cCatData!): Category @auth(requires: ADMIN)
    updateCategory(categoryId: ID!, data: uCatData!): Category
      @auth(requires: ADMIN)
    deleteCategory(categoryId: ID!): Category @auth(requires: ADMIN)
  }

  input cCatData {
    name: String!
    group: EnumGroup!
  }
  input uCatData {
    name: String!
    group: EnumGroup!
  }
  enum EnumGroup {
    TypeCategory
    ReaderGroup
    LibraryType
    Published
    Other
  }

  type Category {
    id: ID
    name: String
    group: String
    Book: [Book]
    createdAt: Date
    updatedAt: Date
  }
`;
exports.default = typeDefs;
