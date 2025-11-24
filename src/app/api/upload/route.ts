// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongodb";
import { Image } from "@/models/Image";
import type { UploadApiOptions } from "cloudinary";

export const runtime = "nodejs"; // ensure Node runtime for multipart parsing

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file");
    const desiredPublicId =
      (formData.get("publicId") as string | null) || undefined; // optional, for overwrite
    const folder = (formData.get("folder") as string | null) || "mscb"; // optional folder
    const caption = (formData.get("caption") as string | null) || undefined; // optional metadata
    const tagsRaw = (formData.get("tags") as string | null) || undefined; // optional comma-separated tags

    const tags: string[] | undefined = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    if (!file) throw new Error("No file uploaded.");
    if (!(file instanceof Blob)) {
      throw new Error("Uploaded file is not a Blob.");
    }

    // Convert file to base64 string
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${(file as File).type};base64,${base64}`;

    // Cloudinary upload options
    const cldOptions: UploadApiOptions = {
      folder,
      upload_preset: "ml_default", // keep your preset if you’re using it
    };

    // Support stable replacements (same publicId) if provided
    if (desiredPublicId) {
      cldOptions.public_id = desiredPublicId;
      cldOptions.overwrite = true;
      cldOptions.invalidate = true; // bust caches
    }

    const result = await cloudinary.uploader.upload(dataUri, cldOptions);

    // Build update object with proper typing
    const update: {
      url: string;
      publicId: string;
      format?: string;
      width?: number;
      height?: number;
      bytes?: number;
      caption?: string;
      tags?: string[];
      isPublished: boolean;
    } = {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      isPublished: true,
    };

    if (typeof caption === "string") {
      update.caption = caption;
    }
    if (Array.isArray(tags)) {
      update.tags = tags;
    }

    // Upsert in Mongo using Cloudinary public_id as the unique key
    const imageDoc = await Image.findOneAndUpdate(
      { publicId: result.public_id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(imageDoc, { status: 201 });
  } catch (err: unknown) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
