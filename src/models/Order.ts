// src/models/Order.ts
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const OrderItemSchema = new Schema({
  productId: { type: String },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  notes: { type: String },
});

const OrderSchema = new Schema(
  {
    // Order type
    type: {
      type: String,
      enum: ["regular", "flash_sale"],
      required: true,
    },
    
    // Flash sale reference (only for flash_sale orders)
    flashSaleId: {
      type: Schema.Types.ObjectId,
      ref: "FlashSale",
    },
    
    // Customer info
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    
    // Order details
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    
    // Delivery/pickup
    pickupLocation: { type: String },
    pickupDate: { type: String },
    deliveryNotes: { type: String },
    
    // Gift message (for flash sales)
    giftMessage: { type: String },
    isGift: { type: Boolean, default: false },
    
    // Order status
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "completed", "cancelled"],
      default: "pending",
    },
    
    // Admin notes
    adminNotes: { type: String },
    
    // Payment tracking (manual for now)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String },
    
    // Timestamps
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
