"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = exports.Mutation = exports.Query = void 0;
exports.Query = {
    publisher: async (_, { publisherId }, { db }) => await db.publisher.findUnique({ where: { id: publisherId } }),
    publishers: async (_, __, { db }) => await db.publisher.findMany(),
};
exports.Mutation = {
    createPublisher: async (_, { data }, { db }) => await db.publisher.create({ data }),
    updatePublisher: async (_, { publisherId, data }, { db }) => await db.publisher.update({ where: { id: publisherId }, data }),
    deletePublisher: async (_, { publisherId }, { db }) => await db.publisher.delete({ where: { id: publisherId } }),
};
exports.Publisher = {
    Book: async ({ id }, _, { db }) => {
        const Publisher = await db.publisher.findUnique({
            where: { id },
            select: { Book: true },
        });
        return Publisher.Book;
    },
};
