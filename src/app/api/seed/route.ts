import { connectToDatabase } from "@/lib/mongodb";
import { About } from "@/models/About";
import { Event } from "@/models/Event";
import { Gallery } from "@/models/Gallery";
import { Image } from "@/models/Image";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
import { Category } from "@/models/Category";
import demoGallery from "@/lib/demoGallery";
import demoProducts from "@/lib/demoProducts";
import demoReviews from "@/lib/demoReviews";
import demoEvents from "@/lib/demoEvents";
import demoCategories from "@/lib/demoCategory";
import { NextResponse } from "next/server";
import demoAbout from "@/lib/demoAbout";

export async function GET() {
  await connectToDatabase();

  try {
    // Optional: clear old records to avoid duplicates
    await Promise.all([
      Gallery.deleteMany({}),
      Image.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Event.deleteMany({}),
      About.deleteMany({}),
      Category.deleteMany({}),
    ]);

    // Seed Gallery
    await Gallery.insertMany(
      demoGallery.map((img) => ({
        url: img.url,
        caption: img.caption,
        alt: img.caption || "Gallery image",
      }))
    );

    // Seed Images (optional, use same gallery data)
    await Image.insertMany(
      demoGallery.map((img) => ({
        url: img.url,
        caption: img.caption,
        isPublished: true,
      }))
    );

    // Seed Products
    await Product.insertMany(
      demoProducts.map((product) => ({
        ...product,
        isAvailable: true,
      }))
    );

    // Seed Reviews
    await Review.insertMany(
      demoReviews.map((review) => ({
        ...review,
        isPublished: true,
      }))
    );

    // Seed Events
    await Event.insertMany(
      demoEvents.map((event) => ({
        ...event,
        isPublished: true,
      }))
    );

    // Seed About section
    await About.insertMany(
      demoAbout.map((entry) => ({
        content: entry.content,
        isPublished: true,
      }))
    );

    // Seed Categories
    await Category.insertMany(
      demoCategories.map((category) => ({
        ...category,
        isPublished: true,
      }))
    );

    return NextResponse.json({ message: "✅ Demo data seeded successfully." });
  } catch (err) {
    console.error("❌ Seed error:", err);
    return NextResponse.json(
      { error: "Failed to seed database." },
      { status: 500 }
    );
  }
}
