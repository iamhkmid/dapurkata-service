"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const checkFile = (req, res, next) => {
    fs_1.default.access(path_1.default.join(process.cwd(), `/static/uploads${req.path}`), fs_1.default.constants.R_OK, (error) => {
        if (error) {
            res.status(404).json({ message: "File not found" }).end;
        }
        else {
            next();
        }
    });
};
exports.default = checkFile;
