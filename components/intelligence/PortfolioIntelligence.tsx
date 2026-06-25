"use client";

export default function PortfolioIntelligence({ data }: { data: any }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Portfolio Intelligence
      </p>
      <h2 className="mt-1 text-3xl font-bold">Portfolio Health</h2>

      <div className="mt-6 rounded-3xl bg-black p-6 text-white">
        <p className="text-sm text-gray-300">Health Score</p>
        <p className="mt-2 text-6xl font-bold">{data.health_score}</p>
        <p className="mt-2 text-gray-300">{data.label}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          ["Saved Deals", data.saved_deals],
          ["Average Score", `${data.avg_deal_score}/100`],
          ["Average Yield", `${data.avg_yield}%`],
          ["Avg Cash Flow", `$${data.avg_cash_flow}/mo`],
          ["Diversification", data.diversification],
          ["Risk", data.risk],
          ["Growth", data.growth],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
