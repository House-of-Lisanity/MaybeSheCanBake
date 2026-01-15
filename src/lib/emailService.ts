// src/lib/emailService.ts
import { Resend } from "resend";
import { OrderType } from "@/types/order";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn("RESEND_API_KEY is not set. Emails will fail.");
}

const resend = new Resend(resendApiKey ?? "");

const HEAVEN_EMAIL = "maybeshecanbake@gmail.com";
const FROM_EMAIL = "Maybe She Can Bake <onboarding@resend.dev>";

interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationToCustomer(
  order: OrderType
): Promise<EmailResult> {
  if (!resendApiKey) {
    console.warn("Skipping customer email - RESEND_API_KEY not set");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const isFlashSale = order.type === "flash_sale";
    const subject = isFlashSale
      ? `Order Received: ${order.items[0]?.productName || "Flash Sale"}`
      : "Order Received - Maybe She Can Bake";

    const itemsList = order.items
      .map(
        (item) =>
          `<li><strong>${item.productName}</strong> x${item.quantity} - $${item.price.toFixed(2)}</li>`
      )
      .join("");

    const giftSection = order.isGift
      ? `
        <div style="margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-left: 3px solid #d9a441;">
          <strong>Gift Message:</strong>
          <p>${order.giftMessage || "(No message provided)"}</p>
        </div>
      `
      : "";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3a9188;">Thank You for Your Order!</h2>
        
        <p>Hi ${order.customerName},</p>
        
        <p>We've received your order and Heaven will review it shortly. You'll receive an invoice via email once your order is confirmed.</p>
        
        <h3 style="color: #d9a441;">Order Details</h3>
        <ul style="line-height: 1.8;">
          ${itemsList}
        </ul>
        
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        
        ${giftSection}
        
        ${
          order.deliveryNotes
            ? `<p><strong>Notes:</strong> ${order.deliveryNotes}</p>`
            : ""
        }
        
        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;" />
        
        <p style="color: #666; font-size: 0.9rem;">
          <strong>Important:</strong> Your order is not confirmed until payment is received. 
          Heaven will send you an invoice shortly with payment instructions and pickup details.
        </p>
        
        <p style="margin-top: 2rem;">
          With sprinkles,<br/>
          <strong>Maybe She Can Bake</strong>
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.customerEmail],
      replyTo: HEAVEN_EMAIL,
      subject,
      html,
    });

    if (result.error) {
      console.error("Customer email error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending customer email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send order notification email to Heaven
 */
export async function sendOrderNotificationToHeaven(
  order: OrderType
): Promise<EmailResult> {
  if (!resendApiKey) {
    console.warn("Skipping Heaven email - RESEND_API_KEY not set");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const isFlashSale = order.type === "flash_sale";
    const orderType = isFlashSale ? "FLASH SALE" : "REGULAR";
    const subject = `🎂 New ${orderType} Order from ${order.customerName}`;

    const itemsList = order.items
      .map(
        (item) =>
          `<li><strong>${item.productName}</strong> x${item.quantity} - $${item.price.toFixed(2)}${item.notes ? `<br/><em>Notes: ${item.notes}</em>` : ""}</li>`
      )
      .join("");

    const giftSection = order.isGift
      ? `
        <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-left: 3px solid #d9a441;">
          <strong>🎁 GIFT ORDER - Message for Recipient:</strong>
          <p style="font-style: italic;">${order.giftMessage || "(No message provided)"}</p>
        </div>
      `
      : "";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3a9188;">New Order Received!</h2>
        
        <div style="background: #f7f2eb; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <p style="margin: 0.25rem 0;"><strong>Order Type:</strong> ${orderType}</p>
          <p style="margin: 0.25rem 0;"><strong>Order ID:</strong> ${order._id}</p>
          <p style="margin: 0.25rem 0;"><strong>Date:</strong> ${new Date(order.createdAt || "").toLocaleString()}</p>
        </div>
        
        <h3 style="color: #d9a441;">Customer Information</h3>
        <ul style="line-height: 1.8;">
          <li><strong>Name:</strong> ${order.customerName}</li>
          <li><strong>Email:</strong> <a href="mailto:${order.customerEmail}">${order.customerEmail}</a></li>
          ${order.customerPhone ? `<li><strong>Phone:</strong> ${order.customerPhone}</li>` : ""}
        </ul>
        
        <h3 style="color: #d9a441;">Order Items</h3>
        <ul style="line-height: 1.8;">
          ${itemsList}
        </ul>
        
        <p style="font-size: 1.2rem; margin-top: 1rem;">
          <strong>Total:</strong> $${order.total.toFixed(2)}
        </p>
        
        ${giftSection}
        
        ${
          order.deliveryNotes
            ? `
          <div style="margin-top: 1rem; padding: 1rem; background: #e8f4f3; border-left: 3px solid #3a9188;">
            <strong>Customer Notes:</strong>
            <p>${order.deliveryNotes}</p>
          </div>
        `
            : ""
        }
        
        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #eee;" />
        
        <p style="color: #666; font-size: 0.9rem;">
          <strong>Next Steps:</strong>
          <br/>1. Review the order details
          <br/>2. Send invoice to ${order.customerEmail}
          <br/>3. Confirm pickup/delivery details
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [HEAVEN_EMAIL],
      replyTo: order.customerEmail,
      subject,
      html,
    });

    if (result.error) {
      console.error("Heaven email error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending Heaven email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
