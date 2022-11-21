import { gql } from "apollo-server-express";

const typeDefs = gql`
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

export default typeDefs;
