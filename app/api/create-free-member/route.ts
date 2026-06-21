import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const business = await req.json()

    if (!business?.email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${process.env.BD_API_URL}/api/v2/user/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.BD_API_KEY!,
        },
        body: JSON.stringify({
          email: business.email,

          password:
            Math.random().toString(36).slice(-12) + "A1!",

          subscription_id: "8", // FREE PLAN

          active: "1",

          company: business.name || "",
          phone: business.phone || "",
          address1: business.address || "",

          flow_source: "itecfinder_estimator",
        }),
      }
    )

    const raw = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: raw },
        { status: 500 }
      )
    }

    return NextResponse.json(JSON.parse(raw))
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
