import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Image } from "@/models/Image";

export async function GET() {
  try {
    await connectToDatabase();

    const image = await Image.findOne({ isHeadshot: true }).lean();

    if (!image) {
      return NextResponse.json(
        { error: "No headshot image found" },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (err) {
    console.error("Error fetching headshot:", err);
    return NextResponse.json(
      { error: "Failed to load headshot" },
      { status: 500 }
    );
  }
}
