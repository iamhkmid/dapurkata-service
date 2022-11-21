import { mergeTypeDefs } from "@graphql-tools/merge";
import author from "./author/typeDefs";
import publisher from "./publisher/typeDefs";
import category from "./category/typeDefs";
import book from "./book/typeDefs";
import user from "./user/typeDefs";
import shoppingCart from "./shoppingCart/typeDefs";
import recipient from "./recipient/typeDefs";
import auth from "./auth/typeDefs";
import courier from "./courier/typeDefs";
import transaction from "./transaction/typeDefs";
import footerInfo from "./footerInfo/typeDefs";
import dashboard from "./dashboard/typeDefs";
import wishlist from "./wishlist/typeDefs";
import directive from "./directives/typeDefs";
import * as scalar from "./scalar";

const typeDefs = [
  scalar.typeDefs,
  author,
  publisher,
  category,
  book,
  user,
  shoppingCart,
  recipient,
  courier,
  auth,
  transaction,
  footerInfo,
  directive,
  dashboard,
  wishlist,
];

export default mergeTypeDefs(typeDefs);
