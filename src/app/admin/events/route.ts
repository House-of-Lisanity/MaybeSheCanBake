// // src/app/api/events/route.ts
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { Event } from "@/models/Event";

// /**
//  * GET /api/events
//  * - Returns published events, sorted by date ascending.
//  * - If you need admin-only listing (including unpublished), add a query flag later (e.g., ?all=1).
//  */
// export async function GET() {
//   try {
//     await connectToDatabase();
//     const events = await Event.find({ isPublished: true })
//       .sort({ date: 1 })
//       .lean();
//     return NextResponse.json(events, { status: 200 });
//   } catch (err) {
//     console.error("GET /api/events error:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch events" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * POST /api/events
//  * - Creates a new event.
//  * - Expects: { title, date, location, time, description?, isPublished? }
//  */
// export async function POST(req: Request) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();

//     const { title, date, location, time, description, isPublished } =
//       body || {};

//     if (!title || !date || !location || !time) {
//       return NextResponse.json(
//         { error: "Missing required fields: title, date, location, time" },
//         { status: 400 }
//       );
//     }

//     const created = await Event.create({
//       title,
//       date, // expect YYYY-MM-DD string
//       location,
//       time, // e.g. "8:00 AM – 1:00 PM"
//       description: description ?? "",
//       isPublished: typeof isPublished === "boolean" ? isPublished : true,
//     });

//     return NextResponse.json(created, { status: 201 });
//   } catch (err) {
//     console.error("POST /api/events error:", err);
//     return NextResponse.json(
//       { error: "Failed to create event" },
//       { status: 500 }
//     );
//   }
// }
