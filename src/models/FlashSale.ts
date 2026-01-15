// src/models/FlashSale.ts
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const FlashSaleProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  quantity: { type: Number, default: 1 },
  contents: [{ type: String }], // e.g., ["3 cookies", "3 bars"]
});

const FlashSaleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    
    // Scheduling
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    
    // Products offered in this flash sale
    products: [FlashSaleProductSchema],
    
    // Display settings
    bannerImageUrl: { type: String },
    bannerText: { type: String },
    
    // Order settings
    pickupInstructions: { type: String },
    disclaimers: [{ type: String }],
    giftMessageEnabled: { type: Boolean, default: true },
    
    // Analytics
    orderCount: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FlashSale =
  models.FlashSale || model("FlashSale", FlashSaleSchema);
