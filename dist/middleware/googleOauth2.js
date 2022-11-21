"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthURL = void 0;
const querystring_1 = __importDefault(require("querystring"));
const getGoogleAuthURL = () => {
    const GOOGLE_CLIENT_ID = process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_ID
        : process.env.GOOGLE_CLIENT_ID_DEV;
    const GOOGLE_CLIENT_SECRET = process.env.NODE_ENV === "production"
        ? process.env.GOOGLE_CLIENT_SECRET
        : process.env.GOOGLE_CLIENT_SECRET_DEV;
    const BACKEND_URL = process.env.NODE_ENV === "production"
        ? process.env.BACKEND_URL
        : process.env.BACKEND_URL_DEV;
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${BACKEND_URL}/auth/login`,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    return `${rootUrl}?${querystring_1.default.stringify(options)}`;
};
exports.getGoogleAuthURL = getGoogleAuthURL;
