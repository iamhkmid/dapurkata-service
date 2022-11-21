import bcrypt from "bcrypt";
import { db } from "../../services/db";
import { TSaveUserPic } from "../../../types/picture";
import { saveImg } from "../../utils/uploadFIle";

export const hashPassword = async (pw) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(pw, salt);
};

export const saveUserPic = async (options: TSaveUserPic) => {
  const { userPic, pictureDir } = options;
  if (userPic) {
    const { pathFile } = await saveImg({ pictureDir, file: userPic });
    return { url: pathFile.split("static")[1] };
  } else {
    return { url: undefined };
  }
};

export const checkUser = async (data) => {
  let error;
  const addError = (newError) => {
    error ? (error = `${error}, ${newError}`) : (error = newError);
  };
  if (await db.user.findUnique({ where: { username: data.username } }))
    addError("username");
  if (await db.user.findUnique({ where: { email: data.email } }))
    addError("email");
  if (await db.user.findUnique({ where: { phone: data.phone } }))
    addError("phone");

  return error;
};
