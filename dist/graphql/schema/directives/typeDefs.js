"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const typeDefs = (0, graphql_tag_1.gql) `
  directive @auth(requires: authRole!) on OBJECT | FIELD_DEFINITION

  enum authRole {
    AUTH
    ADMIN
    USER
  }
`;
// AUTH > required auth
// ADMIN > required auth & role = "ADMIN"
// USERORADMIN > required auth & (role = "ADMIN" | role = "USER" with userId)
// USER > required auth & role = "USER"
exports.default = typeDefs;
