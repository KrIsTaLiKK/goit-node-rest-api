import { Schema, model } from "mongoose";
import { handleMongooseError } from "../middlewares/handleMongooseError.js";

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
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

export const Contact = model("contact", contactSchema);
