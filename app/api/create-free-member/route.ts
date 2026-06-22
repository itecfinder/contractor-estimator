import { NextRequest, NextResponse } from "next/server"

const BD_CREATE_URL = `${process.env.BD_API_URL}/api/v2/user/create`

export async function POST(req: NextRequest) {
  try {
    const business = await req.json()

    const email = String(business?.email || "").trim().toLowerCase()
    const password = Math.floor(100000 + Math.random() * 900000).toString()

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      )
    }

    console.log("BD CREATE ATTEMPT:", email)

    // 1️⃣ CREATE USER
    const response = await fetch(BD_CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.BD_API_KEY!,
      },
      body: JSON.stringify({
        email,
        password,
        subscription_id: "8",

        first_name: business.first_name || "",
        last_name: business.last_name || "",
        phone: business.phone || "",
        address1: business.address || "",
        city: business.city || "",
        state_code: business.state_code || "",
        zip_code: business.zip_code || "",
        country_code: business.country_code || "US",

        active: "1",
        flow_source: "itecfinder_estimator",
      }),
    })

    const raw = await response.text()

    let data: any
    try {
      data = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid BD response" },
        { status: 502 }
      )
    }

    // 2️⃣ SUCCESS CASE (NEW USER)
    if (response.ok) {
      return NextResponse.json({
        success: true,
        status: "created",
        user: data,
        email,
        password, // ⚠️ only returned so frontend can auto-login
      })
    }

    const errorText = JSON.stringify(data).toLowerCase()

    // 3️⃣ DUPLICATE HANDLING (CRITICAL FIX)
    if (
      errorText.includes("duplicate") ||
      errorText.includes("already") ||
      errorText.includes("exists")
    ) {
      console.log("⚠️ DUPLICATE USER:", email)

      // OPTIONAL: try to fetch user state indirectly via BD response
      return NextResponse.json({
        success: true,
        status: "existing_user",
        user: data,
        email,
        password, // optional fallback
      })
    }

    // 4️⃣ OTHER ERRORS
    return NextResponse.json(
      {
        success: false,
        message: "BD create failed",
        error: data,
      },
      { status: 502 }
    )
  } catch (error) {
    console.error(" BD CREATE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    )
  }
}
