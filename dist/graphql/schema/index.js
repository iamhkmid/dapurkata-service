"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs_1 = __importDefault(require("./typeDefs"));
const resolvers_1 = __importDefault(require("./resolvers"));
const schema_1 = require("@graphql-tools/schema");
const AuthDirectiveTransformer_1 = __importDefault(require("./directives/AuthDirectiveTransformer"));
let schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
});
schema = (0, AuthDirectiveTransformer_1.default)(schema, "auth");
exports.default = schema;
