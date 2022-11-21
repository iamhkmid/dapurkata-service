import express from "express";
import paymentNotification from "../middleware/paymentNotification";

const Router = express.Router();

Router.use("/payment-gateway", paymentNotification);

export default Router;
