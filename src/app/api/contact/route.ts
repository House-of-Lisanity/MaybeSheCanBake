// src/app/api/contact/route.ts

// NEW:
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  // eslint-disable-next-line no-console
  console.warn("RESEND_API_KEY is not set. Contact form emails will fail.");
}

const resend = new Resend(resendApiKey ?? "");

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

// TODO: replace with Heaven's real email address
const HEAVEN_EMAIL = "maybeshecanbake@gmail.com";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, message } = (await req.json()) as ContactBody;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // 1) Email to Heaven
    const toHeaven = await resend.emails.send({
      from: "Maybe She Can Bake <no-reply@maybeshecanbake.com>",
      to: [HEAVEN_EMAIL],
      reply_to: email,
      subject: `New message from ${name} via website`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (toHeaven.error) {
      return NextResponse.json(
        { error: toHeaven.error.message },
        { status: 500 }
      );
    }

    // 2) Confirmation email to visitor
    const toVisitor = await resend.emails.send({
      from: "Maybe She Can Bake <no-reply@maybeshecanbake.com>",
      to: [email],
      subject: "Thanks for reaching out to Maybe She Can Bake",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks so much for reaching out! Heaven has received your message and will respond as soon as she can.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
        <p>With sprinkles,<br/>Maybe She Can Bake</p>
      `,
    });

    if (toVisitor.error) {
      return NextResponse.json(
        { error: toVisitor.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Message sent successfully.",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unexpected error. Please try again." },
      { status: 500 }
    );
  }
}
