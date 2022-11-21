import _ from "lodash";
import * as scalar from "./scalar";
import * as author from "./author/resolvers";
import * as publisher from "./publisher/resolvers";
import * as category from "./category/resolvers";
import * as book from "./book/resolvers";
import * as auth from "./auth/resolvers";
import * as courier from "./courier/resolvers";
import * as user from "./user/resolvers";
import * as shoppingCart from "./shoppingCart/resolvers";
import * as recipient from "./recipient/resolvers";
import * as transaction from "./transaction/resolvers";
import * as footerInfo from "./footerInfo/resolvers";
import * as wishlist from "./wishlist/resolvers";
import * as dashboard from "./dashboard/resolvers";

const resolvers = _.merge(
  scalar.resolvers,
  category,
  author,
  publisher,
  book,
  user,
  courier,
  auth,
  shoppingCart,
  recipient,
  transaction,
  footerInfo,
  dashboard,
  wishlist
);
export default resolvers;
