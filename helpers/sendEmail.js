import nodemailer from "nodemailer";
import "dotenv/config";

export const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "mango95@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (data) => {
  const email = { ...data, from: "mango95@meta.ua" };
  await transport.sendMail(email);
  return true;
};
