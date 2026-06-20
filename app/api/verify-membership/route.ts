 import { NextRequest, NextResponse } from "next/server"

const FREE_PLAN_IDS = ["1"]
const PAID_PLAN_IDS = ["2", "3"]

export async function POST(req: NextRequest) {
  try {
    const { businessName, phone, email } = await req.json()

    if (!phone && !email && !businessName) {
      return NextResponse.json(
        {
          allowed: false,
          message: "Phone, email, or business name required",
        },
        { status: 400 }
      )
    }

    const searchValue = phone || email || businessName

    const bdResponse = await fetch(`${process.env.BD_API_URL}/api/v2/user/search`, {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.BD_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchValue,
      }),
    })

    const text = await bdResponse.text()

    if (!bdResponse.ok) {
      throw new Error(`BD Error ${bdResponse.status}: ${text}`)
    }

    const bdData = JSON.parse(text)

    const bdUser = Array.isArray(bdData?.message)
      ? bdData.message[0]
      : bdData?.message?.[0] || bdData?.message || bdData?.user || bdData || null

    if (bdUser?.user_id || bdUser?.id) {
      const subscriptionId = String(bdUser.subscription_id || bdUser.subscriptionId || "")

      const access = PAID_PLAN_IDS.includes(subscriptionId)
        ? "paid"
        : FREE_PLAN_IDS.includes(subscriptionId)
          ? "free"
          : "lead"

      const isPaid = access === "paid"

      return NextResponse.json({
        allowed: true,
        canContinue: true,
        access,
        remainingPasses: isPaid ? null : 1,
        upgradeMessage: isPaid
          ? null
          : "Your free access has already been used. Please upgrade to continue.",
        memberId: bdUser.user_id || bdUser.id,
        name: `${bdUser.first_name || ""} ${bdUser.last_name || ""}`.trim(),
        email: bdUser.email || "",
        phone: bdUser.phone_number || "",
        subscriptionId: subscriptionId || null,
      })
    }

    return NextResponse.json({
      allowed: true,
      canContinue: true,
      access: "lead",
      remainingPasses: 1,
      upgradeMessage: "Your free estimate pass is available.",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        allowed: false,
        canContinue: false,
        message: "Unable to verify account",
      },
      { status: 500 }
    )
  }
}

