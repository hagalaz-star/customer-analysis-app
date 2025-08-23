import React from "react";
import { MyDataType, CustomerData } from "../../types/types";
import {
  HeartMinus,
  WalletCards,
  UserCheck,
  DiamondPercent,
  Star,
  MousePointerClick,
} from "lucide-react";

import AiResultDialog from "../features/AiResultDialog";
import { Separator } from "../ui/separator";
import { User } from "@supabase/supabase-js";
import UserMenu from "../auth/UserMenu";

interface ClusterSidebarProps {
  groups: MyDataType[] | null;
  selectedClusterId: number | null;
  personaData: CustomerData | null;
  user: User | null; // user prop 추가
}

export default function ClusterSidebar({
  groups,
  selectedClusterId,
  personaData,
  user,
}: ClusterSidebarProps) {
  const sideCluster = groups?.find(
    (group) => selectedClusterId === group.cluster_id
  );

  const formatPercentManual = (rate: number) => {
    return (rate * 100).toFixed(1) + " %";
  };
  if (!personaData) {
    return null; // 혹은 <p>데이터 로딩 중...</p>
  }

  return (
    <div className="h-full bg-blue-950 p-4 text-white flex flex-col ">
      <div className="text-center ">
        <UserMenu user={user} />
        <h1 className="mt-5 font-bold text-2xl">Basic Information</h1>
      </div>

      <Separator className="my-4" />

      {sideCluster ? (
        <div className=" flex-1 overflow-y-auto space-y-6 px-2">
          <div className="flex flex-col items-center ">
            <div className="flex items-center space-x-2">
              <HeartMinus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-lg font-medium text-white">평균나이</span>
            </div>

            <span className="text-lg font-bold text-white">
              {sideCluster.avg_age}세
            </span>
          </div>

          <div className="flex flex-col items-center my-8">
            <div className="flex items-center space-x-2">
              <WalletCards className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-lg font-medium text-white">평균구매액</span>
            </div>

            <span className="text-lg font-bold text-white">
              ${sideCluster.avg_purchase_amount}
            </span>
          </div>

          <div className="flex flex-col items-center my-8">
            <div className="flex items-centerspace-x-2">
              <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-lg font-medium text-white">구독률</span>
            </div>

            <span className="text-lg font-bold text-white">
              {formatPercentManual(sideCluster.subscription_rate)}
            </span>
          </div>

          <div className="flex flex-col justify-between items-center my-8">
            <div className="flex space-x-2">
              <DiamondPercent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-lg font-medium text-white">할인이용률</span>
            </div>

            <span className="text-lg font-bold text-white">
              {`${sideCluster.discount_usage_rate} %`}
            </span>
          </div>

          <div className="flex flex-col items-center my-8">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-lg font-medium text-white">리뷰 평점</span>
            </div>

            <span className="text-lg font-bold text-white">
              {`${sideCluster.review_rating_score} / 5`}
            </span>
          </div>

          <div className="flex justify-center items-center w-full">
            <AiResultDialog
              clusterData={sideCluster}
              selectedClusterId={selectedClusterId}
              personaData={personaData}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-cente ">
          <div className="flex  items-center space-x-2">
            <MousePointerClick />
            <span>클러스터를 선택해 주세요 !!!</span>
          </div>
        </div>
      )}
    </div>
  );
}
