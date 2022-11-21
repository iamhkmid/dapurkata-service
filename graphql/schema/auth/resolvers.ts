import {
  ApolloError,
  AuthenticationError,
  ValidationError,
} from "apollo-server-errors";
import { TAuthMutation, TAuthQuery } from "../../../types/graphql";
import {
  confirmCodeTemp,
  createToken,
  genConfirmCode,
  getGoogleOauth2Tokens,
} from "./utils";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkUser, hashPassword, saveUserPic } from "../user/utils";
import { makeDirFile, removeDir } from "../../utils/uploadFIle";
import {
  TAxiosGoogleUser,
  TCacheConfirmCode,
  TGQLSigninUser,
} from "../../../types/auth";
import axios, { AxiosResponse } from "axios";
import cuid from "cuid";
import { string } from "yup/lib/locale";
import { TGQLUser, TUser } from "../../../types/user";

export const Query: TAuthQuery = {
  checkUser: async (_, __, { db, req }) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!!token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const findUser = await db.user.findUnique({
          where: { id: decoded["id"] },
        });
        if (!findUser) throw new AuthenticationError("User not found");
        if (!findUser.isActive)
          throw new AuthenticationError("Akun belum aktif");
        return findUser;
      } catch (error) {
        throw error;
      }
    } else {
      throw new AuthenticationError("Authentication is required");
    }
  },
};

