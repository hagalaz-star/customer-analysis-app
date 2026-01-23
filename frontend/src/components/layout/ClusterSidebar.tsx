import React from "react";
import { MyDataType } from "../../types/types";
import {
  HeartMinus,
  WalletCards,
  UserCheck,
  DiamondPercent,
  Star,
  MousePointerClick,
} from "lucide-react";

import { Separator } from "../ui/separator";
import { User } from "@supabase/supabase-js";
import UserMenu from "../auth/UserMenu";

interface ClusterSidebarProps {
  groups: MyDataType[] | null;
  selectedClusterId: number | null;
  user: User | null; // user prop 추가
}

export default function ClusterSidebar({
  groups,
  selectedClusterId,
  user,
}: ClusterSidebarProps) {
  const sideCluster = groups?.find(
    (group) => selectedClusterId === group.cluster_id
  );

  const formatPercentManual = (rate: number) => {
    return (rate * 100).toFixed(1) + " %";
  };
  return (
    <div className="flex h-full flex-col bg-slate-950 px-4 py-6 text-white">
      <div className="text-center">
        <UserMenu user={user} />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">
          Basic Information
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          선택한 클러스터의 핵심 지표
        </p>
      </div>

      <Separator className="my-5 bg-white/10" />

      {sideCluster ? (
        <div className="flex-1 space-y-4 overflow-y-auto px-1 pb-6">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-200">
              <HeartMinus className="h-5 w-5" />
              <span className="text-sm font-medium">평균나이</span>
            </div>
            <span className="mt-2 block text-2xl font-semibold text-white">
              {sideCluster.avg_age}세
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-200">
              <WalletCards className="h-5 w-5" />
              <span className="text-sm font-medium">평균구매액</span>
            </div>
            <span className="mt-2 block text-2xl font-semibold text-white">
              ${sideCluster.avg_purchase_amount}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-200">
              <UserCheck className="h-5 w-5" />
              <span className="text-sm font-medium">구독률</span>
            </div>
            <span className="mt-2 block text-2xl font-semibold text-white">
              {formatPercentManual(sideCluster.subscription_rate)}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-200">
              <DiamondPercent className="h-5 w-5" />
              <span className="text-sm font-medium">할인이용률</span>
            </div>
            <span className="mt-2 block text-2xl font-semibold text-white">
              {`${sideCluster.discount_usage_rate} %`}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-200">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium">리뷰 평점</span>
            </div>
            <span className="mt-2 block text-2xl font-semibold text-white">
              {`${sideCluster.review_rating_score} / 5`}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center">
          <div className="flex items-center space-x-2 text-slate-300">
            <MousePointerClick />
            <span>클러스터를 선택해 주세요 !!!</span>
          </div>
        </div>
      )}
    </div>
  );
}
