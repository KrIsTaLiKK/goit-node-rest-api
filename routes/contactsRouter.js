import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteStatusContact,
} from "../controllers/contactsControllers.js";
import { isValid } from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteStatusSchema,
} from "../models/contact.js";
import validateBody from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValid, getOneContact);

contactsRouter.delete("/:id", authenticate, isValid, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValid,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValid,
  validateBody(updateFavoriteStatusSchema),
  updateFavoriteStatusContact
);

export default contactsRouter;