export const Mutation: TAuthMutation = {
  login: async (_, args, { db, mail }) => {
    const { username, password, rememberMe } = args;
    const findUser = await db.user.findUnique({
      where: { username },
    });
    if (!findUser)
      throw new AuthenticationError("Username or Password incorrect");

    if (!findUser.isActive) throw new AuthenticationError("Akun belum aktif");

    const checkPw = await bcrypt.compare(password, findUser.password);
    if (!checkPw)
      throw new AuthenticationError("Username or Password incorrect");

    const token = createToken({
      id: findUser.id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      role: findUser.role,
    });
    return { jwt: token, user: findUser };
  },
  googleOauth2Verify: async (_, { code }, { db, mail }) => {
    let user: TGQLSigninUser, googleUser: AxiosResponse<TAxiosGoogleUser>;
    const { access_token, id_token } = await getGoogleOauth2Tokens({ code });
    const apiURL = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
    const headers = { Authorization: `Bearer ${id_token}` };
    try {
      googleUser = await axios.get<TAxiosGoogleUser>(apiURL, { headers });
      user = await db.user.findUnique({
        where: { email: googleUser.data.email },
      });
    } catch (error) {
      throw new ApolloError("Gagal masuk dengan Google Account");
    }
    if (!user) {
      const { pictureDir } = await makeDirFile({
        dirLoc: "/server/static/uploads/profile",
      });
      user = await db.user.create({
        data: {
          firstName: googleUser.data.given_name,
          lastName: googleUser.data.family_name || undefined,
          email: googleUser.data.email,
          username: `user${cuid()}`,
          password: await hashPassword(cuid()),
          role: "USER",
          userPicture: googleUser.data.picture || undefined,
          pictureDir,
          isActive: true,
        },
      });
    }
    const token = createToken({
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return { jwt: token, user };
  },
  register: async (_, { data, userPic }, { mail, cache, db }) => {
    const check = await checkUser(data);
    if (!!check) throw new ValidationError(check + " already exists");

    const { username, email, password, phone, firstName, lastName } = data;
    const { pictureDir } = await makeDirFile({
      dirLoc: "/server/static/uploads/profile",
    });
    const profilePicInfo =
      userPic &&
      (await saveUserPic({ pictureDir, userPic }).catch((err) => {
        removeDir(pictureDir);
        throw err;
      }));
    const cUser = await db.user.create({
      data: {
        firstName,
        lastName: lastName || undefined,
        username,
        email,
        password: await hashPassword(password),
        role: "USER",
        phone: phone || undefined,
        isActive: false,
        pictureDir,
        userPicture: profilePicInfo?.url || undefined,
      },
    });
    const expr = 300000; /* 5 minutes*/
    const reqInterval = 90000; /* 1.5 minute*/
    const expirationTime = new Date(new Date().getTime() + expr);
    const canRequestAt = new Date(new Date().getTime() + reqInterval);
    const confirmCode = genConfirmCode(6);
    const cacheData: TCacheConfirmCode = {
      canRequestAt,
      confirmCode,
      type: "ACTIVATE_ACCOUNT",
    };
    cache.set(cUser.email, cacheData, expr);
    try {
      await mail.sendMail({
        from: `Penerbit Dapurkata <${process.env.COMPANY_EMAIL}>`, // sender address
        to: data.email, // list of receivers
        subject: "Konfirmasi Pendaftaran", // Subject line
        html: confirmCodeTemp({ expirationTime, confirmCode }), // html body
      });
    } catch (err) {
      throw new ApolloError("Error sending email on server");
    }
    return {
      email,
      type: "ACTIVATE_ACCOUNT",
      expirationTime,
      fetchWaitTime: canRequestAt,
      message: "Kode konfirmasi telah dikirim melalui email",
    };
  },
  resendConfirmCode: async (_, args, { mail, cache, db }) => {
    const { email, type } = args;
    if (cache.has(email)) {
      const registerData = cache.get(email) as TCacheConfirmCode;
      const timeNow = new Date().getTime();
      if (timeNow < registerData.canRequestAt.getTime())
        throw new ApolloError(
          `Tunggu sebentar, waktu tunggu ${Math.ceil(
            (registerData.canRequestAt.getTime() - timeNow) / 1000
          )} detik`
        );
    }

    const fUser = await db.user.findUnique({
      where: { email },
      select: { isActive: true },
    });

    if (!fUser) throw new ApolloError("Email belum terdaftar");
    if (type === "ACTIVATE_ACCOUNT" && fUser.isActive)
      throw new ApolloError("Akun sudah aktif");

    const expr = 300000; /* 5 minutes*/
    const reqInterval = 90000; /* 1.5 minute*/
    const expirationTime = new Date(new Date().getTime() + expr);
    const canRequestAt = new Date(new Date().getTime() + reqInterval);
    const confirmCode = genConfirmCode(6);
    let subject: string;
    const cacheData: TCacheConfirmCode = {
      canRequestAt,
      confirmCode,
      type,
    };

    if (type === "ACTIVATE_ACCOUNT") {
      subject = "Konfirmasi Pendaftaran";
    } else if (type === "RESET_PASSWORD") {
      subject = "Reset Password";
    }
    const emailOptions = {
      from: `Penerbit Dapurkata <${process.env.COMPANY_EMAIL}>`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      html: confirmCodeTemp({ expirationTime, confirmCode }), // html body
    };
    try {
      await mail.sendMail(emailOptions);
    } catch (err) {
      throw new ApolloError("Error sending email on server");
    }
    cache.set(email, { confirmCode, canRequestAt, type }, expr);

    return {
      email,
      type: cacheData.type,
      expirationTime,
      fetchWaitTime: canRequestAt,
      message: "Kode konfirmasi telah dikirim melalui email",
    };
  },
  registerConfirmation: async (_, args, { mail, cache, db }) => {
    const { email, confirmCode } = args;
    if (!cache.has(email))
      throw new ApolloError("Kode konfirmasi tidak ditemukan atau kaldaluarsa");

    const cacheData = cache.get(email) as TCacheConfirmCode;
    if (
      cacheData.confirmCode !== confirmCode ||
      cacheData.type !== "ACTIVATE_ACCOUNT"
    )
      throw new ApolloError("Kode konfirmasi salah");
    const uUser = await db.user.update({
      where: { email },
      data: { isActive: true },
    });
    cache.del(email);
    return {
      user: uUser,
      message: "Akun berhasil diaktifkan",
    };
  },
  resetPassword: async (_, args, { mail, cache, db }) => {
    const { email, confirmCode, password } = args;
    if (!cache.has(email))
      throw new ApolloError("Kode konfirmasi tidak ditemukan atau kaldaluarsa");

    const cacheData = cache.get(email) as TCacheConfirmCode;
    if (
      cacheData.confirmCode !== confirmCode ||
      cacheData.type !== "RESET_PASSWORD"
    )
      throw new ApolloError("Kode konfirmasi salah");

    await db.user.update({
      where: { email },
      data: {
        password: await hashPassword(password),
      },
    });
    cache.del(email);
    return {
      message: "Berhasil mengubah password",
    };
  },
};
