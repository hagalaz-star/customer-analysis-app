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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[color:var(--app-bg)] text-[color:var(--app-ink)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-10%,_var(--app-accent-soft),_transparent_60%),radial-gradient(1000px_600px_at_110%_-20%,_var(--app-warm-soft),_transparent_60%)]" />
      <div className="relative z-10 flex-shrink-0">{selectOptions}</div>
      <div className="relative z-10 flex-1 p-4 sm:p-8">
        <div className="mx-auto min-h-[70vh] w-full max-w-[1600px] overflow-hidden rounded-2xl border border-slate-200/60 bg-[color:var(--app-surface)] shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
          <div className="flex h-full flex-col lg:flex-row">
            <div className="w-full flex-shrink-0 border-b border-slate-200/70 bg-slate-950/95 lg:w-72 lg:border-b-0 lg:border-r">
              {sidebar}
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 sm:p-6 lg:p-8"> {mainContent}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
