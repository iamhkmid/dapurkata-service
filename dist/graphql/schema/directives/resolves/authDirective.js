"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkRole = ({ requires, role }) => {
    if (requires === "AUTH" && !(role === "ADMIN" || role === "USER")) {
        throw new apollo_server_express_1.AuthenticationError("Authentication is required");
    }
    else if (requires === "ADMIN" && role !== "ADMIN") {
        throw new apollo_server_express_1.AuthenticationError("Role authentication is not correct");
    }
    else if (requires === "USER" && role !== "USER") {
        throw new apollo_server_express_1.AuthenticationError("Role authentication is not correct");
    }
};
exports.checkRole = checkRole;
const authDirective = async (props) => {
    const { db, req, requires } = props;
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!!token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!!decoded) {
                (0, exports.checkRole)({ requires, role: decoded["role"] });
                return { user: decoded };
            }
            else {
                throw new apollo_server_express_1.AuthenticationError("User not found");
            }
        }
        catch (error) {
            throw error;
        }
    }
    else {
        throw new apollo_server_express_1.AuthenticationError("Authentication is required");
    }
};
exports.default = authDirective;
