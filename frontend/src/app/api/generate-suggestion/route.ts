import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface PromtRequest {
  prompt: string;
}

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as PromtRequest;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: `AI API 키가 설정되지 않았습니다.` },
        { status: 500 }
      );
    }

    if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
      return NextResponse.json(
        { error: "유효한 프롬프트가 필요합니다" },
        { status: 400 }
      );
    }
    const genAi = new GoogleGenAI({ apiKey: apiKey });

    const generationResult = await genAi.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const aiText = generationResult.text;
    if (typeof aiText !== "string") {
      console.log(
        "AI 응답에서 텍스트를 추출하지 못했습니다. 전체 결과:",
        aiText
      );
      throw new Error("AI 응답에서 유효한 텍스트를 추출할 수 없습니다.");
    }
    return NextResponse.json({ suggestion: aiText });
  } catch (error) {
    console.error(
      "Google AI API(@google/genai style) Error in route.ts:', error"
    );
    let errorMessage = "AI 제안 생성 중 서버에서 오류가 발생했습니다.";
    if (error instanceof Error) {
      console.error("AI API Error:", error.message);
      errorMessage += `: ${error.message}`;

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  }
}
