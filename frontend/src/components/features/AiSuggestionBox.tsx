import type { MyDataType } from "@/types/types";
import { useState } from "react";
import axios from "axios";

interface AiSuggestionProps {
  clusterData: MyDataType | null;
}

export default function AiSuggestionBox({ clusterData }: AiSuggestionProps) {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestion = async () => {
    if (!clusterData) {
      setError("분석할 클러스터 정보가 없습니다. 클러스터를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiSuggestion(null);

    const prompt = `
       다음 고객 세그먼트 정보를 바탕으로, 이 그룹을 위한 창의적이고 실행 가능한 마케팅 전략 2가지를 제안해줘.
  
  각 전략은 '전략:'으로 시작하는 제목과, '-'로 시작하는 구체적인 액션 플랜 목록을 포함해야 해.
  아래 예시와 동일한 형식으로, 마크다운(**, ##, *)은 절대 사용하지 말고 일반 텍스트로만 답변해줘.

  --- 예시 형식 ---
  전략: 맞춤형 콘텐츠로 재방문 유도
  - 고객의 이전 구매 기록을 바탕으로 개인화된 이메일 뉴스레터 발송
  - 관심 카테고리의 신상품 입고 시 앱 푸시 알림 전송
  - VIP 고객을 위한 비공개 온라인 스타일링 클래스 개최

  전략: 커뮤니티 활성화를 통한 팬덤 구축
  - 구매 고객 전용 온라인 카페 또는 단톡방 개설
  - 우수 활동 멤버에게 쇼핑 포인트 및 등급 혜택 제공
  - 시즌별 신상품을 가장 먼저 체험할 수 있는 '얼리버드' 프로그램 운영
  ---

  [분석할 고객 정보]
  고객 세그먼트 이름: ${clusterData.cluster_name}
  주요 구매 빈도: ${clusterData.dominant_frequency}
  평균 연령: 약 ${clusterData.avg_age.toFixed(0)}세
  평균 구매액(USD): 약 $${clusterData.avg_purchase_amount.toFixed(2)}
  구독률: 약 ${(clusterData.subscription_rate * 100).toFixed(1)}%
  현재 기본 마케팅 제안: ${clusterData.marketing_suggestion}
    `;

    try {
      const response = await axios.post("/api/generate-suggestion", { prompt });

      setAiSuggestion(response.data.suggestion);
    } catch (err) {
      let errorMessage = "AI 제안을 가져오는 중 문제가 발생했습니다.";
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        typeof err.response.data.error === "string"
      ) {
        errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("AI 제안 요청 실패 상세 정보:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestion = (suggestionText: string) => {
    const strategies = suggestionText
      .split("전략:")
      .filter((s) => s.trim() !== "");

    return strategies.map((strategiesBlock, index) => {
      const lines = strategiesBlock.trim().split("\n");

      const title = lines[0].trim();

      const actionPlans = lines
        .slice(1)
        .map((plan) => plan.trim().replace(/^-/, "").trim());

      return (
        <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
          <h5 className="font-bold text-indigo-700 mb-2">{`전략 ${
            index + 1
          }: ${title}`}</h5>
          <ul>
            {actionPlans.map((plan, planIndex) => (
              <li key={planIndex} className="text-gray-600">
                {plan}
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handleSuggestion}
        disabled={isLoading || !clusterData}
        className="bg-gradient-to-r mt-4 from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? "ai 분석중..."
          : clusterData
          ? `${clusterData?.cluster_name} AI 제안 받기`
          : "클러스터 선택필요"}
      </button>

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="text-purple-600 mt-2">
            AI가 열심히 제안을 만들고 있습니다...
          </p>
        </div>
      )}

      {error && (
        <p className="mt-6 text-center text-red-500 p-4 bg-red-50 rounded-md">
          오류: {error}
        </p>
      )}

      {aiSuggestion && !isLoading && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-800 mb-2">AI 추천:</h4>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {renderSuggestion(aiSuggestion)}
          </div>
        </div>
      )}
    </div>
  );
}
