import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = cookies().get("session")?.value

  return NextResponse.json({
    user: session ? { email: session } : null,
  })
}
