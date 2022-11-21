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
const lodash_1 = __importDefault(require("lodash"));
const scalar = __importStar(require("./scalar"));
const author = __importStar(require("./author/resolvers"));
const publisher = __importStar(require("./publisher/resolvers"));
const category = __importStar(require("./category/resolvers"));
const book = __importStar(require("./book/resolvers"));
const auth = __importStar(require("./auth/resolvers"));
const courier = __importStar(require("./courier/resolvers"));
const user = __importStar(require("./user/resolvers"));
const shoppingCart = __importStar(require("./shoppingCart/resolvers"));
const recipient = __importStar(require("./recipient/resolvers"));
const transaction = __importStar(require("./transaction/resolvers"));
const footerInfo = __importStar(require("./footerInfo/resolvers"));
const wishlist = __importStar(require("./wishlist/resolvers"));
const dashboard = __importStar(require("./dashboard/resolvers"));
const resolvers = lodash_1.default.merge(scalar.resolvers, category, author, publisher, book, user, courier, auth, shoppingCart, recipient, transaction, footerInfo, dashboard, wishlist);
exports.default = resolvers;
