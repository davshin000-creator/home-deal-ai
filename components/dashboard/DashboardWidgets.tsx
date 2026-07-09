"use client";

type LooseDashboardData = Record<string, any>;

function pickNumber(data: LooseDashboardData | undefined, keys: string[], fallback = 0) {
  if (!data) return fallback;
  for (const key of keys) {
    const value = Number(data[key]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

export default function DashboardWidgets({
  data,
}: {
  data?: LooseDashboardData;
}) {
  const widgets = [
    ["Analyses", pickNumber(data, ["totalAnalyses", "analyses", "analysisCount"])],
    ["Watchlist", pickNumber(data, ["watchlistCount", "watchlist", "savedWatchlist"])],
    ["Saved Deals", pickNumber(data, ["savedDeals", "deals", "savedDealsCount"])],
    ["Portfolio Score", pickNumber(data, ["portfolioScore", "score", "healthScore"])],
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

