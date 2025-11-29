// maybeshecanbake/src/app/api/about/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import { About } from "@/models/About";
import { NextRequest, NextResponse } from "next/server";

// GET: public – return all sections that actually have body content
export async function GET() {
  try {
    await connectToDatabase();

    const sections = await About.find({
      isVisible: true,
      body: { $exists: true, $ne: "" },
    })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(sections);
  } catch (err) {
    console.error("Error fetching about sections:", err);
    return NextResponse.json(
      { error: "Failed to fetch about sections" },
      { status: 500 }
    );
  }
}

// POST: admin – replace all sections with the provided payload
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const sectionsArray = Array.isArray(body) ? body : [body];

    await About.deleteMany({});
    const newSections = await About.insertMany(sectionsArray);

    return NextResponse.json(newSections, { status: 201 });
  } catch (err) {
    console.error("Error updating about sections:", err);
    return NextResponse.json(
      { error: "Failed to update about sections" },
      { status: 400 }
    );
  }
}
