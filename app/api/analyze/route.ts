import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    surfaces: [
      {
        label: `exists=${!!process.env.OPENAI_API_KEY} len=${process.env.OPENAI_API_KEY?.length || 0}`,
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
