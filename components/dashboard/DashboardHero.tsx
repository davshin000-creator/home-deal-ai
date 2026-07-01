"use client";

export type DashboardData = {
  userName?: string;
  totalAnalyses?: number;
  savedDeals?: number;
  portfolioScore?: number;
  watchlistCount?: number;
};

export default function DashboardHero({
  data,
}: {
  data?: DashboardData;
}) {
  return (
    <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Nestrova Dashboard
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-neutral-950">
        Welcome{data?.userName ? `, ${data.userName}` : ""}.
      </h1>

      <p className="mt-3 max-w-2xl text-neutral-600">
        Analyze properties, compare opportunities, and generate AI-powered investment decisions.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Analyses
          </p>
          <p className="mt-2 text-2xl font-semibold">{data?.totalAnalyses ?? 0}</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Saved Deals
          </p>
          <p className="mt-2 text-2xl font-semibold">{data?.savedDeals ?? 0}</p>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Portfolio Score
          </p>
          <p className="mt-2 text-2xl font-semibold">{data?.portfolioScore ?? 0}</p>
        </div>
      </div>
    </section>
  );
}
