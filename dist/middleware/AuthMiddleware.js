"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../graphql/services/db");
const requireAuth = (req, res, next) => {
    const token = req.cookies.AuthToken;
    const usePrisma = async (decoded) => {
        try {
            const user = await db_1.db.user.findUnique({
                where: {
                    id: decoded.id,
                },
                select: {
                    role: true,
                },
            });
            if (user && user.role === "ADMIN") {
                next();
            }
            else {
                res.status(401).json({ message: "Access Denied" }).end;
            }
        }
        catch (err) {
            res.status(401).json({ message: "database error" }).end;
            throw err;
        }
    };
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            err
                ? res.status(401).json({ message: err.message }).end
                : usePrisma(decoded);
        });
    }
    else {
        res.status(401).json({ message: "Access Denied" }).end;
    }
};
exports.default = requireAuth;
