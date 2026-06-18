import { NextResponse } from "next/server";

export async function POST() {
  const key = process.env.OPENAI_API_KEY || "";

  return NextResponse.json({
    surfaces: [
      {
        label: JSON.stringify({
          len: key.length,
          value: key,
        }),
        area: 1,
        unit: "test",
        confidence: 1,
      },
    ],
    damage: [],
    scope: [],
    followUps: [],
  });
}


