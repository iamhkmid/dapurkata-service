import {
  TPublisher,
  TPublisherMutation,
  TPublisherQuery,
} from "../../../types/graphql";

export const Query: TPublisherQuery = {
  publisher: async (_, { publisherId }, { db }) =>
    await db.publisher.findUnique({ where: { id: publisherId } }),
  publishers: async (_, __, { db }) => await db.publisher.findMany(),
};

export const Mutation: TPublisherMutation = {
  createPublisher: async (_, { data }, { db }) =>
    await db.publisher.create({ data }),
  updatePublisher: async (_, { publisherId, data }, { db }) =>
    await db.publisher.update({ where: { id: publisherId }, data }),
  deletePublisher: async (_, { publisherId }, { db }) =>
    await db.publisher.delete({ where: { id: publisherId } }),
};

export const Publisher: TPublisher = {
  Book: async ({ id }, _, { db }) => {
    const Publisher = await db.publisher.findUnique({
      where: { id },
      select: { Book: true },
    });
    return Publisher.Book;
  },
};
