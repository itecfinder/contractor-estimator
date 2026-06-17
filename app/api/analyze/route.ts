import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Say ContractPro AI is connected successfully.",
    });

    return NextResponse.json({
      surfaces: [
        {
          label: "Test Surface",
          area: 100,
          unit: "sq ft",
          confidence: 0.95,
        },
      ],
      damage: [
        {
          label: "Minor damage",
          severity: "low",
        },
      ],
      scope: ["Demo", "Paint"],
      followUps: ["Any water damage?"],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
