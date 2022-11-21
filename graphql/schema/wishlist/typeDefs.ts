import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    wishlist: Wishlist @auth(requires: USER)
  }

  type Mutation {
    addWishlist(bookId: String!): WishlistMutation @auth(requires: USER)
    deleteWishlist(bookId: String!): WishlistMutation @auth(requires: USER)
  }

  type Wishlist {
    id: String
    userId: String
    Book: [WishlistBook]
    createdAt: Date
    updatedAt: Date
  }

  type WishlistBook {
    id: String
    title: String
    coverURL: String
    Author: WishlistBookAuthor
  }

  type WishlistBookAuthor {
    id: String
    name: String
  }

  type WishlistMutation {
    message: String
  }
`;

export default typeDefs;
