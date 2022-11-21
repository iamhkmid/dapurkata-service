import { TGQLUserPic } from "./picture";

export type TUser = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  pictureDir: string;
};

export type TCreateUserData = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  pictureDir: string;
};

export type TUpdateUserData = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  phone?: string;
  isActive: boolean;
  pictureDir: string;
};

export type TArgsCreateUser = {
  data: TCreateUserData;
  userPic?: any;
};

export type TArgsUpdateUser = {
  userId: string;
  data: TUpdateUserData;
};
export type TArgsChangeRole = {
  userId: string;
  role: string;
  password: string;
};
export type TArgsChangePassword = {
  data: { oldPassword: string; newPassword: string };
};

export type TGQLUser = {
  id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  pictureDir: string;
  userPicture: string;
  createdAt: Date;
  updatedAt: Date;
};
type TDBCheckUser = {
  id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  pictureDir: string;
  userPicture: string;
  createdAt: Date;
  updatedAt: Date;
};
export type TUserCtx = {
  id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
};

export type TGQLUserNotification = {
  id: string;
  title: string;
  message: string;
  valueName: string;
  valueId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TGQLUserShoppingcartByAdmin = {
  id: string;
  amount: number;
  Book: {
    id: string;
    title: string;
    Author: {
      id: string;
      name: string;
    };
    coverURL: string;
  };
};
