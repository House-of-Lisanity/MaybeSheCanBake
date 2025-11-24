// src/app/admin/events/[id]/route.ts
// Stubbed admin events route for initial deploy.

import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  _req: NextRequest,
  _context: RouteParams
): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Admin events GET not implemented yet." },
    { status: 501 }
  );
}

export async function PUT(
  _req: NextRequest,
  _context: RouteParams
): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Admin events PUT not implemented yet." },
    { status: 501 }
  );
}

export async function DELETE(
  _req: NextRequest,
  _context: RouteParams
): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Admin events DELETE not implemented yet." },
    { status: 501 }
  );
}
