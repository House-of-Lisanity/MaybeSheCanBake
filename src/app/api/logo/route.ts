// maybeshecanbake/src/app/api/logo/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Image } from "@/models/Image";

export async function GET() {
  try {
    await connectToDatabase();

    // Find the single logo image
    const logo = await Image.findOne({ isLogo: true }).lean();

    if (!logo) {
      return NextResponse.json(
        { error: "No logo image found" },
        { status: 404 }
      );
    }

    return NextResponse.json(logo);
  } catch (err) {
    console.error("GET /api/logo error:", err);
    return NextResponse.json(
      { error: "Failed to fetch logo image." },
      { status: 500 }
    );
  }
}
