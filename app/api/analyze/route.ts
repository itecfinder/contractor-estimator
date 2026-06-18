import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Say OK",
    });

    return NextResponse.json({
      success: true,
      output: response.output_text,
    });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        status: error?.status,
        code: error?.code,
        type: error?.type,
        raw: {
          name: error?.name,
          message: error?.message,
          status: error?.status,
          code: error?.code,
          type: error?.type,
        },
      },
      { status: 500 }
    );
  }
}

