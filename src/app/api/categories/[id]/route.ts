import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";

type CategoryRouteContext = {
  params: Promise<{ id: string }>;
};

// GET a single category
export async function GET(
  _req: NextRequest,
  { params }: CategoryRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE a category
export async function PUT(
  req: NextRequest,
  { params }: CategoryRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    const data = await req.json();
    const updated = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 400 }
    );
  }
}

// DELETE a category
export async function DELETE(
  _req: NextRequest,
  { params }: CategoryRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 400 }
    );
  }
}
