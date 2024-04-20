import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: /\(\d{3}\) \d{3}-\d{4}/,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

export const Contact = model("contact", contactSchema);

// Joi Schemas
const phoneRegexp = /\(\d{3}\) \d{3}-\d{4}/;

export const createContactSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().required().pattern(phoneRegexp).trim(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object()
  .keys({
    name: Joi.string().trim(),
    email: Joi.string().trim(),
    phone: Joi.string().pattern(phoneRegexp).trim(),
    favorite: Joi.boolean(),
  })
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });

export const updateFavoriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
