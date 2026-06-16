import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Say ContractPro AI is connected successfully.",
    });

    return NextResponse.json({
      success: true,
      result: response.output_text,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
