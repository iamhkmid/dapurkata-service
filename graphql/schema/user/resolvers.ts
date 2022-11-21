import { AuthenticationError, ValidationError } from "apollo-server-errors";
import { ApolloError } from "apollo-server-express";
import {
  TUser,
  TUserMutation,
  TUserQuery,
  TUserSubcription,
} from "../../../types/graphql";
import { makeDirFile, removeDir } from "../../utils/uploadFIle";
import { validateUser } from "../../utils/validateUser";
import { checkUser, hashPassword, saveUserPic } from "./utils";
import bcrypt from "bcrypt";
import { withFilter } from "graphql-subscriptions";
import pubsub from "../../services/pubsub";
import { TWishlistBook } from "../../../types/wishlist";
import { TGQLUserShoppingcartByAdmin } from "../../../types/user";
import { TGQLSCart } from "../../../types/shoppingCart";
import fs from "fs";
import path from "path";

export const Query: TUserQuery = {
  user: async (_, { userId }, { user, db }) => {
    const findUser = await db.user.findUnique({ where: { id: userId } });
    validateUser({
      target: "SPECIFIC_USER_OR_ADMIN",
      targetId: findUser?.id,
      currRole: user.role,
      currId: user.id,
    });
    return findUser;
  },
  users: async (_, __, { db }) => await db.user.findMany(),
  notification: async (_, __, { db, user }) =>
    await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
};

export const Mutation: TUserMutation = {
  createUser: async (_, { data, userPic }, { user, db }) => {
    const check = await checkUser(data);
    if (!!check) throw new ValidationError(check + " already exists");
    const { username, email, password, role, phone, firstName, lastName } =
      data;
    const { pictureDir } = await makeDirFile({
      dirLoc: "/server/static/uploads/profile",
    });
    const profilePicInfo =
      userPic &&
      (await saveUserPic({ pictureDir, userPic }).catch((err) => {
        removeDir(pictureDir);
        throw err;
      }));
    return await db.user.create({
      data: {
        firstName,
        lastName: lastName || undefined,
        username,
        email,
        password: await hashPassword(password),
        role: role && user?.role === "ADMIN" ? role : "USER",
        phone: phone || undefined,
        isActive: true,
        pictureDir,
        userPicture: profilePicInfo?.url || undefined,
      },
    });
  },

  updateUser: async (_, { userId, data }, { user, db }) => {
    const { username, email, phone, firstName, lastName, isActive } = data;
    const findUser = await db.user.findUnique({ where: { id: userId } });
    validateUser({
      target: "SPECIFIC_USER_OR_ADMIN",
      targetId: findUser?.id,
      currRole: user.role,
      currId: user.id,
    });
    const userFields = {
      firstName,
      lastName: lastName || undefined,
      username,
      email,
      phone: phone || undefined,
      isActive: isActive && user.role === "ADMIN" ? isActive : undefined,
    };
    return await db.user.update({
      where: { id: userId },
      data: userFields,
    });
  },
  deleteUser: async (_, { userId, username }, { db }) => {
    const findUser = await db.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new ApolloError("User tidak ditemukan");
    if (findUser.username === username) {
      return await db.user.delete({ where: { id: userId } });
    } else {
      throw new ApolloError("Username salah");
    }
  },
  changeRole: async (_, args, { db, user }) => {
    const { userId, role, password } = args;
    const findUser = await db.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });
    const checkPw = await bcrypt.compare(password, findUser.password);
    if (!checkPw) throw new AuthenticationError("Password salah");

    const updateUser = await db.user.update({
      where: { id: userId },
      data: {
        role,
      },
    });
    return updateUser;
  },
  changePassword: async (_, { data }, { db, user }) => {
    const { newPassword, oldPassword } = data;
    const findUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, password: true },
    });
    validateUser({
      target: "SPECIFIC_USER_OR_ADMIN",
      targetId: findUser?.id,
      currRole: user.role,
      currId: user.id,
    });

    const checkPw = await bcrypt.compare(oldPassword, findUser.password);
    if (!checkPw) {
      throw new ApolloError("Password incorrect");
    } else {
      const updatePass = await db.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(newPassword) },
      });
      if (updatePass) {
        return { message: "Password change successful" };
      } else {
        throw new ApolloError("Failed to save data");
      }
    }
  },
  changeUserPic: async (_, { userPic }, { db, user }) => {
    const findUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, username: true, pictureDir: true, userPicture: true },
    });
    const { pictureDir } = await makeDirFile({
      dirLoc: `/server/static/uploads/profile/${findUser.username}/`,
    });
    const filePath = path.join(
      process.cwd(),
      `/server/static/${findUser.userPicture}`
    );
    try {
      fs.unlinkSync(filePath);
    } catch (error) {}
    const profilePicInfo =
      userPic &&
      (await saveUserPic({ pictureDir, userPic }).catch((err) => {
        throw err;
      }));
    await db.user.update({
      where: { id: user.id },
      data: { pictureDir, userPicture: profilePicInfo?.url || undefined },
    });
    return { message: "Berhasil ubah foto" };
  },
  deleteUserPic: async (_, __, { db, user }) => {
    const findUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, pictureDir: true, userPicture: true },
    });
    const filePath = path.join(
      process.cwd(),
      `/server/static/${findUser.userPicture}`
    );
    fs.unlink(filePath, async (err) => {
      if (err && err.code == "ENOENT") {
        // file not found
        await db.user.update({
          where: { id: user.id },
          data: { userPicture: null },
        });
      } else if (err) {
        throw new ApolloError("Something went wrong. Please try again later.");
      } else {
        await db.user.update({
          where: { id: user.id },
          data: { userPicture: null },
        });
      }
    });
    return { message: "Berhasil hapus foto" };
  },
};

export const Subscription: TUserSubcription = {
  notification: {
    subscribe: withFilter(
      () => pubsub.asyncIterator("NOTIFICATION"),
      async (payload, variables, context) => {
        return payload.notification.userId === context.user.id;
      }
    ),
  },
};

export const User: TUser = {
  ShoppingCart: async ({ id }, _, { db }) => {
    const findUser = await db.user.findUnique({
      where: { id },
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
      const { Book, ...rest } = curr;
      const coverURL = Book.BookPicture.find(
        (val) => val.type === "COVER"
      )?.url;
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
    }, [] as TGQLSCart[]);
    return shoppingcart;
  },
  Recipient: async ({ id }, _, { db }) =>
    (
      await db.user.findUnique({
        where: { id },
        select: {
          Recipient: { include: { City: { include: { Province: true } } } },
        },
      })
    ).Recipient,
  Wishlist: async ({ id }, _, { db }) => {
    const wishlist = await db.wishlist.findUnique({
      where: { userId: id },
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
  Order: async ({ id }, _, { db }) => {
    const findUser = await db.user.findUnique({
      where: { id },
      select: {
        Order: true,
      },
    });
    return findUser.Order;
  },
};
