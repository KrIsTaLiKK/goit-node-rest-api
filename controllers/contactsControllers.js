import { Contact } from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import { controllersWrap } from "../helpers/controllersWrap.js";

export const getAllContacts = controllersWrap(async (req, res) => {
  const { _id: owner } = req.user;

  const page = req.query.page ? +req.query.page : 1;
  const limit = req.query.limit ? +req.query.limit : 20;
  const favorite = req.query.favorite === "true";

  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  });

  const favoriteContacts = await Contact.find({ owner, favorite: true });

  const totalCount = await Contact.countDocuments({ owner });

  const respContacts = contacts.length
    ? { totalContacts: totalCount, page, perPage: limit, contacts }
    : { contacts: [] };

  const resp = favorite ? favoriteContacts : respContacts;

  res.json(resp);
});

export const getOneContact = controllersWrap(async (req, res) => {
  const { id } = req.params;

  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const deleteContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndDelete({ _id: id, owner });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
});

export const createContact = controllersWrap(async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
});

export const updateContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const updateFavoriteStatusContact = controllersWrap(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});
