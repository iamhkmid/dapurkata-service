import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    shoppingCart: [ShoppingCart] @auth(requires: USER)
  }

  type Mutation {
    createShoppingCart(bookId: String!, amount: Int!): ShoppingCart
      @auth(requires: USER)
    updateShoppingCart(cartId: String!, amount: Int!): ShoppingCart
      @auth(requires: USER)
    deleteShoppingCart(cartId: ID!): DeleteShoppingCart @auth(requires: USER)
  }

  type ShoppingCart {
    id: ID
    Book: ShoppingCartBook
    amount: Int
    createdAt: Date
    updatedAt: Date
  }
  type ShoppingCartBook {
    id: ID
    title: String
    price: Int
    weight: Int
    discount: Int
    coverURL: String
    Author: ShoppingCartBookAuthor
  }
  type ShoppingCartBookAuthor {
    id: ID
    name: String
  }

  type DeleteShoppingCart {
    id: ID
    message: String
  }
`;

export default typeDefs;
