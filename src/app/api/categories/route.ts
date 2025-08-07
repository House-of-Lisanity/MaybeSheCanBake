import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("❌ Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories." },
      { status: 500 }
    );
  }
}
