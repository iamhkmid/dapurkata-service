import {
  TCategoryMutation,
  TCategoryQuery,
  TCategory,
} from "../../../types/graphql";

export const Query: TCategoryQuery = {
  category: async (_, { categoryId }, { db }) =>
    await db.category.findUnique({ where: { id: categoryId } }),
  categories: async (_, __, { db }) =>
    await db.category.findMany({ orderBy: { name: "asc" } }),
};

export const Mutation: TCategoryMutation = {
  createCategory: async (_, { data }, { db }) =>
    await db.category.create({ data }),
  updateCategory: async (_, { categoryId, data }, { db }) =>
    await db.category.update({ where: { id: categoryId }, data }),
  deleteCategory: async (_, { categoryId }, { db }) =>
    await db.category.delete({ where: { id: categoryId } }),
};

export const Category: TCategory = {
  Book: async ({ id }, _, { db }) => {
    const category = await db.category.findUnique({
      where: { id },
      select: { Book: true },
    });
    return category.Book;
  },
};
