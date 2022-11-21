"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleOauth2_1 = require("../middleware/googleOauth2");
const Router = express_1.default.Router();
Router.use("/google", (req, res, next) => {
    res.redirect((0, googleOauth2_1.getGoogleAuthURL)());
});
exports.default = Router;
