// src/app/api/flash-sales/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FlashSale } from "@/models/FlashSale";

type FlashSaleRouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET - Fetch a specific flash sale by ID
 */
export async function GET(
  _req: NextRequest,
  { params }: FlashSaleRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    const flashSale = await FlashSale.findById(id).lean();

    if (!flashSale) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(flashSale);
  } catch (error) {
    console.error("Error fetching flash sale:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sale" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update a flash sale (admin only - to be protected later)
 */
export async function PUT(
  req: NextRequest,
  { params }: FlashSaleRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    // TODO: Add authentication check here when admin is built

    const data = await req.json();

    // Validate dates if they're being updated
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end <= start) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    }

    const updated = await FlashSale.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating flash sale:", error);
    return NextResponse.json(
      { error: "Failed to update flash sale" },
      { status: 400 }
    );
  }
}

/**
 * DELETE - Delete a flash sale (admin only - to be protected later)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: FlashSaleRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    // TODO: Add authentication check here when admin is built

    const deleted = await FlashSale.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flash sale:", error);
    return NextResponse.json(
      { error: "Failed to delete flash sale" },
      { status: 400 }
    );
  }
}
