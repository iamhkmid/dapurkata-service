import { gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

const typeDefs = gql`
  type Query {
    courier(isEnabled: Boolean): [Courier] @auth(requires: AUTH)
    provinces: [Province] @auth(requires: AUTH)
    province(province_id: ID!): Province @auth(requires: AUTH)
    cities(province_id: ID): [City] @auth(requires: AUTH)
    city(city_id: ID!, province_id: String): City @auth(requires: AUTH)
    courierCost(destination: String!, weight: Int!, courier: String!): Cost
      @auth(requires: AUTH)
  }

  type Courier {
    code: ID
    name: String
    isEnabled: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type Province {
    province_id: ID
    province: String
  }

  type City {
    city_id: ID
    city_name: String
    province_id: String
    province: String
    type: String
    postal_code: String
  }
  type Cost {
    code: String
    name: String
    costs: [CourierService]
  }
  type CourierService {
    service: String
    description: String
    cost: [CostValue]
  }
  type CostValue {
    value: Int
    etd: String
    note: String
  }
`;

export default typeDefs;
