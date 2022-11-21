"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleOauth2Tokens = exports.confirmCodeTemp = exports.genConfirmCode = exports.createToken = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const querystring_1 = __importDefault(require("querystring"));
const createToken = (props) => {
    const maxAge = 1 * 24 * 60 * 60;
    return jsonwebtoken_1.default.sign(props, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};
exports.createToken = createToken;
const genConfirmCode = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.genConfirmCode = genConfirmCode;
const confirmCodeTemp = (props) => {
    const { confirmCode, expirationTime } = props;
    return `
  <div style="width:100%;margin:0;">
    <div style="display:inline-block;text-align:center;padding:10px 20px;width:100%;background-color:#f1f2f3;padding:30px 0;">
      <div style="display:inline-block;text-align:center;margin-top:20px;">
        <h1 style="font-size:14px;padding:0;margin:0;font-weight:400;">
          KODE KONFIRMASI
        </h1>
        <h1 style="background-color:#dadfe1;font-size:25px;font-weight:700;padding:5px 30px;width:fit-content;margin:0;">
          ${confirmCode}
        </h1>
      </div>
      <h1 style="font-size:14px;font-weight:400;padding:0;margin:10px 0 0 0;">
        Dapat digunakan sampai : ${(0, moment_1.default)(expirationTime)
        .local()
        .format("DD-MM-YYYY HH:mm.ss")}
      </h1>
      <h1 style="font-size:12px;font-weight:400;padding:0;margin:30px 0 0 0;">
        Penerbit DapurKata © 2021 ~ Made with ❤️
      </h1>
    </div>
  </div>`;
};
exports.confirmCodeTemp = confirmCodeTemp;
const getGoogleOauth2Tokens = (props) => {
    const { code } = props;
    const GOOGLE_CLIENT_ID = process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_ID
        : process.env.GOOGLE_CLIENT_ID_DEV;
    const GOOGLE_CLIENT_SECRET = process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_SECRET
        : process.env.GOOGLE_CLIENT_SECRET_DEV;
    const BACKEND_URL = process.env.NODE_ENV === "production"
        ? process.env.BACKEND_URL
        : process.env.BACKEND_URL_DEV;
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri: `${BACKEND_URL}/auth/login`,
        grant_type: "authorization_code",
    };
    return axios_1.default
        .post(url, querystring_1.default.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => res.data)
        .catch((error) => {
        throw new apollo_server_errors_1.ApolloError("Gagal masuk dengan Google Account");
    });
};
exports.getGoogleOauth2Tokens = getGoogleOauth2Tokens;
