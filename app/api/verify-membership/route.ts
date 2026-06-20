import { NextRequest, NextResponse } from "next/server"

const FREE_PLAN_IDS = ["8"]
const PAID_PLAN_IDS = ["4", "112"]

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        {
          allowed: false,
          message: "Email required",
        },
        { status: 400 }
      )
    }

    const url =
      `${process.env.BD_API_URL}/api/v2/user/get` +
      `?property=email` +
      `&property_value=${encodeURIComponent(email)}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.BD_API_KEY!,
      },
    })

    if (!response.ok) {
      throw new Error(`BD API ${response.status}`)
    }

    const user = await response.json()

    // User not found = lead
    if (!user?.id && !user?.user_id) {
      return NextResponse.json({
        allowed: true,
        access: "lead",
      })
    }

    const planId = String(
      user.membership_plan_id ||
      user.subscription_id ||
      ""
    )

    if (PAID_PLAN_IDS.includes(planId)) {
      return NextResponse.json({
        allowed: true,
        access: "paid",
      })
    }

    if (FREE_PLAN_IDS.includes(planId)) {
      return NextResponse.json({
        allowed: true,
        access: "free",
      })
    }

    return NextResponse.json({
      allowed: true,
      access: "lead",
    })
  } catch (error) {
    console.error("VERIFY ERROR:", error)

    return NextResponse.json(
      {
        allowed: false,
        message: "Unable to verify account",
      },
      { status: 500 }
    )
  }
}
