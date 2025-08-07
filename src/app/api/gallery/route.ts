import { connectToDatabase } from "@/lib/mongodb";
import { Image } from "@/models/Image";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const images = await Image.find({ isPublished: true });
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const image = await Image.create(body);
    return NextResponse.json(image, { status: 201 });
  } catch (err) {
    console.error("Error uploading image:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 400 }
    );
  }
}
