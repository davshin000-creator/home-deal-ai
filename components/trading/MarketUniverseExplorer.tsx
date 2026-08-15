"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useResearchUniverse } from "@/components/research/useResearchUniverse";

type FilterType = "all" | "crypto" | "stock";

export default function MarketUniverseExplorer() {
  const { assets, loading, count } =
    useResearchUniverse();

  const [query, setQuery] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("all");

  const normalizedQuery =
    query.trim().toLowerCase();

  const cryptoCount = useMemo(
    () =>
      assets.filter(
        (item) =>
          item.asset_type === "crypto",
      ).length,
    [assets],
  );

  const stockCount = useMemo(
    () =>
      assets.filter(
        (item) =>
          item.asset_type === "stock",
      ).length,
    [assets],
  );

  const filteredAssets = useMemo(() => {
    const result = assets.filter((item) => {
      if (
        filter !== "all" &&
        item.asset_type !== filter
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const symbol = String(
        item.symbol ?? "",
      ).toLowerCase();

      const name = String(
        item.name ?? "",
      ).toLowerCase();

      return (
        symbol.includes(normalizedQuery) ||
        name.includes(normalizedQuery)
      );
    });

    return result.slice(0, 80);
  }, [
    assets,
    filter,
    normalizedQuery,
  ]);

  const filters: Array<{
    value: FilterType;
    label: string;
    count: number;
  }> = [
    {
      value: "all",
      label: "All Markets",
      count,
    },
    {
      value: "stock",
      label: "U.S. Stocks",
      count: stockCount,
    },
    {
      value: "crypto",
      label: "Crypto",
      count: cryptoCount,
    },
  ];

  return (
    <div className="mt-8">
      <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search AAPL, NVDA, BTC, ADA..."
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-base text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const active =
                filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFilter(item.value)
                  }
                  className={`rounded-full border px-4 py-3 text-xs font-semibold transition ${
                    active
                      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-white/45 hover:text-white"
                  }`}
                >
                  {item.label}{" "}
                  <span className="ml-1 opacity-50">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-white/30">
          <span>
            {loading
              ? "Loading public market universe..."
              : `${count.toLocaleString()} searchable assets`}
          </span>

          {!loading && normalizedQuery ? (
            <span>
              {filteredAssets.length} shown
            </span>
          ) : null}
        </div>
      </div>

      {!loading &&
      filteredAssets.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssets.map((item) => {
            const symbol =
              String(item.symbol ?? "")
                .trim()
                .toUpperCase();

            const isCrypto =
              item.asset_type === "crypto";

            return (
              <Link
                key={`${item.asset_type}-${symbol}`}
                href={`/trading/assets/${encodeURIComponent(
                  symbol,
                )}`}
                className="group rounded-[26px] border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold tracking-[-0.04em]">
                      {symbol}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-white/35">
                      {item.name ||
                        symbol}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      isCrypto
                        ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
                        : "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                    }`}
                  >
                    {isCrypto
                      ? "Crypto"
                      : "Stock"}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[11px] text-white/30">
                    {item.exchange ||
                      item.market ||
                      "Public Market"}
                  </span>

                  <span className="text-xs font-semibold text-cyan-200/70 transition group-hover:text-cyan-200">
                    Research →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}

      {!loading &&
      filteredAssets.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-center">
          <p className="font-semibold">
            No matching assets
          </p>

          <p className="mt-2 text-sm text-white/35">
            Try another symbol or company name.
          </p>
        </div>
      ) : null}
    </div>
  );
}
