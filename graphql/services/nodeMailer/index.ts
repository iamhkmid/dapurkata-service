import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMPT_USER, // generated ethereal user
    pass: process.env.SMPT_PASSWORD, // generated ethereal password
  },
});
