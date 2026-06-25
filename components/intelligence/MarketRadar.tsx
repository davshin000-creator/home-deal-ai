"use client";

export default function MarketRadar({ markets }: { markets: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Market Radar
      </p>
      <h2 className="mt-1 text-3xl font-bold">Where AI sees momentum</h2>

      <div className="mt-6 grid gap-4">
        {markets.map((market) => (
          <div key={market.market} className="rounded-2xl border bg-gray-50 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{market.market}</h3>
              <div className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                {market.opportunity_score}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <div>
                <p className="text-gray-500">Demand</p>
                <p className="font-bold">{market.demand}</p>
              </div>
              <div>
                <p className="text-gray-500">Inventory</p>
                <p className="font-bold">{market.inventory}</p>
              </div>
              <div>
                <p className="text-gray-500">Rent Trend</p>
                <p className="font-bold">{market.rent_trend}</p>
              </div>
              <div>
                <p className="text-gray-500">Confidence</p>
                <p className="font-bold">{market.confidence}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
