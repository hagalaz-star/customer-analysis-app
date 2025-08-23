import { MyDataType, CustomerData } from "@/types/types";
import axios from "axios";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { savePersona } from "@/app/login/actions";

interface aiResultDialogProps {
  clusterData: MyDataType | null;
  selectedClusterId: number | null;
  personaData: CustomerData;
}

interface AiResultType {
  imageUrl: string;
  description: string;
}

function AiResultDialog({
  clusterData,
  personaData,
  selectedClusterId,
}: aiResultDialogProps) {
  const [aiOpen, setAiOpen] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [personaTitle, setPersonaTitle] = useState<string>("");

  const handlePersona = async () => {
    if (!clusterData) {
      setError("분석할 클러스터가 없습니다 !!! ");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiOpen(true);
    setAiResult(null);

    const prompt = `
  Generate a single, friendly, cartoon-style illustration of a person who represents this customer group.
  Also, write a simple, one-paragraph description for this person.

  This person is in their ${clusterData.avg_age.toFixed(0)}s,
  and their favorite things to buy are ${clusterData.top_items
    .slice(0, 2)
    .map((item) => item.items)
    .join(" and ")}.
`;
    try {
      const response = await axios.post("/api/generate-persona", { prompt });

      setAiResult(response.data);
    } catch (err) {
      let errorMessage = "AI 가 이미지를 만들지 못하였습니다.";
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
      console.error("AI 제안 요청실패 :", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!personaTitle.trim()) {
      alert("페르소나 이름 정하쇼");
      return;
    }

    if (!personaData || !personaData.cluster_segments) {
      console.error("Persona data is not ready.");
      return;
    }
    console.log("선택된 클러스터 ID:", selectedClusterId); // ★ 추가

    const selectedCluster = personaData.cluster_segments.find(
      (c) => c.cluster_id === selectedClusterId
    );
    console.log("찾은 클러스터 정보:", selectedCluster); // ★ 추가

    if (!aiResult || !selectedCluster) {
      console.error("AI 결과나 선택된 클러스터가 없습니다.");
      return;
    }

    const personaToSave = {
      title: personaTitle,
      imageUrl: aiResult.imageUrl,
      description: aiResult.description,
      clusterName: selectedCluster.cluster_name,
    };
    const result = await savePersona(personaToSave);

    if (result.error) {
      alert(result.error);
    } else if (result.success) {
      alert(result.success);
      setPersonaTitle("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-blue-400 px-8 py-6 text-white font-bold text-2xl rounded-xl">
          AI 페르소나 생성
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>AI persona</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] p-1">
          {isLoading && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
              <p className="text-purple-600 mt-2">
                AI가 페르소나를 형상화 하고있습니다...
              </p>
            </div>
          )}
          {error && (
            <p className="mt-6 text-center text-red-500 p-4 bg-red-50 rounded-md">
              오류: {error}
            </p>
          )}

          {/* API 호출 후, 화면 */}
          {aiOpen && !isLoading && aiResult && (
            <div>
              <div>
                <Image
                  src={aiResult.imageUrl}
                  alt="AI가 생성한 페르소나 이미지"
                  width={800} // Next.js Image 컴포넌트는 width와 height가 필요.
                  height={500}
                  className="rounded-lg"
                />
              </div>
              <div className="mt-6 p-4 bg-grey-50 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  페르소나 분석
                </h3>
                <p className="mt-10 text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {aiResult?.description}
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <label
                  htmlFor="persona-title"
                  className="text-sm font-medium leading-none"
                >
                  페르소나 제목
                </label>
                <input
                  id="persona-title"
                  type="text"
                  value={personaTitle}
                  onChange={(e) => setPersonaTitle(e.target.value)}
                  placeholder="예: 20대 패션 얼리어답터"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={handleSave}
                  className="w-full justify-center rounded-md bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  이 페르소나 저장하기
                </button>
              </div>
            </div>
          )}
          {/* API 호출 전, 최초 화면 */}
          {!aiResult && !isLoading && !error && (
            <div className="text-center py-8">
              <p>아래 버튼을 눌러 페르소나를 생성하세요.</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-10">
          <Button
            type="button"
            onClick={handlePersona}
            disabled={isLoading || !clusterData}
          >
            {isLoading
              ? "생성 중..."
              : aiResult
              ? "다시 생성하기"
              : " 생성하기"}
          </Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AiResultDialog;
