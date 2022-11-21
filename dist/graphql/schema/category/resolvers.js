"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Mutation = exports.Query = void 0;
exports.Query = {
    category: async (_, { categoryId }, { db }) => await db.category.findUnique({ where: { id: categoryId } }),
    categories: async (_, __, { db }) => await db.category.findMany({ orderBy: { name: "asc" } }),
};
exports.Mutation = {
    createCategory: async (_, { data }, { db }) => await db.category.create({ data }),
    updateCategory: async (_, { categoryId, data }, { db }) => await db.category.update({ where: { id: categoryId }, data }),
    deleteCategory: async (_, { categoryId }, { db }) => await db.category.delete({ where: { id: categoryId } }),
};
exports.Category = {
    Book: async ({ id }, _, { db }) => {
        const category = await db.category.findUnique({
            where: { id },
            select: { Book: true },
        });
        return category.Book;
    },
};
