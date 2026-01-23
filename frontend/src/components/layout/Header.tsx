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
    <header className="border-b border-white/10 bg-[color:var(--app-ink)] shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-5 md:flex-row md:justify-between md:px-10 md:py-8">
        <h1 className="flex items-center gap-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
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
          className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-base font-medium text-white shadow-sm backdrop-blur focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--app-accent)] md:w-auto md:text-lg"
          value={selectedClusterId ?? ""}
          onChange={(e) => onClusterSelect(Number(e.target.value))}
        >
          <option value="" disabled className="text-slate-900">
            Clustering Group
          </option>
          {groups.map((group) => (
            <option
              key={group.cluster_id}
              value={group.cluster_id}
              className="text-slate-900"
            >
              {group.cluster_name}
            </option>
          ))}
        </select>
        <AnalysisForm />
      </div>
    </header>
  );
}
