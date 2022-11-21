import * as type from "../../../types/graphql";

export const Query: type.TAuthorQuery = {
  author: async (_, { authorId }, { db }) =>
    await db.author.findUnique({ where: { id: authorId } }),
  authors: async (_, __, { db }) => await db.author.findMany(),
};

export const Mutation: type.TAuthorMutation = {
  createAuthor: async (_, { data }, { db }) => await db.author.create({ data }),
  updateAuthor: async (_, { authorId, data }, { db }) =>
    await db.author.update({ where: { id: authorId }, data }),
  deleteAuthor: async (_, { authorId }, { db }) =>
    await db.author.delete({ where: { id: authorId } }),
};

export const Author: type.TAuthor = {
  Book: async ({ id }, _, { db }) => {
    const author = await db.author.findUnique({
      where: { id },
      select: { Book: true },
    });
    return author.Book;
  },
};
