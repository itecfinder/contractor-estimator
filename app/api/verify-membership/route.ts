import { NextRequest, NextResponse } from "next/server"

const FREE_PLAN_IDS = ["1"]
const PAID_PLAN_IDS = ["2", "3"]

export async function POST(req: NextRequest) {
  console.log("VERIFY MEMBER ROUTE HIT")

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

    const bdResponse = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.BD_API_KEY!,
      },
    })

    console.log("BD STATUS:", bdResponse.status)

    const text = await bdResponse.text()

    console.log("BD RAW RESPONSE:", text)

    if (!bdResponse.ok) {
      throw new Error(`BD Error ${bdResponse.status}: ${text}`)
    }

    const bdUser = JSON.parse(text)

    // Member found
    if (bdUser?.id || bdUser?.user_id) {
      const subscriptionId = String(
        bdUser.subscription_id || ""
      )

      const access = PAID_PLAN_IDS.includes(subscriptionId)
        ? "paid"
        : "free"

      return NextResponse.json({
        allowed: true,
        access,
        memberId: bdUser.id || bdUser.user_id,
        subscriptionId,
        subscriptionName:
          bdUser.subscription_name || "",
      })
    }

    // Not found = lead
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
