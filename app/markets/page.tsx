"use client";

import { useMemo } from "react";

const MARKETS = [
  { city: "Irvine", state: "CA", score: 86, yield: 3.8, appreciation: 4.2, risk: "Low" },
  { city: "Austin", state: "TX", score: 82, yield: 5.1, appreciation: 3.8, risk: "Medium" },
  { city: "Dallas", state: "TX", score: 80, yield: 5.6, appreciation: 3.1, risk: "Medium" },
  { city: "Phoenix", state: "AZ", score: 76, yield: 4.9, appreciation: 3.4, risk: "Medium" },
  { city: "Miami", state: "FL", score: 74, yield: 4.3, appreciation: 4.8, risk: "High" },
  { city: "Anaheim", state: "CA", score: 78, yield: 4.1, appreciation: 3.9, risk: "Medium" },
];

function grade(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 75) return "Good";
  if (score >= 65) return "Watch";
  return "Risky";
}

export default function MarketsPage() {
  const sorted = useMemo(() => [...MARKETS].sort((a, b) => b.score - a.score), []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          ← Back to Nestrova
        </a>

        <section className="my-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Market Heat Map
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Top Investment Markets
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            A simple market scoring dashboard to help users decide where to search next.
            These starter scores can later be connected to live data.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          {sorted.map((market) => (
            <div key={`${market.city}-${market.state}`} className="rounded-2xl border bg-white p-6 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{market.state}</p>
                  <h2 className="text-2xl font-bold">{market.city}</h2>
                </div>
                <div className="rounded-2xl bg-black px-4 py-3 text-center text-white">
                  <p className="text-xs text-gray-300">Score</p>
                  <p className="text-2xl font-bold">{market.score}</p>
                </div>
              </div>

              <p className="mt-4 text-lg font-bold">{grade(market.score)} Market</p>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Avg Yield</span>
                  <span className="font-semibold">{market.yield}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Expected Appreciation</span>
                  <span className="font-semibold">+{market.appreciation}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level</span>
                  <span className="font-semibold">{market.risk}</span>
                </div>
              </div>

              <a
                href={`/deals?city=${encodeURIComponent(market.city)}&state=${market.state}`}
                className="mt-5 block rounded-lg bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
              >
                Find Deals
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
