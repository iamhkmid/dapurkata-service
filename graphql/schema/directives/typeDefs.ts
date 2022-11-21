import { gql } from "graphql-tag";

const typeDefs = gql`
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

export default typeDefs;
