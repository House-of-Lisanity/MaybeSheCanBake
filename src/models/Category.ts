import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  imageUrl: { type: String },
});

export const Category = models.Category || model("Category", CategorySchema);
