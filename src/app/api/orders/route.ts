// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import {
  sendOrderConfirmationToCustomer,
  sendOrderNotificationToHeaven,
} from "@/lib/emailService";

/**
 * POST - Submit a new order (regular or flash sale)
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Validate required fields
    const { type, customerName, customerEmail, items, subtotal, total } = body;

    if (
      !type ||
      !customerName ||
      !customerEmail ||
      !items ||
      items.length === 0 ||
      subtotal === undefined ||
      total === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Validate order type
    if (type !== "regular" && type !== "flash_sale") {
      return NextResponse.json(
        { error: "Invalid order type. Must be 'regular' or 'flash_sale'" },
        { status: 400 }
      );
    }

    // Create the order
    const order = await Order.create({
      type,
      flashSaleId: body.flashSaleId,
      customerName,
      customerEmail,
      customerPhone: body.customerPhone,
      items,
      subtotal,
      total,
      pickupLocation: body.pickupLocation,
      pickupDate: body.pickupDate,
      deliveryNotes: body.deliveryNotes,
      giftMessage: body.giftMessage,
      isGift: Boolean(body.giftMessage),
      status: "pending",
      paymentStatus: "pending",
    });

    // Send email notifications
    const [customerEmailResult, heavenEmailResult] = await Promise.all([
      sendOrderConfirmationToCustomer(order.toObject()),
      sendOrderNotificationToHeaven(order.toObject()),
    ]);

    // Log email results but don't fail the order if emails fail
    if (!customerEmailResult.success) {
      console.error(
        "Failed to send customer email:",
        customerEmailResult.error
      );
    }

    if (!heavenEmailResult.success) {
      console.error("Failed to send Heaven email:", heavenEmailResult.error);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order._id,
        message: "Order submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET - List all orders (admin only - to be protected later)
 */
export async function GET() {
  try {
    await connectToDatabase();

    // TODO: Add authentication check here when admin is built

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
