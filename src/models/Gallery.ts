import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const gallerySchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: false,
    },
    alt: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = models.Gallery || model("Gallery", gallerySchema);
