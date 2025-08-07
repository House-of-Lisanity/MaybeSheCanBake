// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const category = req.nextUrl.searchParams.get("category");

    let query = {};
    if (category && category !== "All") {
      query = { category };
    }

    const products = await Product.find(query).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
