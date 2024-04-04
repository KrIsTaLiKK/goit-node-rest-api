import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { controllersWrap } from "../helpers/controllersWrap.js";

export const getAllContacts = controllersWrap(async (req, res) => {
  const result = await listContacts();
  res.json(result);
});

export const getOneContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const deleteContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
});

export const createContact = controllersWrap(async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
});

export const updateContact = controllersWrap(async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const result = await updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});
