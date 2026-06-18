import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Analyze this contractor estimate request.",
    });

    return NextResponse.json({
      surfaces: [
        {
          label: response.output_text ?? "Success",
          area: 1,
          unit: "sq ft",
          confidence: 1,
        },
      ],
      damage: [],
      scope: [],
      followUps: [],
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

