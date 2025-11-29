// maybeshecanbake/src/app/api/gallery/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import { Image } from "@/models/Image";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    // Return all published images for the gallery,
    // sorted newest-first (optional)
    const images = await Image.find({
      isPublished: true,
      isHero: { $ne: true },
      isLogo: { $ne: true },
      isHeadshot: { $ne: true },
      excludeFromGallery: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(images);
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return NextResponse.json(
      { error: "Failed to fetch gallery images." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const image = await Image.create({
      ...body,
      isPublished: true,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (err) {
    console.error("Error uploading image:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 400 }
    );
  }
}
