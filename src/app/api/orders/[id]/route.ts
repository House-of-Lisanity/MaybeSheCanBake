// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

type OrderRouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET - Fetch a specific order by ID (admin only - to be protected later)
 */
export async function GET(
  _req: NextRequest,
  { params }: OrderRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    // TODO: Add authentication check here when admin is built

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update order status/details (admin only - to be protected later)
 */
export async function PUT(
  req: NextRequest,
  { params }: OrderRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    // TODO: Add authentication check here when admin is built

    const data = await req.json();

    // Set timestamp fields based on status changes
    if (data.status === "confirmed" && !data.confirmedAt) {
      data.confirmedAt = new Date();
    }
    if (data.status === "completed" && !data.completedAt) {
      data.completedAt = new Date();
    }
    if (data.status === "cancelled" && !data.cancelledAt) {
      data.cancelledAt = new Date();
    }

    const updated = await Order.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 400 }
    );
  }
}

/**
 * DELETE - Delete an order (admin only - to be protected later)
 */
export async function DELETE(
  _req: NextRequest,
  { params }: OrderRouteContext
): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const { id } = await params;

    // TODO: Add authentication check here when admin is built

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 400 }
    );
  }
}
