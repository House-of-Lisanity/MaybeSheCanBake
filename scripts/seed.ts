// scripts/seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../src/models/Product.ts";
import { Gallery } from "../src/models/Gallery.ts";
import { Review } from "../src/models/Review.ts";
import demoProducts from "../src/lib/demoProducts.ts";
import demoGallery from "../src/lib/demoGallery.ts";
import demoReviews from "../src/lib/demoReviews.ts";

dotenv.config({ path: ".env.local" });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    await Product.deleteMany({});
    await Gallery.deleteMany({});
    await Review.deleteMany({});

    await Product.insertMany(demoProducts);
    await Gallery.insertMany(demoGallery);
    await Review.insertMany(demoReviews);

    console.log("🌱 Seed data inserted!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
