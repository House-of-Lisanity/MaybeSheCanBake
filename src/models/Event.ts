import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // ISO string
  location: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "10:00 AM - 2:00 PM"
  description: { type: String },
  isPublished: { type: Boolean, default: true },

  // 🔽 New fields for pop-up / event details modal
  address: { type: String }, // Full address; can be same as location or more detailed
  externalUrl: { type: String }, // Link to the event website
  heroImageUrl: { type: String }, // Optional hero image for the event
});

export const Event = models.Event || model("Event", EventSchema);
