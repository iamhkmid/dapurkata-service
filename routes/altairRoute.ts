import { altairExpress } from "altair-express-middleware";
import express from "express";

const Router = express.Router();

Router.use(
  "/",
  (req, res, next) => {
    process.env.NODE_ENV === "development"
      ? next()
      : res.end("Development only");
  },
  altairExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://localhost:3000/subscriptions`,
    initialQuery: ``,
  })
);

export default Router;
