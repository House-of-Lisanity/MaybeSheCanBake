// src/app/api/events/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const events = await Event.find({ isPublished: true }).sort({ date: 1 });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 400 }
    );
  }
}
