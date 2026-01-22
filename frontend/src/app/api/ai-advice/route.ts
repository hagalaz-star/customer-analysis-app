import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface AdviceRequest {
  profile: {
    Age: number;
    "Purchase Amount (USD)": number;
    "Subscription Status": boolean | string;
    "Frequency of Purchases": string;
  };
  question?: string;
}

function isValidNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

export async function POST(request: Request) {
  try {
    const { profile, question } = (await request.json()) as AdviceRequest;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "고객 정보(profile)가 필요합니다." },
        { status: 400 }
      );
    }

    if (
      !isValidNumber(profile.Age) ||
      profile.Age < 0 ||
      profile.Age > 120 ||
      !isValidNumber(profile["Purchase Amount (USD)"]) ||
      profile["Purchase Amount (USD)"] < 0 ||
      typeof profile["Frequency of Purchases"] !== "string"
    ) {
      return NextResponse.json(
        { error: "고객 정보가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const subscriptionLabel =
      typeof profile["Subscription Status"] === "boolean"
        ? profile["Subscription Status"]
          ? "Yes"
          : "No"
        : profile["Subscription Status"];

    const prompt = `당신은 고객 맞춤형 쇼핑 조언을 제공하는 전문가입니다.
아래 고객 정보를 바탕으로 실행 가능한 조언을 3가지 제안해주세요.
각 조언은 "- "로 시작하고, 마크다운(**, # 등)을 사용하지 말아주세요.
문장은 간결하고 친절하게 작성해주세요.

고객 정보:
- 나이: ${profile.Age}세
- 평균 구매액: $${profile["Purchase Amount (USD)"]}
- 구독 여부: ${subscriptionLabel}
- 구매 빈도: ${profile["Frequency of Purchases"]}

추가 요청: ${question ? question : "없음"}`;

    const genAi = new GoogleGenAI({ apiKey });
    const generationResult = await genAi.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const aiText = generationResult.text;
    if (typeof aiText !== "string" || !aiText.trim()) {
      throw new Error("AI 응답에서 유효한 텍스트를 추출할 수 없습니다.");
    }

    return NextResponse.json({ advice: aiText.trim() });
  } catch (error) {
    console.error("AI advice route error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "AI 조언 생성 중 서버에서 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
