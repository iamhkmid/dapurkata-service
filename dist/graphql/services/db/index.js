"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
if (process.env.NODE_ENV === "production") {
    exports.db = new client_1.PrismaClient();
}
else {
    if (!global["prisma"]) {
        global["prisma"] = new client_1.PrismaClient();
    }
    exports.db = global["prisma"];
}
