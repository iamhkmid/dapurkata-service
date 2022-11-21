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
exports.Query = {
    wishlist: async (_, __, { user, db }) => {
        const wishlist = await db.wishlist.findUnique({
            where: { userId: user.id },
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
};
exports.Mutation = {
    addWishlist: async (_, { bookId }, { user, db }) => {
        await db.wishlist.upsert({
            where: { userId: user.id },
            create: {
                User: { connect: { id: user.id } },
                Book: { connect: { id: bookId } },
            },
            update: {
                Book: { connect: { id: bookId } },
            },
        });
        return { message: "Wishlist Ditambahkan" };
    },
    deleteWishlist: async (_, { bookId }, { user, db }) => {
        await db.wishlist.update({
            where: { userId: user.id },
            data: {
                Book: { disconnect: { id: bookId } },
            },
        });
        return { message: "Wishlist Dihapus" };
    },
};
