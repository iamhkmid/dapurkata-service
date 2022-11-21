import { TDBGetUserPic, TGQLUserPic } from "./picture";
import { TDBSigninUser } from "./user";

export type TGQLArgsSignin = {
  username: string;
  password: string;
  rememberMe: Boolean;
};

export type TGQLSigninUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  firstName: string;
  lastName?: string;
  userPicture: string;
};

export type TGQLSignin = {
  jwt: string;
  user: TGQLSigninUser;
};

export type TGQLRegister = {
  type: "ACTIVATE_ACCOUNT" | "RESET_PASSWORD";
  email: string;
  expirationTime: Date;
  fetchWaitTime: Date;
  message: string;
};

export type TGQLResendConfirmCode = {
  type: "ACTIVATE_ACCOUNT" | "RESET_PASSWORD";
  email: string;
  expirationTime: Date;
  fetchWaitTime: Date;
  message: string;
};
export type TArgsRegisterConfirmation = {
  email: string;
  confirmCode: string;
};

export type TArgsResendConfirmCode = {
  email: string;
  type: "ACTIVATE_ACCOUNT" | "RESET_PASSWORD";
};

export type TArgsResetPassword = {
  email: string;
  confirmCode: string;
  password: string;
};

export type TGQLResetPassword = {
  message: string;
};
export type TGQLRegisterConfirmation = {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    phone: string;
    firstName: string;
    lastName?: string;
  };
  message: string;
};

export type TGQLCheckUser = {
  id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  userPicture: string;
};

export type TArgsRegisterUser = {
  data: TRegisterUserData;
  userPic?: any;
};
export type TRegisterUserData = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  phone: string;
};

export type TCacheConfirmCode = {
  type: "ACTIVATE_ACCOUNT" | "RESET_PASSWORD";
  confirmCode: string;
  canRequestAt: Date;
};

export type TAxiosGoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};
