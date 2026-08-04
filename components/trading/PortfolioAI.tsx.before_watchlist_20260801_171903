"use client";

import { useState } from "react";

type Asset = {
  symbol: string;
  weight: number;
};

type Result = {
  score: number;
  risk: string;
  diversification: string;
  technologyExposure: string;
  cryptoExposure: string;
  recommendation: string;
  actions: string[];
};

export default function PortfolioAI() {
  const [assets, setAssets] = useState<Asset[]>([
    { symbol: "BTC", weight: 40 },
    { symbol: "ETH", weight: 20 },
    { symbol: "NVDA", weight: 25 },
    { symbol: "AAPL", weight: 15 },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const updateAsset = (
    index: number,
    key: "symbol" | "weight",
    value: string
  ) => {
    const next = [...assets];

    if (key === "weight") {
      next[index].weight = Number(value);
    } else {
      next[index].symbol = value.toUpperCase();
    }

    setAssets(next);
  };

  const addAsset = () => {
    setAssets([...assets, { symbol: "", weight: 0 }]);
  };

  const analyze = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/trading/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assets }),
      });

      const json = await res.json();
      setResult(json);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border p-6 bg-white shadow-sm mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Portfolio AI
      </h2>

      <div className="space-y-3">
        {assets.map((asset, i) => (
          <div key={i} className="flex gap-3">
            <input
              className="border rounded-lg px-3 py-2 w-40"
              value={asset.symbol}
              onChange={(e) =>
                updateAsset(i, "symbol", e.target.value)
              }
              placeholder="BTC"
            />

            <input
              className="border rounded-lg px-3 py-2 w-32"
              type="number"
              value={asset.weight}
              onChange={(e) =>
                updateAsset(i, "weight", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={addAsset}
          className="rounded-lg border px-4 py-2"
        >
          + Add Asset
        </button>

        <button
          onClick={analyze}
          className="rounded-lg bg-black text-white px-5 py-2"
        >
          {loading ? "Analyzing..." : "Analyze Portfolio"}
        </button>
      </div>

      {result && (
        <div className="mt-8 rounded-xl border p-6 space-y-3">
          <h3 className="text-xl font-semibold">
            Portfolio Score: {result.score}
          </h3>

          <p>Risk: {result.risk}</p>

          <p>Diversification: {result.diversification}</p>

          <p>Technology Exposure: {result.technologyExposure}</p>

          <p>Crypto Exposure: {result.cryptoExposure}</p>

          <p>{result.recommendation}</p>

          <ul className="list-disc ml-6">
            {result.actions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
