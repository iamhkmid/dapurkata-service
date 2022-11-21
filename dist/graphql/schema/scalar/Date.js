"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateScalar = void 0;
const graphql_1 = require("graphql");
exports.dateScalar = new graphql_1.GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
        return new Date(value); // value from the client
    },
    serialize(value) {
        return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.INT) {
            return new Date(+ast.value); // ast value is always in string format
        }
        return null;
    },
});
