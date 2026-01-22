import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";

interface PromtRequest {
  prompt: string;
}

export async function POST(request: Request) {
  try {
    const { prompt: originalKoreanPrompt } =
      (await request.json()) as PromtRequest;
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: `AI API 키가 설정되지 않았습니다.` },
        { status: 500 }
      );
    }
    if (
      !originalKoreanPrompt ||
      typeof originalKoreanPrompt !== "string" ||
      originalKoreanPrompt.length > 1000
    ) {
      return NextResponse.json(
        { error: `유효한 프롬프가 필요합니다` },
        { status: 400 }
      );
    }

    const genAi = new GoogleGenAI({ apiKey: apiKey });

    // --- 1. 이미지 생성을 위한 API 호출 ---
    const imagePrompt = `Generate a single, friendly, cartoon-style illustration of a person based on this context: "${originalKoreanPrompt}"`;
    const imageResult = await genAi.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let imageUrl = "";

    if (imageResult.candidates && imageResult.candidates[0]?.content?.parts) {
      const imagePart = imageResult.candidates[0].content.parts.find(
        (part) => part.inlineData
      );
      if (imagePart && imagePart.inlineData) {
        const base64Image = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        imageUrl = `data:${mimeType};base64,${base64Image}`;
      }
    }

    if (!imageUrl) {
      console.log(
        "Image Generation Failed. AI Response:",
        JSON.stringify(imageResult, null, 2)
      );
      throw new Error(
        "AI가 이미지를 생성하지 못했습니다. 프롬프트를 확인하거나 다시 시도해주세요."
      );
    }

    // --- 2. 한글 설명을 위한 API 호출 ---
    const descriptionPrompt = `다음 고객 정보를 바탕으로, 이 고객 그룹을 대표하는 가상의 페르소나를 구체적으로 만들어줘.
아래 항목들을 반드시 포함하고, 각 항목의 제목(###)은 그대로 유지해줘. 마크다운은 사용하지 말고 일반 텍스트로만 응답해줘.

1. 이름 및 직업
(여기에 가상의 이름과 직업을 1문장으로 작성)

2. 페르소나 요약
(이 사람의 라이프스타일과 성격을 2~3문장으로 묘사)

3. 핵심 니즈 및 불편함
(쇼핑과 관련하여 이 사람이 느끼는 가장 큰 니즈와 불편함(Pain Point)을 1~2가지 서술)

4. 대표 인용구
(이 사람이 할 법한 대표적인 말을 큰따옴표 안에 1문장 작성)

---
고객 정보: "${originalKoreanPrompt}".

고객 정보: "${originalKoreanPrompt}""`;
    const descriptionResult = await genAi.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: descriptionPrompt }] }],
    });

    const description = descriptionResult.text ?? "";

    if (!description) {
      throw new Error("AI가 설명을 생성하지 못했습니다.");
    }

    return NextResponse.json({
      description: description,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error(
      "Google AI API(@google/genai style) Error in route.ts:', error"
    );
    let errorMessage = "AI 제안 생성 중 서버에서 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
