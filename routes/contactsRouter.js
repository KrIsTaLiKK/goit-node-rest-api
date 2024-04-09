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
} from "../schemas/contactsSchemas.js";
import validateBody from "../middlewares/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValid, getOneContact);

contactsRouter.delete("/:id", isValid, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:id",
  isValid,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValid,
  validateBody(updateFavoriteStatusSchema),
  updateFavoriteStatusContact
);

export default contactsRouter;
