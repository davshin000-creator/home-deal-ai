"use client";

type IndexData = {
  name: string;
  value: string;
  change: number;
};

const usMarket: IndexData[] = [
  {
    name: "S&P 500",
    value: "6,325",
    change: 0.81,
  },
  {
    name: "NASDAQ",
    value: "23,184",
    change: 1.23,
  },
  {
    name: "DOW",
    value: "44,712",
    change: -0.18,
  },
  {
    name: "VIX",
    value: "17.4",
    change: -2.1,
  },
];

const cryptoMarket: IndexData[] = [
  {
    name: "BTC",
    value: "$118,420",
    change: 2.41,
  },
  {
    name: "ETH",
    value: "$3,870",
    change: 1.84,
  },
  {
    name: "SOL",
    value: "$189",
    change: 4.93,
  },
];

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span
      className={
        "rounded-full px-2 py-1 text-xs font-semibold " +
        (positive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700")
      }
    >
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export default function MarketOverview() {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Market Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Global Market Snapshot
          </h2>
        </div>

        <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          AI Confidence 82%
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border p-5">
          <h3 className="mb-4 text-lg font-bold">
            🇺🇸 US Market
          </h3>

          <div className="space-y-4">
            {usMarket.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.value}
                  </p>
                </div>

                <ChangeBadge value={item.change} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h3 className="mb-4 text-lg font-bold">
            ₿ Crypto
          </h3>

          <div className="space-y-4">
            {cryptoMarket.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.value}
                  </p>
                </div>

                <ChangeBadge value={item.change} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-900 p-5 text-white">
          <h3 className="text-lg font-bold">
            AI Market Sentiment
          </h3>

          <div className="mt-6">
            <div className="mb-4 flex justify-between">
              <span>Bullish</span>
              <span className="font-bold">
                82%
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-700">
              <div
                className="h-3 rounded-full bg-emerald-400"
                style={{ width: "82%" }}
              />
            </div>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Momentum</span>
                <span>Bullish</span>
              </div>

              <div className="flex justify-between">
                <span>Macro</span>
                <span>Neutral</span>
              </div>

              <div className="flex justify-between">
                <span>Risk</span>
                <span>Low</span>
              </div>

              <div className="flex justify-between">
                <span>Liquidity</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}