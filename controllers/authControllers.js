import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import { promises as fs } from "fs";
import HttpError from "../helpers/HttpError.js";
import { controllersWrap } from "../helpers/controllersWrap.js";
import { User } from "../models/user.js";

dotenv.config();

const avatarsDir = path.join(process.cwd(), "public", "avatars");

const { SECRET_KEY } = process.env;

export const register = controllersWrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

export const login = controllersWrap(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

export const getCurrent = controllersWrap(async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
});

export const logout = controllersWrap(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json();
});

export const updateSubscriptionStatus = controllersWrap(async (req, res) => {
  const { id } = req.params;

  const result = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const updateAvatar = controllersWrap(async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Body must contain a file");
  }

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, fileName);

  const avatar = await Jimp.read(tempUpload);
  await avatar.resize(250, 250).quality(90).writeAsync(resultUpload);

  await fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
});
