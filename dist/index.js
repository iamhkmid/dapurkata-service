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
exports.corsOptions = void 0;
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const cors_1 = __importDefault(require("cors"));
const altairRoute_1 = __importDefault(require("./routes/altairRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const notificationRoute_1 = __importDefault(require("./routes/notificationRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const graphql_1 = __importDefault(require("./graphql"));
const graphql_upload_1 = require("graphql-upload");
const express_useragent_1 = __importDefault(require("express-useragent"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const PORT = parseInt(process.env.PORT || "3001");
const dev = process.env.NODE_ENV !== "production";
exports.corsOptions = { credentials: true, origin: "*" };
const gqlUploadOptions = { maxFileSize: 10000000, maxFiles: 3 };
const apiRequestLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 100,
    handler: function (req, res /*next*/) {
        return res.status(429).json({
            error: "You sent too many requests. Please wait a while then try again",
        });
    },
});
const main = async () => {
    const app = (0, express_1.default)();
    if (process.env.NODE_ENV === "production") {
        app.use((req, res, next) => {
            if (req.header("x-forwarded-proto") !== "https")
                res.redirect(`https://${req.header("host")}${req.url}`);
            else
                next();
        });
    }
    // app.use(express.static(path.join(__dirname, "../public")));
    // app.use("/_next", express.static(path.join(__dirname, "../.next")));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json());
    app.use((0, cors_1.default)(exports.corsOptions));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_useragent_1.default.express());
    app.use(apiRequestLimiter);
    app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "/server/static/uploads"), {
        fallthrough: true,
        index: false,
        redirect: false,
    }));
    app.use("/auth", authRoute_1.default);
    app.use("/graphql", (0, graphql_upload_1.graphqlUploadExpress)(gqlUploadOptions));
    app.use("/altair", altairRoute_1.default);
    app.use("/notification", notificationRoute_1.default);
    const httpServer = http.createServer(app);
    await (0, graphql_1.default)({ app, httpServer });
    httpServer.listen(PORT, (err) => {
        if (err)
            throw err;
        console.log(`Server is listening on port ${PORT}`);
        console.log(`GraphQL path: "/graphql"`);
    });
    process.on("warning", (warning) => {
        console.warn(warning.name); // Print the warning name
        console.warn(warning.message); // Print the warning message
        console.warn(warning.stack); // Print the stack trace
    });
};
main().catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
