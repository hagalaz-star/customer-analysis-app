import React from "react";

interface DashboardLayoutProps {
  selectOptions: React.ReactNode;
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
}

export default function DashboardLayout({
  selectOptions,
  sidebar,
  mainContent,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <div className="flex-shrink-0">{selectOptions}</div>
      <div className="flex-1 p-4 sm:p-8 overflow-hidden">
        <div className="h-full flex max-w-[1600px] mx-auto rounded-xl bg-white shadow-xl overflow-hidden">
          <div className="w-72 flex-shrink-0 border-r border-gray-200">
            {sidebar}
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6"> {mainContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
