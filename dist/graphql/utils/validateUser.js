"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const validateUser = (params) => {
    if (params.currRole !== "ADMIN" && params.currRole !== "USER") {
        throw new apollo_server_express_1.AuthenticationError("Invalid user role");
    }
    else {
        if (params.target === "ADMIN_ONLY") {
            if (params.currRole !== "ADMIN")
                throw new apollo_server_express_1.AuthenticationError("Authentication user role does not match");
        }
        else {
            const { currId, currRole, target, targetId } = params;
            if (!targetId) {
                throw new apollo_server_express_1.ApolloError("Data not found");
            }
            else if (target === "SPECIFIC_USER_OR_ADMIN" &&
                currRole !== "ADMIN" &&
                currRole === "USER" &&
                currId !== targetId) {
                throw new apollo_server_express_1.AuthenticationError("Authentication user id or role does not match");
            }
            else if (target === "SPECIFIC_USER" &&
                currRole === "USER" &&
                currId !== targetId) {
                throw new apollo_server_express_1.AuthenticationError("Authentication user id does not match");
            }
        }
    }
};
exports.validateUser = validateUser;
