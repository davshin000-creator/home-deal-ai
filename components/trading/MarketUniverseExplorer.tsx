"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useResearchUniverse } from "@/components/research/useResearchUniverse";

type FilterType = "all" | "crypto" | "stock";

type MarketUniverseExplorerProps = {
  compact?: boolean;
};

export default function MarketUniverseExplorer({
  compact = false,
}: MarketUniverseExplorerProps) {
  const { assets, loading, count } =
    useResearchUniverse();

  const [query, setQuery] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("stock");

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

    if (normalizedQuery) {
      result.sort((first, second) => {
        const firstSymbol = String(
          first.symbol ?? "",
        ).toLowerCase();

        const secondSymbol = String(
          second.symbol ?? "",
        ).toLowerCase();

        const firstName = String(
          first.name ?? "",
        ).toLowerCase();

        const secondName = String(
          second.name ?? "",
        ).toLowerCase();

        const firstExact =
          firstSymbol === normalizedQuery
            ? 0
            : 1;

        const secondExact =
          secondSymbol === normalizedQuery
            ? 0
            : 1;

        if (firstExact !== secondExact) {
          return firstExact - secondExact;
        }

        const firstStarts =
          firstSymbol.startsWith(
            normalizedQuery,
          )
            ? 0
            : 1;

        const secondStarts =
          secondSymbol.startsWith(
            normalizedQuery,
          )
            ? 0
            : 1;

        if (firstStarts !== secondStarts) {
          return firstStarts - secondStarts;
        }

        const firstNameStarts =
          firstName.startsWith(
            normalizedQuery,
          )
            ? 0
            : 1;

        const secondNameStarts =
          secondName.startsWith(
            normalizedQuery,
          )
            ? 0
            : 1;

        if (
          firstNameStarts !==
          secondNameStarts
        ) {
          return (
            firstNameStarts -
            secondNameStarts
          );
        }

        return firstSymbol.localeCompare(
          secondSymbol,
        );
      });
    }

    if (compact) {
      if (!normalizedQuery) {
        return [];
      }

      return result.slice(0, 8);
    }

    return result.slice(
      0,
      normalizedQuery ? 40 : 24,
    );
  }, [
    assets,
    filter,
    normalizedQuery,
    compact,
  ]);

  const filters: Array<{
    value: FilterType;
    label: string;
    count: number;
  }> = [
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
    {
      value: "all",
      label: "All Markets",
      count,
    },
  ];

  if (compact) {
    return (
      <section className="py-8">
        <div className="overflow-hidden rounded-[30px] border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.065),rgba(255,255,255,0.025))]">
          <div className="p-5 md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/60">
                  Search Any Market
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] md:text-3xl">
                  Pick a stock. Get a fresh AI outlook.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                  Search supported U.S. stocks and crypto by
                  ticker or name. Nestrova generates current
                  direction, confidence, risk and supporting
                  evidence when you open an asset.
                </p>
              </div>

              <div className="shrink-0 text-left lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                  Searchable universe
                </p>

                <p className="mt-1 text-xl font-black text-cyan-100">
                  {count.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-5 w-5 text-white/30"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M16 16L20 20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search NVDA, AAPL, Microsoft, BTC..."
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-[20px] border border-white/10 bg-black/30 py-5 pl-12 pr-20 text-base font-semibold text-white outline-none transition placeholder:font-normal placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-black/40"
              />

              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-4 my-auto h-8 rounded-full border border-white/10 bg-white/[0.05] px-3 text-[10px] font-bold text-white/35 transition hover:text-white"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/30">
              <span>
                {loading
                  ? "Loading market universe..."
                  : `${count.toLocaleString()} supported assets`}
              </span>

              <Link
                href="/trading/markets"
                className="font-semibold text-cyan-200/55 transition hover:text-cyan-100"
              >
                Browse all markets →
              </Link>
            </div>

            {!loading &&
            normalizedQuery &&
            filteredAssets.length > 0 ? (
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                {filteredAssets.map((item) => {
                  const symbol = String(
                    item.symbol ?? "",
                  )
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
                      className="group flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 transition hover:border-cyan-300/25 hover:bg-white/[0.055]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black">
                            {symbol}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] ${
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

                        <p className="mt-1 truncate text-xs text-white/35">
                          {item.name || symbol}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-bold text-cyan-200/55 transition group-hover:translate-x-0.5 group-hover:text-cyan-100">
                        Analyze →
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {!loading &&
            normalizedQuery &&
            filteredAssets.length === 0 ? (
              <div className="mt-5 rounded-[18px] border border-white/10 bg-black/20 p-5 text-center">
                <p className="font-semibold">
                  No matching asset found.
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Try another ticker or company name.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-8">
      <section className="overflow-hidden rounded-[34px] border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.07),rgba(255,255,255,0.025))]">
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/65">
                Nestrova Market Search
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-4xl">
                Pick a stock. Nestrova analyzes it.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/42">
                Search the U.S. market universe and
                open any supported stock to generate
                a fresh AI outlook using trend,
                momentum, RSI, volume, and volatility.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  U.S. Stocks
                </p>

                <p className="mt-2 text-2xl font-black text-cyan-100">
                  {stockCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Crypto
                </p>

                <p className="mt-2 text-2xl font-black text-violet-100">
                  {cryptoCount.toLocaleString()}
                </p>
              </div>

              <div className="hidden rounded-[20px] border border-white/10 bg-black/20 px-5 py-4 sm:block">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  AI Research
                </p>

                <p className="mt-2 text-sm font-black text-emerald-100">
                  On demand
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                <span className="text-lg text-white/30">
                  ⌕
                </span>
              </div>

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value,
                  )
                }
                placeholder="Search AAPL, NVDA, Microsoft, Tesla..."
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-[20px] border border-white/10 bg-black/30 py-5 pl-12 pr-5 text-base font-semibold text-white outline-none transition placeholder:font-normal placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-black/40"
              />

              {query ? (
                <button
                  type="button"
                  onClick={() =>
                    setQuery("")
                  }
                  className="absolute inset-y-0 right-4 my-auto h-8 rounded-full border border-white/10 bg-white/[0.05] px-3 text-[10px] font-bold text-white/35 transition hover:text-white"
                >
                  Clear
                </button>
              ) : null}
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
                      setFilter(
                        item.value,
                      )
                    }
                    className={`rounded-full border px-4 py-3 text-xs font-semibold transition ${
                      active
                        ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                        : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {item.label}

                    <span className="ml-1.5 opacity-45">
                      {item.count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {loading
                ? "Loading Nestrova market universe..."
                : normalizedQuery
                  ? `Searching ${count.toLocaleString()} supported assets`
                  : `${count.toLocaleString()} searchable assets`}
            </span>

            {!loading &&
            normalizedQuery ? (
              <span>
                {filteredAssets.length}{" "}
                matching results shown
              </span>
            ) : (
              <span className="text-cyan-100/35">
                Fresh AI analysis when opened
              </span>
            )}
          </div>
        </div>
      </section>

      {!loading &&
      filteredAssets.length > 0 ? (
        <>
          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/28">
                {normalizedQuery
                  ? "Search Results"
                  : "Browse Market"}
              </p>

              <h3 className="mt-2 text-xl font-black tracking-[-0.035em]">
                {normalizedQuery
                  ? `Results for "${query.trim()}"`
                  : filter === "stock"
                    ? "U.S. stocks"
                    : filter ===
                        "crypto"
                      ? "Crypto assets"
                      : "Supported assets"}
              </h3>
            </div>

            <p className="hidden max-w-sm text-right text-xs leading-5 text-white/25 md:block">
              Open an asset to see Nestrova&apos;s
              directional outlook, confidence,
              risk and supporting evidence.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAssets.map(
              (item, index) => {
                const symbol =
                  String(
                    item.symbol ?? "",
                  )
                    .trim()
                    .toUpperCase();

                const isCrypto =
                  item.asset_type ===
                  "crypto";

                const isExact =
                  normalizedQuery &&
                  symbol.toLowerCase() ===
                    normalizedQuery;

                return (
                  <Link
                    key={`${item.asset_type}-${symbol}`}
                    href={`/trading/assets/${encodeURIComponent(
                      symbol,
                    )}`}
                    className={`group relative overflow-hidden rounded-[26px] border p-5 transition duration-300 hover:-translate-y-1 ${
                      isExact
                        ? "border-cyan-300/30 bg-cyan-300/[0.07]"
                        : "border-white/10 bg-white/[0.045] hover:border-cyan-300/25 hover:bg-white/[0.07]"
                    }`}
                  >
                    {isExact ? (
                      <div className="absolute right-0 top-0 rounded-bl-2xl border-b border-l border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">
                        Best match
                      </div>
                    ) : null}

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 pr-3">
                        <p className="truncate text-2xl font-black tracking-[-0.045em]">
                          {symbol}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-white/35">
                          {item.name ||
                            symbol}
                        </p>
                      </div>

                      {!isExact ? (
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                            isCrypto
                              ? "border-violet-400/20 bg-violet-400/10 text-violet-200"
                              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                          }`}
                        >
                          {isCrypto
                            ? "Crypto"
                            : "Stock"}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 rounded-[18px] border border-white/8 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-100/65">
                          AI analysis available
                        </p>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        Fresh market outlook generated
                        when this asset is opened.
                      </p>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
                          Market
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-white/40">
                          {item.exchange ||
                            item.market ||
                            (isCrypto
                              ? "Crypto"
                              : "U.S. Market")}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-cyan-200/60 transition group-hover:translate-x-0.5 group-hover:text-cyan-100">
                        Analyze with Nestrova →
                      </span>
                    </div>

                    {!normalizedQuery ? (
                      <span className="absolute bottom-3 right-4 text-[8px] font-bold text-white/10">
                        #{index + 1}
                      </span>
                    ) : null}
                  </Link>
                );
              },
            )}
          </div>
        </>
      ) : null}

      {!loading &&
      filteredAssets.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-10 text-center">
          <p className="text-lg font-bold">
            No matching assets
          </p>

          <p className="mt-2 text-sm text-white/35">
            Try another ticker or company name.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("stock");
            }}
            className="mt-5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-5 py-2.5 text-xs font-bold text-cyan-100"
          >
            Browse U.S. stocks
          </button>
        </div>
      ) : null}
    </div>
  );
}


