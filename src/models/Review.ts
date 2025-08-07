import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String }, // Optional
  isPublished: { type: Boolean, default: true },
});

export const Review = models.Review || model("Review", ReviewSchema);
