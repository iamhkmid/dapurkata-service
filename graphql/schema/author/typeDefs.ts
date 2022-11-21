import { gql } from "apollo-server-express";

const typeDefs = gql`
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

export default typeDefs;
