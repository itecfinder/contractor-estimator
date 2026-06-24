import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookie = cookies().get("session")?.value

  if (!cookie) {
    return NextResponse.json({ user: null })
  }

  try {
    const session = JSON.parse(cookie)

    return NextResponse.json({
      user: session.loggedIn ? session : null,
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
