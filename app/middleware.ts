import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value

  const isLoginPage = req.nextUrl.pathname.startsWith("/login")
  const isApi = req.nextUrl.pathname.startsWith("/api")

  // allow login + api routes
  if (isLoginPage || isApi) {
    return NextResponse.next()
  }

  // block everything else if not logged in
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
