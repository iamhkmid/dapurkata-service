import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import AuthDirectiveTransformer from "./directives/AuthDirectiveTransformer";

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = AuthDirectiveTransformer(schema, "auth");
export default schema;
