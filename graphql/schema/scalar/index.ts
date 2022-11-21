import { dateScalar } from "./Date";
import { gql } from "apollo-server-express";
import { GraphQLUpload } from "graphql-upload";

export const resolvers = {
  Date: dateScalar,
  Upload: GraphQLUpload,
};

export const typeDefs = gql`
  scalar Date
  scalar Upload
`;
