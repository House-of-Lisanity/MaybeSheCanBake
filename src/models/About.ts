// maybeshecanbake/src/models/About.ts
import { Schema, model, models } from "mongoose";

const AboutSchema = new Schema(
  {
    sectionKey: { type: String, required: true, unique: true }, // e.g. "baker"
    title: { type: String, required: true },
    subtitle: { type: String },
    body: { type: String, required: true },

    imageUrl: { type: String },
    imagePublicId: { type: String },
    imageAlt: { type: String },

    isVisible: { type: Boolean, default: false },
    sortOrder: { type: Number },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
    collection: "about", // ✅ EXACT collection name
  }
);

export const About = models.About || model("About", AboutSchema);
