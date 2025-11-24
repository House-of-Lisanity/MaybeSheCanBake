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
  dietary: [{ type: String }], // e.g. ["gluten-free", "vegan"]
  allergens: [{ type: String }], // e.g. ["gluten", "milk", "eggs"]
  flavors: [{ type: String }], // e.g. ["chocolate", "caramel"]
  tags: [{ type: String }], // general-purpose tags
  highlights: [{ type: String }], // e.g. "made with organic ingredients", "award-winning"
  texture: { type: String }, // e.g. "chewy", "fudgy"
  season: { type: String }, // e.g. "Fall", "Winter"
  shelfLife: { type: String }, // e.g. "3 days refrigerated"
  storage: { type: String }, // e.g. "Keep refrigerated"
  availability: { type: String }, // e.g. "in-stock", "preorder", "market-day-only"
  servings: { type: Number },
});

export const Product = models.Product || model("Product", ProductSchema);
