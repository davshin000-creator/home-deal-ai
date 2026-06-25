"use client";

export default function OpportunityFeed({ opportunities }: { opportunities: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Opportunity Feed
          </p>
          <h2 className="mt-1 text-3xl font-bold">Recommended Today</h2>
        </div>
        <a href="/deals" className="font-semibold text-gray-700 hover:text-black">
          Explore all deals →
        </a>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {opportunities.map((item) => (
          <div key={item.title} className="rounded-3xl border bg-gray-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">{item.market}</p>
                <h3 className="mt-1 text-2xl font-bold">{item.title}</h3>
              </div>
              <div className="rounded-2xl bg-black px-4 py-3 text-center text-white">
                <p className="text-xs text-gray-300">Score</p>
                <p className="text-2xl font-bold">{item.deal_score}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold text-gray-500">Trust Score</p>
                <p className="mt-1 text-xl font-bold">{item.trust_score}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold text-gray-500">Cash Flow</p>
                <p className="mt-1 text-xl font-bold">${item.cash_flow}/mo</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4">
              <p className="font-bold">Why AI picked this</p>
              <ul className="mt-3 grid gap-2 text-sm text-gray-700">
                {item.why.map((reason: string) => (
                  <li key={reason}>✓ {reason}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border bg-white p-4">
              <p className="text-sm font-semibold text-gray-500">Risk Note</p>
              <p className="mt-1 text-sm text-gray-700">{item.risk}</p>
            </div>

            <a
              href="/deals"
              className="mt-5 block rounded-xl bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
            >
              {item.recommendation}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
