import { connectToDatabase } from "@/lib/mongodb";
import { About } from "@/models/About";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const bio = await About.findOne({ isPublished: true });
  return NextResponse.json(bio);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  try {
    // Replace existing bio (optional)
    await About.deleteMany({});
    const newBio = await About.create(body);
    return NextResponse.json(newBio, { status: 201 });
  } catch (err) {
    console.error("Error updating about:", err);
    return NextResponse.json(
      { error: "Failed to update bio" },
      { status: 400 }
    );
  }
}
