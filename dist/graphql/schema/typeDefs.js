"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
const typeDefs_1 = __importDefault(require("./author/typeDefs"));
const typeDefs_2 = __importDefault(require("./publisher/typeDefs"));
const typeDefs_3 = __importDefault(require("./category/typeDefs"));
const typeDefs_4 = __importDefault(require("./book/typeDefs"));
const typeDefs_5 = __importDefault(require("./user/typeDefs"));
const typeDefs_6 = __importDefault(require("./shoppingCart/typeDefs"));
const typeDefs_7 = __importDefault(require("./recipient/typeDefs"));
const typeDefs_8 = __importDefault(require("./auth/typeDefs"));
const typeDefs_9 = __importDefault(require("./courier/typeDefs"));
const typeDefs_10 = __importDefault(require("./transaction/typeDefs"));
const typeDefs_11 = __importDefault(require("./footerInfo/typeDefs"));
const typeDefs_12 = __importDefault(require("./dashboard/typeDefs"));
const typeDefs_13 = __importDefault(require("./wishlist/typeDefs"));
const typeDefs_14 = __importDefault(require("./directives/typeDefs"));
const scalar = __importStar(require("./scalar"));
const typeDefs = [
    scalar.typeDefs,
    typeDefs_1.default,
    typeDefs_2.default,
    typeDefs_3.default,
    typeDefs_4.default,
    typeDefs_5.default,
    typeDefs_6.default,
    typeDefs_7.default,
    typeDefs_9.default,
    typeDefs_8.default,
    typeDefs_10.default,
    typeDefs_11.default,
    typeDefs_14.default,
    typeDefs_12.default,
    typeDefs_13.default,
];
exports.default = (0, merge_1.mergeTypeDefs)(typeDefs);
