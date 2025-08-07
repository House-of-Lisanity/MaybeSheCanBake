import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const AboutSchema = new Schema({
  content: { type: String, required: true },
  isPublished: { type: Boolean, default: true },
});

export const About = models.About || model("About", AboutSchema);
