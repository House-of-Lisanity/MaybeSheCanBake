import mongoose from "mongoose";
import { ProductCategory } from "@/types/product";

const { Schema, model, models } = mongoose;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: Object.values(ProductCategory), // ✅ enforce enum
  },
  price: { type: String },
  description: { type: String },
  ingredients: [{ type: String }],
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true },
});

export const Product = models.Product || model("Product", ProductSchema);
