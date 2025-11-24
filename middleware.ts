import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_KEY = process.env.ADMIN_ACCESS_KEY;

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  if (pathname.startsWith("/admin")) {
    const key = url.searchParams.get("accessKey");
    if (key !== ACCESS_KEY) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
