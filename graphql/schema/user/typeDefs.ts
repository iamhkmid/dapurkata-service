import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    user(userId: ID!): User @auth(requires: AUTH)
    users: [User] @auth(requires: ADMIN)
    notification: [Notification] @auth(requires: USER)
  }

  type Mutation {
    createUser(data: cUserData!, userPic: Upload): User @auth(requires: ADMIN)
    updateUser(userId: ID!, data: uUserData!): User @auth(requires: AUTH)
    deleteUser(userId: ID!, username: String!): User @auth(requires: ADMIN)
    changeRole(userId: ID!, role: EnumRole!, password: String!): User
      @auth(requires: ADMIN)
    changePassword(data: cPData!): ChangePassword @auth(requires: AUTH)
    changeUserPic(userPic: Upload!): ChangeUserPic @auth(requires: AUTH)
    deleteUserPic: DeleteUserPic @auth(requires: AUTH)
  }

  type Subscription {
    notification: Notification
  }

  type ChangeUserPic {
    message: String
  }
  type DeleteUserPic {
    message: String
  }

  type Notification {
    id: ID
    title: String
    message: String
    valueName: String
    valueId: String
    userId: String
    createdAt: Date
    updatedAt: Date
  }
  input cPData {
    oldPassword: String!
    newPassword: String!
  }

  type ChangePassword {
    message: String
  }

  input cUserData {
    firstName: String!
    lastName: String
    username: String!
    email: String!
    password: String!
    role: EnumRole
    phone: String
  }

  input uUserData {
    firstName: String!
    lastName: String
    username: String!
    email: String!
    phone: String
    isActive: Boolean
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    username: String
    email: String
    role: EnumRole
    phone: String
    pictureDir: String
    Recipient: [Recipient]
    userPicture: String
    Wishlist: Wishlist
    ShoppingCart: [ShoppingCart]
    Order: [Order]
    createdAt: Date
    updatedAt: Date
  }

  enum EnumRole {
    ADMIN
    USER
  }
`;

export default typeDefs;
