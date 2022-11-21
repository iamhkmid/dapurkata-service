"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    checkUser: CheckUser
  }

  type Mutation {
    login(username: String!, password: String!, rememberMe: Boolean!): signin
    googleOauth2Verify(code: String!): signin
    register(data: RegisterData!, userPic: Upload): Register
    resendConfirmCode(email: String!, type: String): ResendConfirmCode
    registerConfirmation(
      email: String!
      confirmCode: String!
    ): RegisterConfirmation
    resetPassword(
      email: String!
      confirmCode: String!
      password: String!
    ): ResetPassword
  }

  type signin {
    jwt: String
    user: CheckUser
  }

  type Register {
    type: String
    email: String
    expirationTime: Date
    fetchWaitTime: Date
    message: String
  }

  type ResendConfirmCode {
    type: String
    email: String
    expirationTime: Date
    fetchWaitTime: Date
    message: String
  }

  type ResetPassword {
    message: String
  }

  type RegisterConfirmation {
    user: registerUserData
    message: String
  }

  type registerUserData {
    id: ID
    firstName: String
    lastName: String
    username: String
    email: String
    role: EnumRole
    phone: String
  }

  input RegisterData {
    firstName: String!
    lastName: String
    username: String!
    email: String!
    password: String!
    phone: String
  }

  type CheckUser {
    id: ID
    firstName: String
    lastName: String
    username: String
    email: String
    role: EnumRole
    phone: String
    userPicture: String
  }
`;
exports.default = typeDefs;
