import { NextResponse } from "next/server";

export function middleware(req) {
  const userRole = req.cookies.get("userRole")?.value;

  if (userRole !== "owner") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
