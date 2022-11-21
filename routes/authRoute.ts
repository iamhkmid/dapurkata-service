import express from "express";
import { getGoogleAuthURL } from "../middleware/googleOauth2";

const Router = express.Router();

Router.use("/google", (req, res, next) => {
  res.redirect(getGoogleAuthURL());
});

export default Router;
