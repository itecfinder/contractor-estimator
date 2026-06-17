import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    surfaces: [
      {
        label: "Test Surface",
        area: 100,
        unit: "sq ft",
        confidence: 0.95,
      },
    ],
    damage: [],
    scope: [],
    followUps: [],
  });
}
