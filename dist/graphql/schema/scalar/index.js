"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = exports.resolvers = void 0;
const Date_1 = require("./Date");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_upload_1 = require("graphql-upload");
exports.resolvers = {
    Date: Date_1.dateScalar,
    Upload: graphql_upload_1.GraphQLUpload,
};
exports.typeDefs = (0, apollo_server_express_1.gql) `
  scalar Date
  scalar Upload
`;
