import { Contact } from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import { controllersWrap } from "../helpers/controllersWrap.js";

export const getAllContacts = controllersWrap(async (req, res) => {
  const result = await Contact.find();
  res.json(result);
});

export const getOneContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  console.log(result);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const deleteContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
});

export const createContact = controllersWrap(async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
});

export const updateContact = controllersWrap(async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const updateFavoriteStatusContact = controllersWrap(async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});
