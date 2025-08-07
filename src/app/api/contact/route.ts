import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Placeholder for future Resend integration
  console.log("📬 New contact form submission:", { name, email, message });

  return NextResponse.json({ message: "Message received! We'll reply soon." });
}
