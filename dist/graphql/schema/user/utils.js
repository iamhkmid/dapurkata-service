"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.saveUserPic = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../services/db");
const uploadFIle_1 = require("../../utils/uploadFIle");
const hashPassword = async (pw) => {
    const salt = await bcrypt_1.default.genSalt();
    return await bcrypt_1.default.hash(pw, salt);
};
exports.hashPassword = hashPassword;
const saveUserPic = async (options) => {
    const { userPic, pictureDir } = options;
    if (userPic) {
        const { pathFile } = await (0, uploadFIle_1.saveImg)({ pictureDir, file: userPic });
        return { url: pathFile.split("static")[1] };
    }
    else {
        return { url: undefined };
    }
};
exports.saveUserPic = saveUserPic;
const checkUser = async (data) => {
    let error;
    const addError = (newError) => {
        error ? (error = `${error}, ${newError}`) : (error = newError);
    };
    if (await db_1.db.user.findUnique({ where: { username: data.username } }))
        addError("username");
    if (await db_1.db.user.findUnique({ where: { email: data.email } }))
        addError("email");
    if (await db_1.db.user.findUnique({ where: { phone: data.phone } }))
        addError("phone");
    return error;
};
exports.checkUser = checkUser;
