// src/app/api/admin/seed-flash-sale/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FlashSale } from "@/models/FlashSale";

const valentinesFlashSale = {
  title: "Valentine's Day Pre-Sale",
  slug: "valentines-2026",
  description:
    "Order your special Valentine's treats now! Each box contains 6 delicious desserts: 3 cookies and 3 bars. Flavors are pre-selected for the perfect Valentine's surprise.",

  // January 15 - January 31, 2026 (for testing)
  startDate: new Date("2026-01-15T00:00:00.000Z"),
  endDate: new Date("2026-01-31T23:59:59.999Z"),
  isActive: true,

  products: [
    {
      name: "Sweetheart Box",
      description: "Regular sized treats - 3 cookies & 3 bars",
      price: 38,
      quantity: 1,
      // TODO: Replace with actual product image URL from Cloudinary
      imageUrl: "https://via.placeholder.com/300x300/f1ccfa/da87f0?text=Sweetheart+Box",
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
      // TODO: Replace with actual product image URL from Cloudinary
      imageUrl: "https://via.placeholder.com/300x300/f1ccfa/da87f0?text=Sweetheart+Mini",
      contents: [
        "3 mini-sized cookies",
        "3 mini-sized bars",
        "Pre-selected Valentine's flavors",
      ],
    },
  ],

  bannerText:
    "Pre-order your Valentine's treats now! Limited time offer - order by January 31st.",

  pickupInstructions:
    "Pickup location and time will be confirmed after payment is received.",

  disclaimers: [
    "Customization of flavors is not available - boxes contain pre-selected Valentine's treats",
    "Orders cannot be placed after the closing date (January 31, 2026)",
    "Pickup location and time will be provided after payment is confirmed",
    "Refunds or cancellations can only be made up until the end of pre-sale date",
    "Payment must be made before order is confirmed - you will receive an invoice via email",
  ],

  giftMessageEnabled: true,

  orderCount: 0,
  totalRevenue: 0,
};

/**
 * POST - Seed the Valentine's flash sale
 * TODO: Add authentication when admin is built
 */
export async function POST() {
  try {
    await connectToDatabase();

    // Check if this flash sale already exists
    const existing = await FlashSale.findOne({ slug: valentinesFlashSale.slug });

    let flashSale;

    if (existing) {
      // Update existing
      flashSale = await FlashSale.findByIdAndUpdate(
        existing._id,
        valentinesFlashSale,
        { new: true }
      );

      return NextResponse.json(
        {
          success: true,
          message: "Valentine's flash sale updated",
          flashSale,
        },
        { status: 200 }
      );
    } else {
      // Create new
      flashSale = await FlashSale.create(valentinesFlashSale);

      return NextResponse.json(
        {
          success: true,
          message: "Valentine's flash sale created",
          flashSale,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error seeding flash sale:", error);
    return NextResponse.json(
      { error: "Failed to seed flash sale" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove the Valentine's flash sale
 * TODO: Add authentication when admin is built
 */
export async function DELETE() {
  try {
    await connectToDatabase();

    const deleted = await FlashSale.findOneAndDelete({
      slug: valentinesFlashSale.slug,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Valentine's flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Valentine's flash sale deleted",
    });
  } catch (error) {
    console.error("Error deleting flash sale:", error);
    return NextResponse.json(
      { error: "Failed to delete flash sale" },
      { status: 500 }
    );
  }
}
