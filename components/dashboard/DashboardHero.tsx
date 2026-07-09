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

function pickString(data: LooseDashboardData | undefined, keys: string[], fallback = "") {
  if (!data) return fallback;
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return fallback;
}

export default function DashboardHero({
  data,
}: {
  data?: LooseDashboardData;
}) {
  const userName = pickString(data, ["userName", "name", "firstName"], "");
  const analyses = pickNumber(data, ["totalAnalyses", "analyses", "analysisCount"]);
  const savedDeals = pickNumber(data, ["savedDeals", "deals", "savedDealsCount"]);
  const portfolioScore = pickNumber(data, ["portfolioScore", "score", "healthScore"]);

  return (
    <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Nestrova Dashboard
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-950">
        Welcome{userName ? `, ${userName}` : ""}.
      </h1>

      <p className="mt-3 max-w-2xl text-neutral-600">
        Analyze properties, compare opportunities, and generate AI-powered investment decisions.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Analyses</p>
          <p className="mt-2 text-2xl font-semibold">{analyses}</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Saved Deals</p>
          <p className="mt-2 text-2xl font-semibold">{savedDeals}</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Portfolio Score</p>
          <p className="mt-2 text-2xl font-semibold">{portfolioScore}</p>
        </div>
      </div>
    </section>
  );
}

