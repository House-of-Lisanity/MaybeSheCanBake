import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const file = body.file; // This should be a base64 or remote URL string

    const response = await cloudinary.uploader.upload(file, {
      upload_preset: "ml_default",
    });

    return NextResponse.json(
      { url: response.secure_url, public_id: response.public_id },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
