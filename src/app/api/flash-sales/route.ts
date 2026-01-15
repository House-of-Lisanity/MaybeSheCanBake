// src/app/api/flash-sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FlashSale } from "@/models/FlashSale";

/**
 * GET - Fetch active flash sales
 * Returns flash sales that are currently active and within date range
 */
export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();

    // Find active flash sales within the date range
    const flashSales = await FlashSale.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ startDate: 1 })
      .lean();

    return NextResponse.json(flashSales);
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sales" },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new flash sale (admin only - to be protected later)
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // TODO: Add authentication check here when admin is built

    const body = await req.json();

    // Validate required fields
    const { title, slug, startDate, endDate, products } = body;

    if (!title || !slug || !startDate || !endDate || !products) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await FlashSale.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A flash sale with this slug already exists" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const flashSale = await FlashSale.create({
      ...body,
      orderCount: 0,
      totalRevenue: 0,
    });

    return NextResponse.json(flashSale, { status: 201 });
  } catch (error) {
    console.error("Error creating flash sale:", error);
    return NextResponse.json(
      { error: "Failed to create flash sale" },
      { status: 400 }
    );
  }
}
