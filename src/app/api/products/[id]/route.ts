// maybeshecanbake/src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

// GET a single product
export async function GET(
  _req: NextRequest,
  { params }: ProductRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE a product
export async function PUT(
  req: NextRequest,
  { params }: ProductRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    const data = await req.json();
    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 400 }
    );
  }
}

// DELETE a product
export async function DELETE(
  _req: NextRequest,
  { params }: ProductRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 400 }
    );
  }
}
