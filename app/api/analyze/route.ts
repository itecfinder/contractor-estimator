import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("API route started");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Key exists:", !!process.env.OPENAI_API_KEY);

    await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "test",
    });

    console.log("OpenAI call succeeded");

    return NextResponse.json({
      surfaces: [],
      damage: [],
      scope: [],
      followUps: [],
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}

