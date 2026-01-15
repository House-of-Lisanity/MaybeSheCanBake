// src/models/Product.ts
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: String },
  description: { type: String },
  ingredients: [{ type: String }],
  imageUrl: { type: String },
  imagePublicId: { type: String },
  isAvailable: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  showInGallery: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  dietary: [{ type: String }],
  allergens: [{ type: String }],
  flavors: [{ type: String }],
  tags: [{ type: String }],
  highlights: [{ type: String }],
  texture: { type: String },
  season: { type: String },
  shelfLife: { type: String },
  storage: { type: String },
  availability: { type: String },
  servings: { type: Number },
  flashSaleOnly: { type: Boolean, default: false },
});

export const Product = models.Product || model("Product", ProductSchema);
