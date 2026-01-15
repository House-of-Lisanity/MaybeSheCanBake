// scripts/seedValentinesFlashSale.ts
/**
 * Seed script to create Valentine's Day flash sale
 * Run with: npx tsx scripts/seedValentinesFlashSale.ts
 */

import mongoose from "mongoose";
import { FlashSale } from "../src/models/FlashSale";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

const valentinesFlashSale = {
  title: "Valentine's Day Pre-Sale",
  slug: "valentines-2025",
  description:
    "Order your special Valentine's treats now! Each box contains 6 delicious desserts: 3 cookies and 3 bars. Flavors are pre-selected for the perfect Valentine's surprise.",

  // February 1 - February 10, 2025
  startDate: new Date("2025-02-01T00:00:00.000Z"),
  endDate: new Date("2025-02-10T23:59:59.999Z"),
  isActive: true,

  products: [
    {
      name: "Sweetheart Box",
      description: "Regular sized treats - 3 cookies & 3 bars",
      price: 38,
      quantity: 1,
      contents: [
        "3 regular-sized cookies",
        "3 regular-sized bars",
        "Pre-selected Valentine's flavors",
      ],
    },
    {
      name: "Sweetheart Mini",
      description: "Mini-sized treats - 3 cookies & 3 bars",
      price: 28,
      quantity: 1,
      contents: [
        "3 mini-sized cookies",
        "3 mini-sized bars",
        "Pre-selected Valentine's flavors",
      ],
    },
  ],

  bannerText:
    "Pre-order your Valentine's treats now! Limited time offer - order by February 10th.",

  pickupInstructions:
    "Pickup location and time will be confirmed after payment is received.",

  disclaimers: [
    "Customization of flavors is not available - boxes contain pre-selected Valentine's treats",
    "Orders cannot be placed after the closing date (February 10, 2025)",
    "Pickup location and time will be provided after payment is confirmed",
    "Refunds or cancellations can only be made up until the end of pre-sale date",
    "Payment must be made before order is confirmed - you will receive an invoice via email",
  ],

  giftMessageEnabled: true,

  orderCount: 0,
  totalRevenue: 0,
};

async function seedFlashSale() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if this flash sale already exists
    const existing = await FlashSale.findOne({
      slug: valentinesFlashSale.slug,
    });

    if (existing) {
      console.log("⚠️  Valentine's flash sale already exists. Updating...");
      await FlashSale.findByIdAndUpdate(existing._id, valentinesFlashSale);
      console.log("✅ Valentine's flash sale updated!");
    } else {
      console.log("📦 Creating Valentine's flash sale...");
      await FlashSale.create(valentinesFlashSale);
      console.log("✅ Valentine's flash sale created!");
    }

    console.log("\n📋 Flash Sale Details:");
    console.log(`   Title: ${valentinesFlashSale.title}`);
    console.log(
      `   Start: ${valentinesFlashSale.startDate.toLocaleDateString()}`
    );
    console.log(`   End: ${valentinesFlashSale.endDate.toLocaleDateString()}`);
    console.log(`   Products: ${valentinesFlashSale.products.length}`);
    console.log(`   Active: ${valentinesFlashSale.isActive ? "Yes" : "No"}`);

    console.log(
      "\n✨ You can now visit your website to see the flash sale banner!"
    );

    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding flash sale:", error);
    process.exit(1);
  }
}

seedFlashSale();
