import { NextResponse } from "next/server";
import { Event } from "@/models/Event";
import { connectToDatabase } from "@/lib/mongodb";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const body = await req.json();
  const updated = await Event.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  await Event.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
