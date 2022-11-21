"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Subscription = exports.Mutation = exports.Query = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const apollo_server_express_1 = require("apollo-server-express");
const uploadFIle_1 = require("../../utils/uploadFIle");
const validateUser_1 = require("../../utils/validateUser");
const utils_1 = require("./utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const pubsub_1 = __importDefault(require("../../services/pubsub"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.Query = {
    user: async (_, { userId }, { user, db }) => {
        const findUser = await db.user.findUnique({ where: { id: userId } });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER_OR_ADMIN",
            targetId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            currRole: user.role,
            currId: user.id,
        });
        return findUser;
    },
    users: async (_, __, { db }) => await db.user.findMany(),
    notification: async (_, __, { db, user }) => await db.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    }),
};
exports.Mutation = {
    createUser: async (_, { data, userPic }, { user, db }) => {
        const check = await (0, utils_1.checkUser)(data);
        if (!!check)
            throw new apollo_server_errors_1.ValidationError(check + " already exists");
        const { username, email, password, role, phone, firstName, lastName } = data;
        const { pictureDir } = await (0, uploadFIle_1.makeDirFile)({
            dirLoc: "/static/uploads/profile",
        });
        const profilePicInfo = userPic &&
            (await (0, utils_1.saveUserPic)({ pictureDir, userPic }).catch((err) => {
                (0, uploadFIle_1.removeDir)(pictureDir);
                throw err;
            }));
        return await db.user.create({
            data: {
                firstName,
                lastName: lastName || undefined,
                username,
                email,
                password: await (0, utils_1.hashPassword)(password),
                role: role && (user === null || user === void 0 ? void 0 : user.role) === "ADMIN" ? role : "USER",
                phone: phone || undefined,
                isActive: true,
                pictureDir,
                userPicture: (profilePicInfo === null || profilePicInfo === void 0 ? void 0 : profilePicInfo.url) || undefined,
            },
        });
    },
    updateUser: async (_, { userId, data }, { user, db }) => {
        const { username, email, phone, firstName, lastName, isActive } = data;
        const findUser = await db.user.findUnique({ where: { id: userId } });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER_OR_ADMIN",
            targetId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            currRole: user.role,
            currId: user.id,
        });
        const userFields = {
            firstName,
            lastName: lastName || undefined,
            username,
            email,
            phone: phone || undefined,
            isActive: isActive && user.role === "ADMIN" ? isActive : undefined,
        };
        return await db.user.update({
            where: { id: userId },
            data: userFields,
        });
    },
    deleteUser: async (_, { userId, username }, { db }) => {
        const findUser = await db.user.findUnique({ where: { id: userId } });
        if (!findUser)
            throw new apollo_server_express_1.ApolloError("User tidak ditemukan");
        if (findUser.username === username) {
            return await db.user.delete({ where: { id: userId } });
        }
        else {
            throw new apollo_server_express_1.ApolloError("Username salah");
        }
    },
    changeRole: async (_, args, { db, user }) => {
        const { userId, role, password } = args;
        const findUser = await db.user.findUnique({
            where: { id: user.id },
            select: { password: true },
        });
        const checkPw = await bcrypt_1.default.compare(password, findUser.password);
        if (!checkPw)
            throw new apollo_server_errors_1.AuthenticationError("Password salah");
        const updateUser = await db.user.update({
            where: { id: userId },
            data: {
                role,
            },
        });
        return updateUser;
    },
    changePassword: async (_, { data }, { db, user }) => {
        const { newPassword, oldPassword } = data;
        const findUser = await db.user.findUnique({
            where: { id: user.id },
            select: { id: true, password: true },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER_OR_ADMIN",
            targetId: findUser === null || findUser === void 0 ? void 0 : findUser.id,
            currRole: user.role,
            currId: user.id,
        });
        const checkPw = await bcrypt_1.default.compare(oldPassword, findUser.password);
        if (!checkPw) {
            throw new apollo_server_express_1.ApolloError("Password incorrect");
        }
        else {
            const updatePass = await db.user.update({
                where: { id: user.id },
                data: { password: await (0, utils_1.hashPassword)(newPassword) },
            });
            if (updatePass) {
                return { message: "Password change successful" };
            }
            else {
                throw new apollo_server_express_1.ApolloError("Failed to save data");
            }
        }
    },
    changeUserPic: async (_, { userPic }, { db, user }) => {
        const findUser = await db.user.findUnique({
            where: { id: user.id },
            select: { id: true, username: true, pictureDir: true, userPicture: true },
        });
        const { pictureDir } = await (0, uploadFIle_1.makeDirFile)({
            dirLoc: `/static/uploads/profile/${findUser.username}/`,
        });
        const filePath = path_1.default.join(process.cwd(), `/static/${findUser.userPicture}`);
        try {
            fs_1.default.unlinkSync(filePath);
        }
        catch (error) { }
        const profilePicInfo = userPic &&
            (await (0, utils_1.saveUserPic)({ pictureDir, userPic }).catch((err) => {
                throw err;
            }));
        await db.user.update({
            where: { id: user.id },
            data: { pictureDir, userPicture: (profilePicInfo === null || profilePicInfo === void 0 ? void 0 : profilePicInfo.url) || undefined },
        });
        return { message: "Berhasil ubah foto" };
    },
    deleteUserPic: async (_, __, { db, user }) => {
        const findUser = await db.user.findUnique({
            where: { id: user.id },
            select: { id: true, pictureDir: true, userPicture: true },
        });
        const filePath = path_1.default.join(process.cwd(), `/static/${findUser.userPicture}`);
        fs_1.default.unlink(filePath, async (err) => {
            if (err && err.code == "ENOENT") {
                // file not found
                await db.user.update({
                    where: { id: user.id },
                    data: { userPicture: null },
                });
            }
            else if (err) {
                throw new apollo_server_express_1.ApolloError("Something went wrong. Please try again later.");
            }
            else {
                await db.user.update({
                    where: { id: user.id },
                    data: { userPicture: null },
                });
            }
        });
        return { message: "Berhasil hapus foto" };
    },
};
exports.Subscription = {
    notification: {
        subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.default.asyncIterator("NOTIFICATION"), async (payload, variables, context) => {
            return payload.notification.userId === context.user.id;
        }),
    },
};
exports.User = {
    ShoppingCart: async ({ id }, _, { db }) => {
        const findUser = await db.user.findUnique({
            where: { id },
            select: {
                ShoppingCart: {
                    include: {
                        Book: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                                weight: true,
                                discount: true,
                                Author: { select: { id: true, name: true } },
                                BookPicture: true,
                            },
                        },
                    },
                },
            },
        });
        const shoppingcart = findUser.ShoppingCart.reduce((acc, curr) => {
            var _a;
            const { Book } = curr, rest = __rest(curr, ["Book"]);
            const coverURL = (_a = Book.BookPicture.find((val) => val.type === "COVER")) === null || _a === void 0 ? void 0 : _a.url;
            return [
                ...acc,
                {
                    id: rest.id,
                    amount: rest.amount,
                    Book: {
                        id: Book.id,
                        title: Book.title,
                        price: Book.price,
                        weight: Book.weight,
                        discount: Book.discount,
                        Author: { id: Book.Author.id, name: Book.Author.name },
                        coverURL,
                    },
                    createdAt: rest.createdAt,
                    updatedAt: rest.updatedAt,
                },
            ];
        }, []);
        return shoppingcart;
    },
    Recipient: async ({ id }, _, { db }) => (await db.user.findUnique({
        where: { id },
        select: {
            Recipient: { include: { City: { include: { Province: true } } } },
        },
    })).Recipient,
    Wishlist: async ({ id }, _, { db }) => {
        const wishlist = await db.wishlist.findUnique({
            where: { userId: id },
            include: {
                Book: {
                    select: {
                        id: true,
                        title: true,
                        BookPicture: { where: { type: { contains: "COVER" } } },
                        Author: { select: { id: true, name: true } },
                    },
                },
            },
        });
        const { Book } = wishlist, resWishlist = __rest(wishlist, ["Book"]);
        const books = Book.reduce((acc, curr) => {
            var _a;
            return [
                ...acc,
                {
                    id: curr.id,
                    title: curr.title,
                    coverURL: ((_a = curr.BookPicture[0]) === null || _a === void 0 ? void 0 : _a.url) || null,
                    Author: curr.Author,
                },
            ];
        }, []);
        return Object.assign(Object.assign({}, resWishlist), { Book: books });
    },
    Order: async ({ id }, _, { db }) => {
        const findUser = await db.user.findUnique({
            where: { id },
            select: {
                Order: true,
            },
        });
        return findUser.Order;
    },
};
