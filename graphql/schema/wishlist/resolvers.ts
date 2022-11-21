import { string } from "yup/lib/locale";
import { TWishlistMutation, TWishlistQuery } from "../../../types/graphql";
import { TWishlistBook } from "../../../types/wishlist";
import { validateUser } from "../../utils/validateUser";

export const Query: TWishlistQuery = {
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
    const { Book, ...resWishlist } = wishlist;
    const books = Book.reduce(
      (acc, curr) => [
        ...acc,
        {
          id: curr.id,
          title: curr.title,
          coverURL: curr.BookPicture[0]?.url || null,
          Author: curr.Author,
        },
      ],
      [] as TWishlistBook[]
    );
    return { ...resWishlist, Book: books };
  },
};

export const Mutation: TWishlistMutation = {
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
