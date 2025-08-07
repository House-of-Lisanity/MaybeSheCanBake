import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Image } from "@/models/Image";
import { Review } from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  // Clear existing collections (optional for dev preview)
  await Product.deleteMany({});
  await Image.deleteMany({});
  await Review.deleteMany({});

  // Add demo products
  await Product.insertMany([
    {
      name: "Brown Butter Chocolate Chip Cookies",
      price: "$4 each",
      description: "Crispy edges, gooey center. A fan favorite.",
      imageUrl: "https://images.unsplash.com/photo-1607083206173-47f1a06a0c19", // example Unsplash
    },
    {
      name: "Mini Lemon Loaf",
      price: "$5",
      description: "Moist lemon cake with a tangy glaze.",
      imageUrl: "https://images.unsplash.com/photo-1589308078057-9727293d2b37",
    },
    {
      name: "Salted Caramel Brownies",
      price: "$3.50",
      description: "Rich dark chocolate with a gooey caramel swirl.",
      imageUrl: "https://images.unsplash.com/photo-1617191519003-3e9732f05ef1",
    },
  ]);

  // Add demo gallery images
  await Image.insertMany([
    {
      url: "https://images.unsplash.com/photo-1548946526-f69e2424cf45",
      caption: "Baking in progress",
    },
    {
      url: "https://images.unsplash.com/photo-1505253210343-d9f09b8493d4",
      caption: "Farmers Market Booth",
    },
    {
      url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
      caption: "Fresh from the oven",
    },
  ]);

  // Add demo reviews
  await Review.insertMany([
    {
      name: "Avery R.",
      content:
        "Hands down the best lemon loaf I’ve ever had. Please open a full bakery!",
      date: "2024-07-01",
    },
    {
      name: "Jordan M.",
      content:
        "The chocolate chip cookies were next level. Bought 3, ate 3... instantly.",
      date: "2024-07-05",
    },
    {
      name: "Sam K.",
      content:
        "I can't go to the market without grabbing one of her brownies. Addicted.",
      date: "2024-07-10",
    },
  ]);

  return NextResponse.json({ message: "Demo data seeded!" });
}
