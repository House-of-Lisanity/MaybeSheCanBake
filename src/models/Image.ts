import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ImageSchema = new Schema({
  url: { type: String, required: true },
  caption: { type: String },
  isPublished: { type: Boolean, default: true },
});

export const Image = models.Image || model("Image", ImageSchema);
