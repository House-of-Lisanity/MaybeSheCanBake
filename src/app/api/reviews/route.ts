import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const reviews = await Review.find({ isPublished: true }).sort({ date: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const review = await Review.create(body);
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("Error creating review:", err);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 400 }
    );
  }
}
