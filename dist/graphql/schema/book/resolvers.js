"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.Mutation = exports.Query = void 0;
const uploadFIle_1 = require("../../utils/uploadFIle");
const utils_1 = require("./utils");
const validateSchema_1 = __importDefault(require("./validateSchema"));
exports.Query = {
    book: async (_, { bookId }, { db }) => await db.book.findUnique({ where: { id: bookId } }),
    books: async (_, __, { db }) => await db.book.findMany(),
    booksWithFilter: async (_, { filter }, { db, cache }) => {
        if (cache.has("books_with_filter")) {
            const books = cache.get("books_with_filter");
            return (0, utils_1.bookFilter)({ books, filter });
        }
        else {
            const findBooks = await db.book.findMany({
                select: {
                    id: true,
                    title: true,
                    price: true,
                    stock: true,
                    coverType: true,
                    discount: true,
                    Author: true,
                    BookPicture: true,
                    Category: { select: { id: true } },
                },
            });
            const books = findBooks.reduce((acc, curr) => {
                var _a;
                return [
                    ...acc,
                    {
                        id: curr.id,
                        title: curr.title,
                        authorName: curr.Author.name,
                        price: curr.price,
                        stock: curr.stock,
                        coverType: curr.coverType,
                        discount: curr.discount,
                        categoryIds: curr.Category.reduce((acc, curr) => [...acc, curr.id], []),
                        coverURL: (_a = curr.BookPicture.find((val) => val.type === "COVER")) === null || _a === void 0 ? void 0 : _a.url,
                    },
                ];
            }, []);
            cache.set("books_with_filter", books);
            return (0, utils_1.bookFilter)({ books, filter });
        }
    },
};
exports.Mutation = {
    createBook: async (_, { data, cover, bookPics }, { db, cache }) => {
        await (0, validateSchema_1.default)({ type: "CREATE_BOOK", data });
        const folderName = (0, uploadFIle_1.changeStr)(`${new Date().getTime()}`);
        const { pictureDir } = await (0, uploadFIle_1.makeDirFile)({
            dirLoc: `/server/static/uploads/books/${folderName}/`,
        });
        const author = await db.author.findUnique({
            where: { id: data.authorId },
            select: {
                name: true,
            },
        });
        const slug = (0, uploadFIle_1.changeStr)(`${data.title} ${author.name}`);
        const imageInfo = (cover || bookPics) &&
            (await (0, utils_1.saveBookPic)({ pictureDir, cover, bookPics }).catch((err) => {
                (0, uploadFIle_1.removeDir)(pictureDir);
                throw err;
            }));
        const newData = {
            title: data.title,
            description: data.description || undefined,
            edition: data.edition || undefined,
            series: data.series || undefined,
            releaseYear: data.releaseYear || undefined,
            numberOfPages: data.numberOfPages || undefined,
            length: data.length || undefined,
            width: data.width || undefined,
            weight: data.weight || undefined,
            stock: data.stock,
            price: data.price,
            condition: data.condition,
            discount: data.discount || 0,
            coverType: data.coverType,
            language: data.language || undefined,
            isbn: data.isbn || undefined,
            slug,
            pictureDir,
            Category: {
                connect: data.categoryIds
                    ? data.categoryIds.map((cat) => ({ id: cat }))
                    : undefined,
            },
            Author: { connect: data.authorId ? { id: data.authorId } : undefined },
            Publisher: {
                connect: data.publisherId ? { id: data.publisherId } : undefined,
            },
            BookPicture: { create: imageInfo || undefined },
        };
        try {
            cache.del("books_with_filter");
            return await db.book.create({ data: newData });
        }
        catch (error) {
            await (0, uploadFIle_1.removeDir)(pictureDir);
            throw error;
        }
    },
    updateBook: async (_, { data }, { db, cache }) => {
        let slug = undefined;
        if (!!data.title && !!data.authorId) {
            const author = await db.author.findUnique({
                where: { id: data.authorId },
                select: {
                    name: true,
                },
            });
            slug = (0, uploadFIle_1.changeStr)(`${data.title} ${author.name}`);
        }
        const newData = {
            title: data.title || undefined,
            description: data.description || undefined,
            edition: data.edition || undefined,
            series: data.series || undefined,
            releaseYear: data.releaseYear || undefined,
            numberOfPages: data.numberOfPages || undefined,
            length: data.length || undefined,
            width: data.width || undefined,
            weight: data.weight || undefined,
            stock: data.stock || undefined,
            price: data.price || undefined,
            condition: data.condition,
            discount: data.discount || 0,
            coverType: data.coverType,
            language: data.language || undefined,
            isbn: data.isbn || undefined,
            slug,
            Category: {
                set: data.categoryIds
                    ? data.categoryIds.map((cat) => ({ id: cat }))
                    : undefined,
            },
            Author: { connect: data.authorId ? { id: data.authorId } : undefined },
            Publisher: {
                connect: data.publisherId ? { id: data.publisherId } : undefined,
            },
        };
        cache.del("books_with_filter");
        return await db.book.update({
            where: { id: data.bookId },
            data: newData,
        });
    },
    deleteBook: async (_, { bookId }, { db, cache }) => {
        const book = await db.book.delete({ where: { id: bookId } });
        await (0, uploadFIle_1.removeDir)(book.pictureDir);
        cache.del("books_with_filter");
        return book;
    },
};
exports.Book = {
    Author: async ({ id }, _, { db }) => {
        const book = await db.book.findUnique({
            where: { id },
            select: { Author: true },
        });
        return book.Author;
    },
    Publisher: async ({ id }, _, { db }) => {
        const book = await db.book.findUnique({
            where: { id },
            select: { Publisher: true },
        });
        return book.Publisher;
    },
    Category: async ({ id }, _, { db }) => {
        const book = await db.book.findUnique({
            where: { id },
            select: { Category: true },
        });
        return book.Category;
    },
    BookPicture: async ({ id }, _, { db }) => {
        const book = await db.book.findUnique({
            where: { id },
            select: { BookPicture: true },
        });
        return book.BookPicture;
    },
};
