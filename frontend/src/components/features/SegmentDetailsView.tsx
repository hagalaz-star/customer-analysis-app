"use client";

import { CustomerData, MyDataType, OverallDataSummary } from "@/types/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  BarElement,
  TooltipItem,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";
import { Bar, Doughnut, PolarArea, Chart } from "react-chartjs-2";
// import { Pie } from "react-chartjs-2";
import { Ban } from "lucide-react";
import TopPaymentCard from "./TopPaymentCard";
import { Separator } from "@/components/ui/separator";
import AiHubSection from "./AiHubSection";

// Chart.js에 필요한 요소들을 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

interface SegmentDetailsViewProps {
  selectedClusterId: number | null;
  clusters: MyDataType[];
  summary: OverallDataSummary | null;
  personaData: CustomerData;
}

export default function SegmentDetailsView({
  selectedClusterId,
  clusters,
  summary,
  personaData,
}: SegmentDetailsViewProps) {
  const selectedCluster = clusters.find(
    (cluster) => cluster.cluster_id === selectedClusterId
  );

  if (!selectedCluster) {
    // "선택된 클러스터 없음"
    return (
      <div className="p-4 text-center text-gray-500 text-2xl">
        <div className="flex justify-center items-center space-x-2">
          <Ban />
          <span>선택한 클러스터가 없습니다</span>
        </div>
      </div>
    );
  }
  const topItems = selectedCluster.top_items;

  // top_items 배열에서 'items' 이름만 추출하여 새로운 배열 생성
  const itemLables = topItems.map((item) => item.items);

  // top_items 배열에서 'count' 숫자만 추출하여 새로운 배열 생성
  // const itemCounts = topItems.map((item) => item.count);

  // 막대그래프 데이터 (선택된 클러스터의 구매율)
  const BarData = topItems.map((item) => item.cluster_percentage);

  const lineDataChart = itemLables.map((label) => {
    const overall_data = summary?.overall_items_purchase_rate.find(
      (stat) => stat.item === label
    );
    return overall_data ? overall_data.overall_percentage : 0;
  });

  // 3. Chart.js에 전달할 최종 데이터 객체

  // 바 그래프 데이터 객체 만들기
  const mixedChart = {
    labels: itemLables,
    datasets: [
      {
        type: "bar" as const,
        label: "top 6 아이템 판매량",
        data: BarData,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        yAxisID: "y",
        order: 2,
        borderWidth: 1,
        barThickness: 50,
      },
      {
        type: "line" as const,
        label: "전체 아이템 판매량",
        data: lineDataChart,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y",
        order: 1,
      },
    ],
  };

  const mixedChartOption = {
    responsive: true, //
    plugins: {
      legnd: {
        display: true,
      },
      title: {
        display: true,
        text: `총 ${summary?.total_unique_items} 가지 아이템중  Top 6 구매 수량`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: TooltipItem<"bar" | "line">) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label = `${context.parsed.y.toFixed(2)}%`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "구매율 (%)",
        },
      },
    },
  };

  const topCategories = selectedCluster.top_categories;
  const categoryPercentage = topCategories.map(
    (item) => item.cluster_percentage
  );
  const categoryLables = topCategories.map((item) => item.category);

  const categoryData = {
    labels: categoryLables,
    datasets: [
      {
        label: "카테고리 비율",
        data: categoryPercentage,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 165,0)",
        ],
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Top 카테고리 (전체 ${summary?.total_unique_categories}종)`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie" | "doughnut">) {
            const datasetLabel = context.dataset.label || "비율";

            const value = context.parsed;
            return `  ${datasetLabel}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
  };

  const topLocation = selectedCluster.top_location;
  const locationLabel = topLocation.map((item) => item.location);
  const locationPercentage = topLocation.map((item) => item.cluster_percentage);

  const barLocation = {
    labels: locationLabel,
    datasets: [
      {
        label: "판매지역",
        data: locationPercentage,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  };

  const locationOption = {
    indexAxis: "x" as const,
    responsive: true,
    elements: {
      bar: {
        borderWidth: 3,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `주요 고객 분포 지역 (전체 ${summary?.total_unique_locations}개 주)`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            const datasetLabel = context.dataset.label || "";
            const value = context.formattedValue;

            return ` ${datasetLabel} ${value} %`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "구매지역(%)",
        },
        ticks: {
          callback: function (value: string | number) {
            if (Number.isInteger(value)) {
              return value;
            }
            return "";
          },
        },
      },
    },
  };

  const topSeason = selectedCluster.top_season;
  const seasonLabel = topSeason.map((item) => item.season);
  const seasonPercentage = topSeason.map((item) => item.cluster_percentage);

  const seasonPie = {
    labels: seasonLabel,
    datasets: [
      {
        label: "계절에 따른 판매 순위",
        data: seasonPercentage,
        backgroundColor: [
          "rgb(160, 82, 45)",
          "rgb(65, 105, 225)",
          "rgb(255, 215,0)",
          "rgb(211, 211, 211)",
        ],
      },
    ],
  };

  const seasonOptions = {
    indexAxis: "x" as const,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "계절에 따른 판매 순위",
        font: {
          size: 18,
        },
      },

      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"polarArea">) {
            const datasetLabel = context.dataset.label || "";
            const value = context.raw as number;

            return ` ${datasetLabel} ${value.toFixed(2)} %`;
          },
        },
      },
    },
    scales: {
      r: {
        // 'r'은 방사형(radial) 축을 의미합니다.
        ticks: {
          display: false, // 눈금 텍스트를 숨깁니다.
        },
      },
    },
  };

  const topPayments = selectedCluster.top_payment.slice(0, 3);
  console.log("실제로 렌더링에 사용되는 topPayments 데이터:", topPayments);

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-[400px] w-full">
          <Chart type="bar" data={mixedChart} options={mixedChartOption} />
        </div>

        <div className="relative h-[400px] w-full">
          <Bar data={barLocation} options={locationOption} />
        </div>

        <div className="relative h-[400px] w-full mx-auto max-w-sm">
          <Doughnut data={categoryData} options={categoryOptions} />
        </div>

        <div className="relative h-[400px] w-full">
          <PolarArea data={seasonPie} options={seasonOptions} />
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-4 text-center">
          Top Payment Methods
        </h3>

        <div className="flex justify-evenly">
          {topPayments.map((payment) => (
            <div className="w-60" key={payment.payment}>
              <TopPaymentCard
                title={payment.payment}
                count={payment.cluster_count}
                percentage={payment.cluster_percentage}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-10" />
      <AiHubSection
        selectedCluster={selectedCluster}
        selectedClusterId={selectedClusterId}
        personaData={personaData}
      />
    </div>
  );
}
