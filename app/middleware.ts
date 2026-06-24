import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value

  const isLogin = req.nextUrl.pathname.startsWith("/login")
  const isAuthAPI = req.nextUrl.pathname.startsWith("/api")

  if (isLogin || isAuthAPI) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
