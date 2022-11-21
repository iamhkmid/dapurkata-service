"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    dashboard: Dashboard @auth(requires: ADMIN)
    onlineUsers: [onlineUsers]
  }

  type Subscription {
    onlineUsers: [onlineUsers]
  }

  type Dashboard {
    totalOrders: Int
    totalIncome: Int
    totalUsers: Int
    totalProducts: Int
    lastOrders: [dashboardLastOrders]
    graph: dashboardGraph
  }
  type dashboardGraph {
    labels: [String]
    data: [Int]
  }
  type onlineUsers {
    id: String
    firstName: String
    lastName: String
    role: String
  }
  type dashboardLastOrders {
    id: String
    grossAmount: Int
    CustomerDetail: dashboardCustomerDetail
    transactionStatus: String
    transactionTime: Date
  }
  type dashboardCustomerDetail {
    firstName: String
    lastName: String
  }
`;
exports.default = typeDefs;
