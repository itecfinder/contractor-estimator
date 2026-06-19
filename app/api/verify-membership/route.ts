import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  console.log("VERIFY MEMBER ROUTE HIT")

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

    console.log("BD STATUS:", bdResponse.status)

    const text = await bdResponse.text()
    console.log("BD RAW RESPONSE:", text)

    if (!bdResponse.ok) {
      throw new Error(`BD Error ${bdResponse.status}: ${text}`)
    }

    const bdData = JSON.parse(text)

    const bdUser = Array.isArray(bdData?.message)
      ? bdData.message[0]
      : bdData?.message || bdData?.user || bdData

    if (bdUser?.user_id || bdUser?.id) {
      const subscriptionId = bdUser.subscription_id || bdUser.subscriptionId

      return NextResponse.json({
        allowed: true,
        access: subscriptionId ? "paid" : "free",
        memberId: bdUser.user_id || bdUser.id,
        name: `${bdUser.first_name || ""} ${bdUser.last_name || ""}`.trim(),
        email: bdUser.email || "",
        phone: bdUser.phone_number || "",
        subscriptionId: subscriptionId || null,
      })
    }

    console.log("NEW LEAD", {
      businessName,
      phone,
      email,
      source: "contractpro",
    })

    return NextResponse.json({
      allowed: true,
      access: "lead",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        allowed: false,
        message: "Unable to verify account",
      },
      { status: 500 }
    )
  }
}
