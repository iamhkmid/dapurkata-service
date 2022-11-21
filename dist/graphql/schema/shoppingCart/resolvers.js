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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const validateUser_1 = require("../../utils/validateUser");
exports.Query = {
    shoppingCart: async (_, __, { user, db }) => {
        const findUser = await db.user.findUnique({
            where: { id: user.id },
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
};
exports.Mutation = {
    createShoppingCart: async (_, args, { user, db }) => {
        var _a;
        const { amount, bookId } = args;
        const findUser = await db.user.findUnique({
            where: { id: user.id },
            select: { id: true, ShoppingCart: { include: { Book: true } } },
        });
        const findBook = await db.book.findUnique({
            where: { id: bookId },
            select: { weight: true, stock: true },
        });
        if (amount > findBook.stock)
            throw new apollo_server_express_1.ApolloError("Stok barang tidak mencukupi");
        const maxWeight = Number(process.env.MAX_COURIER_WEIGHT);
        const cartWeight = findUser.ShoppingCart.reduce((acc, curr) => acc + curr.Book.weight * curr.amount, 0);
        const allowed = cartWeight + findBook.weight * amount <= maxWeight;
        if (allowed) {
            const createSC = await db.shoppingCart.create({
                data: {
                    amount,
                    User: { connect: { id: user.id } },
                    Book: { connect: { id: bookId } },
                },
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
            });
            return {
                id: createSC.id,
                amount: createSC.amount,
                createdAt: createSC.createdAt,
                updatedAt: createSC.updatedAt,
                Book: {
                    id: createSC.Book.id,
                    title: createSC.Book.title,
                    price: createSC.Book.price,
                    discount: createSC.Book.discount,
                    weight: createSC.Book.weight,
                    coverURL: (_a = createSC.Book.BookPicture.find((val) => val.type === "COVER")) === null || _a === void 0 ? void 0 : _a.url,
                    Author: {
                        id: createSC.Book.Author.id,
                        name: createSC.Book.Author.name,
                    },
                },
            };
        }
        else {
            throw new apollo_server_express_1.ApolloError("Maksimal berat keranjang 30kg.");
        }
    },
    updateShoppingCart: async (_, args, { user, db }) => {
        var _a;
        const { amount, cartId } = args;
        const findSCart = await db.shoppingCart.findUnique({
            where: { id: cartId },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER",
            targetId: findSCart === null || findSCart === void 0 ? void 0 : findSCart.userId,
            currRole: user.role,
            currId: user.id,
        });
        const findUser = await db.user.findUnique({
            where: { id: findSCart.userId },
            select: { ShoppingCart: { include: { Book: true } } },
        });
        const findBook = await db.book.findUnique({
            where: { id: findSCart.bookId },
            select: { weight: true, stock: true },
        });
        if (amount > findBook.stock)
            throw new apollo_server_express_1.ApolloError("Stok barang tidak mencukupi");
        const maxWeight = Number(process.env.MAX_COURIER_WEIGHT);
        const cartWeight = findUser.ShoppingCart.reduce((acc, curr) => curr.id !== cartId ? acc + curr.Book.weight * curr.amount : acc, 0);
        const allowed = cartWeight + findBook.weight * amount <= maxWeight;
        if (allowed) {
            const updateSC = await db.shoppingCart.update({
                where: { id: cartId },
                data: { amount },
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
            });
            return {
                id: updateSC.id,
                amount: updateSC.amount,
                createdAt: updateSC.createdAt,
                updatedAt: updateSC.updatedAt,
                Book: {
                    id: updateSC.Book.id,
                    title: updateSC.Book.title,
                    price: updateSC.Book.price,
                    discount: updateSC.Book.discount,
                    weight: updateSC.Book.weight,
                    coverURL: (_a = updateSC.Book.BookPicture.find((val) => val.type === "COVER")) === null || _a === void 0 ? void 0 : _a.url,
                    Author: {
                        id: updateSC.Book.Author.id,
                        name: updateSC.Book.Author.name,
                    },
                },
            };
        }
        else {
            throw new apollo_server_express_1.ApolloError("Maksimal berat keranjang 30kg.");
        }
    },
    deleteShoppingCart: async (_, { cartId }, { user, db }) => {
        const findSCart = await db.shoppingCart.findUnique({
            where: { id: cartId },
            select: { userId: true },
        });
        (0, validateUser_1.validateUser)({
            target: "SPECIFIC_USER",
            targetId: findSCart === null || findSCart === void 0 ? void 0 : findSCart.userId,
            currRole: user.role,
            currId: user.id,
        });
        const deleteSC = await db.shoppingCart.delete({ where: { id: cartId } });
        return {
            id: deleteSC.id,
            message: "Berhasil menghapus item keranjang",
        };
    },
};
