// maybeshecanbake/src/app/api/hero/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Image } from "@/models/Image";

export async function GET() {
  try {
    await connectToDatabase();

    // Find the single hero image
    const hero = await Image.findOne({ isHero: true }).lean();

    if (!hero) {
      return NextResponse.json(
        { error: "No hero image found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hero);
  } catch (err) {
    console.error("GET /api/hero error:", err);
    return NextResponse.json(
      { error: "Failed to fetch hero image." },
      { status: 500 }
    );
  }
}
