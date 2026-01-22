"use client";

import AiAdviceDialog from "@/components/features/AiAdviceDialog";
import AiResultDialog from "@/components/features/AiResultDialog";
import AiSuggestionBox from "@/components/features/AiSuggestionBox";
import { CustomerData, MyDataType } from "@/types/types";

interface AiHubSectionProps {
  selectedCluster: MyDataType | null;
  selectedClusterId: number | null;
  personaData: CustomerData;
}

export default function AiHubSection({
  selectedCluster,
  selectedClusterId,
  personaData,
}: AiHubSectionProps) {
  const selectedClusterName = selectedCluster?.cluster_name;

  return (
    <section className="mt-12">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">AI 인사이트 허브</h3>
            <p className="text-sm text-slate-500">
              고객 정보를 기반으로 조언, 페르소나, 마케팅 제안을 한곳에서
              관리하세요.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {selectedClusterName
              ? `선택된 클러스터: ${selectedClusterName}`
              : "클러스터를 선택하면 일부 기능이 활성화됩니다."}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-800">
              AI 맞춤 조언
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              고객 입력값을 기반으로 바로 적용 가능한 쇼핑 조언을 제공합니다.
            </p>
            <div className="mt-4 flex justify-center">
              <AiAdviceDialog />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-800">
              AI 페르소나 생성
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              선택한 클러스터를 대표하는 페르소나를 이미지와 함께 생성합니다.
            </p>
            <div className="mt-4 flex justify-center">
              <AiResultDialog
                clusterData={selectedCluster}
                selectedClusterId={selectedClusterId}
                personaData={personaData}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-800">
              AI 마케팅 제안
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              클러스터 특성에 맞춘 실행형 마케팅 전략을 생성합니다.
            </p>
            <div className="mt-4">
              <AiSuggestionBox clusterData={selectedCluster} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
