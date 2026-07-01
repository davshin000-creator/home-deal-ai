"use client";

import type { DashboardData } from "./DashboardHero";

export default function DashboardWidgets({
  data,
}: {
  data?: DashboardData;
}) {
  const widgets = [
    ["Analyses", data?.totalAnalyses ?? 0],
    ["Watchlist", data?.watchlistCount ?? 0],
    ["Saved Deals", data?.savedDeals ?? 0],
    ["Portfolio Score", data?.portfolioScore ?? 0],
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {widgets.map(([label, value]) => (
        <div key={label} className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {value}
          </p>
        </div>
      ))}
    </section>
  );
}
