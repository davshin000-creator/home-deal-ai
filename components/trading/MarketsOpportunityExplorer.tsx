"use client";

import { useMemo, useState } from "react";

export type MarketOpportunity = {
  symbol?: string;
  asset_name?: string;
  asset_type?: "crypto" | "stock" | string;
  opportunity_score?: number;
  confidence?: number;
  regime?: string;
  risk?: string;
  research_style?: string;
  score_basis?: string;
  research_version?: string;
  research_reasons?: string[];
  score_components?: Record<string, number>;
};

type FilterType = "all" | "crypto" | "stock";

type MarketsOpportunityExplorerProps = {
  opportunities: MarketOpportunity[];
};

function cleanLabel(value?: string | null) {
  const normalized = String(value ?? "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "Unavailable";
  }

  return normalized
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function riskClasses(risk?: string) {
  switch (risk?.toUpperCase()) {
    case "LOW":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "MEDIUM":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    case "HIGH":
      return "border-orange-400/20 bg-orange-400/10 text-orange-200";
    case "CRITICAL":
      return "border-red-400/20 bg-red-400/10 text-red-200";
    default:
      return "border-white/10 bg-white/[0.06] text-white/50";
  }
}

function opportunityClasses(score?: number) {
  const value = score ?? 0;

  if (value >= 80) {
    return "text-emerald-300";
  }

  if (value >= 65) {
    return "text-cyan-300";
  }

  if (value >= 50) {
    return "text-amber-200";
  }

  return "text-white/45";
}

function assetBadgeClasses(assetType?: string) {
  if (assetType === "crypto") {
    return "border-violet-400/20 bg-violet-400/10 text-violet-200";
  }

  if (assetType === "stock") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  }

  return "border-white/10 bg-white/[0.06] text-white/50";
}

function assetTypeLabel(assetType?: string) {
  if (assetType === "crypto") {
    return "Crypto";
  }

  if (assetType === "stock") {
    return "U.S. Stock";
  }

  return "Asset";
}

function normalizeReasons(opportunity: MarketOpportunity) {
  const publicReasons = opportunity.research_reasons
    ?.map((reason) => String(reason).trim())
    .filter(Boolean);

  if (publicReasons && publicReasons.length > 0) {
    return publicReasons.slice(0, 4);
  }

  const fallback: string[] = [];

  if (opportunity.regime) {
    fallback.push(
      `Market regime: ${cleanLabel(opportunity.regime)}.`,
    );
  }

  if (opportunity.research_style) {
    fallback.push(
      `Research style: ${cleanLabel(opportunity.research_style)}.`,
    );
  }

  if (opportunity.score_basis) {
    fallback.push(
      `Score basis: ${cleanLabel(opportunity.score_basis)}.`,
    );
  }

  return fallback;
}

export default function MarketsOpportunityExplorer({
  opportunities,
}: MarketsOpportunityExplorerProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const sortedOpportunities = useMemo(
    () =>
      [...opportunities].sort(
        (first, second) =>
          (second.opportunity_score ?? 0) -
          (first.opportunity_score ?? 0),
      ),
    [opportunities],
  );

  const filteredOpportunities = useMemo(() => {
    if (filter === "all") {
      return sortedOpportunities;
    }

    return sortedOpportunities.filter(
      (opportunity) => opportunity.asset_type === filter,
    );
  }, [filter, sortedOpportunities]);

  const cryptoCount = opportunities.filter(
    (item) => item.asset_type === "crypto",
  ).length;

  const stockCount = opportunities.filter(
    (item) => item.asset_type === "stock",
  ).length;

  const filters: Array<{
    value: FilterType;
    label: string;
    count: number;
  }> = [
    {
      value: "all",
      label: "All",
      count: opportunities.length,
    },
    {
      value: "crypto",
      label: "Crypto",
      count: cryptoCount,
    },
    {
      value: "stock",
      label: "U.S. Stocks",
      count: stockCount,
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                active
                  ? "border-cyan-300/30 bg-cyan-300/12 text-cyan-100"
                  : "border-white/10 bg-white/[0.05] text-white/45 hover:border-white/20 hover:text-white"
              }`}
            >
              {item.label}

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active
                    ? "bg-cyan-200/15 text-cyan-100"
                    : "bg-white/[0.07] text-white/35"
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredOpportunities.length > 0 ? (
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {filteredOpportunities.map((item, index) => {
            const reasons = normalizeReasons(item);
            const score = item.opportunity_score ?? 0;
            const confidence = item.confidence ?? 0;

            return (
              <article
                key={`${item.asset_type}-${item.symbol}-${index}`}
                className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                          #{index + 1}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${assetBadgeClasses(
                            item.asset_type,
                          )}`}
                        >
                          {assetTypeLabel(item.asset_type)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
                        {item.symbol ?? "Unknown"}
                      </h3>

                      <p className="mt-1 text-sm text-white/40">
                        {item.asset_name ?? item.symbol ?? "Unknown asset"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30">
                        AI Score
                      </p>

                      <p
                        className={`mt-2 text-4xl font-semibold tracking-[-0.055em] ${opportunityClasses(
                          score,
                        )}`}
                      >
                        {score}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                        Confidence
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {confidence}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                        Regime
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white/65">
                        {cleanLabel(item.regime)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                        Risk
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${riskClasses(
                          item.risk,
                        )}`}
                      >
                        {cleanLabel(item.risk)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                      Why this ranks
                    </p>

                    <div className="mt-3 space-y-3">
                      {reasons.length > 0 ? (
                        reasons.map((reason, reasonIndex) => (
                          <div
                            key={`${item.symbol}-reason-${reasonIndex}`}
                            className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                          >
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />

                            <p className="text-sm leading-6 text-white/58">
                              {reason}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/40">
                          Public research explanation is not available yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                    <p className="text-xs text-white/30">
                      {item.research_version
                        ? `Engine: ${item.research_version}`
                        : "Public research engine"}
                    </p>

                    <p className="text-xs text-white/40">
                      {cleanLabel(item.research_style)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-7 rounded-[30px] border border-white/10 bg-white/[0.05] p-8 text-sm text-white/42">
          No opportunities are available for this market.
        </div>
      )}
    </div>
  );
}
