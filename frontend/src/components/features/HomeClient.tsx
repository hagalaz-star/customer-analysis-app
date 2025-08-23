"use client";

import Header from "@/components/layout/Header";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClusterSidebar from "@/components/layout/ClusterSidebar";
import SegmentDetailsView from "@/components/features/SegmentDetailsView";
import axios from "axios";
import { useEffect, useState } from "react";
import { CustomerData } from "@/types/types";
import { User } from "@supabase/supabase-js";

interface HomeClientProps {
  user: User | null;
}

export default function HomeClient({ user }: HomeClientProps) {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/data/customer_segments_final.json")
      .then((response) => {
        console.log("Fetched data structure:", response.data);
        setCustomerData(response.data);

        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message || "데이터를 불러오는 중 에러가 발생했습니다.");
        setCustomerData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleClusterSelect = (clusterId: number) => {
    setSelectedClusterId(clusterId);
    console.log("Home with ID:", clusterId);
  };

  if (isLoading) {
    return <p>데이터를 불러오는중...</p>;
  }

  if (error) {
    return <p>에러: {error} </p>;
  }

  if (!customerData) {
    return <p>데이터가 없습니다.</p>;
  }

  console.log(
    "Home component rendering with selectedClusterId:",
    selectedClusterId
  );
  return (
    <div>
      <DashboardLayout
        selectOptions={
          <Header
            groups={customerData.cluster_segments}
            selectedClusterId={selectedClusterId}
            onClusterSelect={handleClusterSelect}
          />
        }
        sidebar={
          <ClusterSidebar
            groups={customerData.cluster_segments}
            selectedClusterId={selectedClusterId}
            personaData={customerData}
            user={user}
          />
        }
        mainContent={
          <SegmentDetailsView
            selectedClusterId={selectedClusterId}
            clusters={customerData.cluster_segments}
            summary={customerData.overall_data_summary}
          />
        }
      />
    </div>
  );
}
