"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const utils_1 = require("./utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_2 = require("../user/utils");
const uploadFIle_1 = require("../../utils/uploadFIle");
const axios_1 = __importDefault(require("axios"));
const cuid_1 = __importDefault(require("cuid"));
exports.Query = {
    checkUser: async (_, __, { db, req }) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!!token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const findUser = await db.user.findUnique({
                    where: { id: decoded["id"] },
                });
                if (!findUser)
                    throw new apollo_server_errors_1.AuthenticationError("User not found");
                if (!findUser.isActive)
                    throw new apollo_server_errors_1.AuthenticationError("Akun belum aktif");
                return findUser;
            }
            catch (error) {
                throw error;
            }
        }
        else {
            throw new apollo_server_errors_1.AuthenticationError("Authentication is required");
        }
    },
};
exports.Mutation = {
    login: async (_, args, { db, mail }) => {
        const { username, password, rememberMe } = args;
        const findUser = await db.user.findUnique({
            where: { username },
        });
        if (!findUser)
            throw new apollo_server_errors_1.AuthenticationError("Username or Password incorrect");
        if (!findUser.isActive)
            throw new apollo_server_errors_1.AuthenticationError("Akun belum aktif");
        const checkPw = await bcrypt_1.default.compare(password, findUser.password);
        if (!checkPw)
            throw new apollo_server_errors_1.AuthenticationError("Username or Password incorrect");
        const token = (0, utils_1.createToken)({
            id: findUser.id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            role: findUser.role,
        });
        return { jwt: token, user: findUser };
    },
    googleOauth2Verify: async (_, { code }, { db, mail }) => {
        let user, googleUser;
        const { access_token, id_token } = await (0, utils_1.getGoogleOauth2Tokens)({ code });
        const apiURL = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
        const headers = { Authorization: `Bearer ${id_token}` };
        try {
            googleUser = await axios_1.default.get(apiURL, { headers });
            user = await db.user.findUnique({
                where: { email: googleUser.data.email },
            });
        }
        catch (error) {
            throw new apollo_server_errors_1.ApolloError("Gagal masuk dengan Google Account");
        }
        if (!user) {
            const { pictureDir } = await (0, uploadFIle_1.makeDirFile)({
                dirLoc: "/server/static/uploads/profile",
            });
            user = await db.user.create({
                data: {
                    firstName: googleUser.data.given_name,
                    lastName: googleUser.data.family_name || undefined,
                    email: googleUser.data.email,
                    username: `user${(0, cuid_1.default)()}`,
                    password: await (0, utils_2.hashPassword)((0, cuid_1.default)()),
                    role: "USER",
                    userPicture: googleUser.data.picture || undefined,
                    pictureDir,
                    isActive: true,
                },
            });
        }
        const token = (0, utils_1.createToken)({
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        });
        return { jwt: token, user };
    },
    register: async (_, { data, userPic }, { mail, cache, db }) => {
        const check = await (0, utils_2.checkUser)(data);
        if (!!check)
            throw new apollo_server_errors_1.ValidationError(check + " already exists");
        const { username, email, password, phone, firstName, lastName } = data;
        const { pictureDir } = await (0, uploadFIle_1.makeDirFile)({
            dirLoc: "/server/static/uploads/profile",
        });
        const profilePicInfo = userPic &&
            (await (0, utils_2.saveUserPic)({ pictureDir, userPic }).catch((err) => {
                (0, uploadFIle_1.removeDir)(pictureDir);
                throw err;
            }));
        const cUser = await db.user.create({
            data: {
                firstName,
                lastName: lastName || undefined,
                username,
                email,
                password: await (0, utils_2.hashPassword)(password),
                role: "USER",
                phone: phone || undefined,
                isActive: false,
                pictureDir,
                userPicture: (profilePicInfo === null || profilePicInfo === void 0 ? void 0 : profilePicInfo.url) || undefined,
            },
        });
        const expr = 300000; /* 5 minutes*/
        const reqInterval = 90000; /* 1.5 minute*/
        const expirationTime = new Date(new Date().getTime() + expr);
        const canRequestAt = new Date(new Date().getTime() + reqInterval);
        const confirmCode = (0, utils_1.genConfirmCode)(6);
        const cacheData = {
            canRequestAt,
            confirmCode,
            type: "ACTIVATE_ACCOUNT",
        };
        cache.set(cUser.email, cacheData, expr);
        try {
            await mail.sendMail({
                from: `Penerbit Dapurkata <${process.env.COMPANY_EMAIL}>`,
                to: data.email,
                subject: "Konfirmasi Pendaftaran",
                html: (0, utils_1.confirmCodeTemp)({ expirationTime, confirmCode }), // html body
            });
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("Error sending email on server");
        }
        return {
            email,
            type: "ACTIVATE_ACCOUNT",
            expirationTime,
            fetchWaitTime: canRequestAt,
            message: "Kode konfirmasi telah dikirim melalui email",
        };
    },
    resendConfirmCode: async (_, args, { mail, cache, db }) => {
        const { email, type } = args;
        if (cache.has(email)) {
            const registerData = cache.get(email);
            const timeNow = new Date().getTime();
            if (timeNow < registerData.canRequestAt.getTime())
                throw new apollo_server_errors_1.ApolloError(`Tunggu sebentar, waktu tunggu ${Math.ceil((registerData.canRequestAt.getTime() - timeNow) / 1000)} detik`);
        }
        const fUser = await db.user.findUnique({
            where: { email },
            select: { isActive: true },
        });
        if (!fUser)
            throw new apollo_server_errors_1.ApolloError("Email belum terdaftar");
        if (type === "ACTIVATE_ACCOUNT" && fUser.isActive)
            throw new apollo_server_errors_1.ApolloError("Akun sudah aktif");
        const expr = 300000; /* 5 minutes*/
        const reqInterval = 90000; /* 1.5 minute*/
        const expirationTime = new Date(new Date().getTime() + expr);
        const canRequestAt = new Date(new Date().getTime() + reqInterval);
        const confirmCode = (0, utils_1.genConfirmCode)(6);
        let subject;
        const cacheData = {
            canRequestAt,
            confirmCode,
            type,
        };
        if (type === "ACTIVATE_ACCOUNT") {
            subject = "Konfirmasi Pendaftaran";
        }
        else if (type === "RESET_PASSWORD") {
            subject = "Reset Password";
        }
        const emailOptions = {
            from: `Penerbit Dapurkata <${process.env.COMPANY_EMAIL}>`,
            to: email,
            subject,
            html: (0, utils_1.confirmCodeTemp)({ expirationTime, confirmCode }), // html body
        };
        try {
            await mail.sendMail(emailOptions);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("Error sending email on server");
        }
        cache.set(email, { confirmCode, canRequestAt, type }, expr);
        return {
            email,
            type: cacheData.type,
            expirationTime,
            fetchWaitTime: canRequestAt,
            message: "Kode konfirmasi telah dikirim melalui email",
        };
    },
    registerConfirmation: async (_, args, { mail, cache, db }) => {
        const { email, confirmCode } = args;
        if (!cache.has(email))
            throw new apollo_server_errors_1.ApolloError("Kode konfirmasi tidak ditemukan atau kaldaluarsa");
        const cacheData = cache.get(email);
        if (cacheData.confirmCode !== confirmCode ||
            cacheData.type !== "ACTIVATE_ACCOUNT")
            throw new apollo_server_errors_1.ApolloError("Kode konfirmasi salah");
        const uUser = await db.user.update({
            where: { email },
            data: { isActive: true },
        });
        cache.del(email);
        return {
            user: uUser,
            message: "Akun berhasil diaktifkan",
        };
    },
    resetPassword: async (_, args, { mail, cache, db }) => {
        const { email, confirmCode, password } = args;
        if (!cache.has(email))
            throw new apollo_server_errors_1.ApolloError("Kode konfirmasi tidak ditemukan atau kaldaluarsa");
        const cacheData = cache.get(email);
        if (cacheData.confirmCode !== confirmCode ||
            cacheData.type !== "RESET_PASSWORD")
            throw new apollo_server_errors_1.ApolloError("Kode konfirmasi salah");
        await db.user.update({
            where: { email },
            data: {
                password: await (0, utils_2.hashPassword)(password),
            },
        });
        cache.del(email);
        return {
            message: "Berhasil mengubah password",
        };
    },
};
