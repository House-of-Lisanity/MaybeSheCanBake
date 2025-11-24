// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;

    const slug = searchParams.get("category");
    const featured = searchParams.get("featured"); // "true" or null

    const query: Record<string, unknown> = {};

    // Filter by category via slug, unless "All"
    if (slug && slug !== "All") {
      const categoryDoc = await Category.findOne({ slug });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Filter by featured flag if requested
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Public API: only return visible + available products
    query.isVisible = true;
    query.isAvailable = true;

    const products = await Product.find(query).populate("category").lean();
    return NextResponse.json(products);
  } catch (err: unknown) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
