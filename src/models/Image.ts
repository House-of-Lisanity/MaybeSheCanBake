import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
    isPublished: { type: Boolean, default: true },
    isHero: { type: Boolean, default: false },
    isLogo: { type: Boolean, default: false },
    // Cloudinary integration fields
    publicId: { type: String, required: true, unique: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    tags: [String],
  },
  { timestamps: true }
);

export const Image = models.Image || model("Image", ImageSchema);
