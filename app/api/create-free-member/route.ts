import { NextRequest, NextResponse } from "next/server"

const BD_CREATE_URL = `${process.env.BD_API_URL}/api/v2/user/create`

export async function POST(req: NextRequest) {
  try {
    const business = await req.json()

    const email = String(business?.email || "").trim().toLowerCase()
    const password = String(business?.password || "")

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    console.log("🔥 BD CREATE START:", email)

    // 1️⃣ CREATE USER IN BD
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
      console.error("❌ Invalid BD response:", raw)

      return NextResponse.json(
        {
          success: false,
          message: "Invalid BD response",
        },
        { status: 502 }
      )
    }

    // 2️⃣ HANDLE SUCCESS OR DUPLICATE CASES
    if (response.ok) {
      return NextResponse.json({
        success: true,
        status: "created",
        user: data,
      })
    }

    // 3️⃣ HANDLE DUPLICATE EMAIL (CRITICAL FIX)
    const msg = JSON.stringify(data).toLowerCase()

    if (msg.includes("duplicate") || msg.includes("already")) {
      console.log("⚠️ DUPLICATE USER DETECTED:", email)

      return NextResponse.json({
        success: true,
        status: "existing_user",
        user: data,
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
    console.error("❌ create-free-member crash:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    )
  }
}
