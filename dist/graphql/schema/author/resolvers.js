"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = exports.Mutation = exports.Query = void 0;
exports.Query = {
    author: async (_, { authorId }, { db }) => await db.author.findUnique({ where: { id: authorId } }),
    authors: async (_, __, { db }) => await db.author.findMany(),
};
exports.Mutation = {
    createAuthor: async (_, { data }, { db }) => await db.author.create({ data }),
    updateAuthor: async (_, { authorId, data }, { db }) => await db.author.update({ where: { id: authorId }, data }),
    deleteAuthor: async (_, { authorId }, { db }) => await db.author.delete({ where: { id: authorId } }),
};
exports.Author = {
    Book: async ({ id }, _, { db }) => {
        const author = await db.author.findUnique({
            where: { id },
            select: { Book: true },
        });
        return author.Book;
    },
};
