import { gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

const typeDefs = gql`
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

export default typeDefs;
