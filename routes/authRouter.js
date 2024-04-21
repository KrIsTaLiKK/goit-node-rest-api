import express from "express";
import validateBody from "../middlewares/validateBody.js";
import {
  loginSchema,
  registerSchema,
  updateSubscriptionStatusSchema,
} from "../models/user.js";
import {
  getCurrent,
  login,
  logout,
  register,
  updateAvatar,
  updateSubscriptionStatus,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isValid } from "../middlewares/isValidId.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

authRouter.patch(
  "/:id/subscription",
  authenticate,
  isValid,
  validateBody(updateSubscriptionStatusSchema),
  updateSubscriptionStatus
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
