import { MyDataType } from "@/types/types";
import Image from "next/image";
import AnalysisForm from "../features/AnalysisForm";

interface ClusterProps {
  groups: MyDataType[];
  selectedClusterId: number | null;
  onClusterSelect: (clusterId: number) => void;
}

export default function Header({
  groups,
  selectedClusterId,
  onClusterSelect,
}: ClusterProps) {
  return (
    <header className="bg-blue-950 ">
      <div className="mx-auto flex max-w-7xl flex-col  items-center gap-6 px-4 py-5 md:flex-row md:justify-between md:px-10 md:py-10">
        <h1 className="flex items-center gap-6 text-xl font-bold text-white bg-blue-950 md:text-2xl">
          <Image
            src="/images/ai-logo.png"
            alt="AI Persona Logo"
            width={50}
            height={32}
            className="rounded-2xl md:width={60}"
          />
          <span>AI Persona</span>
        </h1>
        <select
          className="w-full text-white text-lg bg-blue-600 rounded-2xl p-3 md:w-auto md:text-2xl"
          value={selectedClusterId ?? ""}
          onChange={(e) => onClusterSelect(Number(e.target.value))}
        >
          <option value="" disabled>
            Clustering Group
          </option>
          {groups.map((group) => (
            <option key={group.cluster_id} value={group.cluster_id}>
              {group.cluster_name}
            </option>
          ))}
        </select>
        <AnalysisForm />
      </div>
    </header>
  );
}
