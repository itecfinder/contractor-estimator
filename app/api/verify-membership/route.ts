import { NextRequest, NextResponse } from "next/server"

const FREE_PLAN_IDS = ["1"] // free estimate plan IDs
const PAID_PLAN_IDS = ["2", "3"] // unlimited access plan IDs

export async function POST(req: NextRequest) {
  try {
    const { businessName, phone, email } = await req.json()

    if (!phone && !email) {
      return NextResponse.json(
        {
          allowed: false,
          message: "Phone or email required",
        },
        { status: 400 }
      )
    }

    const url = `${process.env.BD_API_URL}/api/v2/user/search`

    const searchPayload: Record<string, string> = {}
    if (phone) searchPayload.phone_number = phone
    if (email) searchPayload.email = email
    if (businessName) searchPayload.company = businessName

    const bdResponse = await fetch(url, {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.BD_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchPayload),
    })

    const text = await bdResponse.text()

    if (!bdResponse.ok) {
      throw new Error(`BD Error ${bdResponse.status}: ${text}`)
    }

    const bdData = JSON.parse(text)

    const bdUser = Array.isArray(bdData?.message)
      ? bdData.message[0]
      : bdData?.message || bdData?.user || bdData

    if (bdUser?.user_id || bdUser?.id) {
      const subscriptionId = String(bdUser.subscription_id || bdUser.subscriptionId || "")

      let access: "free" | "paid" = "free"
      if (PAID_PLAN_IDS.includes(subscriptionId)) access = "paid"
      if (FREE_PLAN_IDS.includes(subscriptionId)) access = "free"

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
