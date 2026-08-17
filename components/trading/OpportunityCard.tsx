"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AssetLogo from "@/components/trading/AssetLogo";
import {
  ArrowRightIcon,
  BrainIcon,
  ShieldIcon,
  TrendUpIcon,
} from "@/components/ui/NestrovaIcons";

export type Opportunity = {
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
  direction?: string;
  direction_label?: string;
  outlook?: string;
  outlook_label?: string;
  outlook_summary?: string;
  time_horizon?: string;
  positive_factors?: string[];
  watch_factors?: string[];
};

type OpportunityCardProps = {
  opportunity: Opportunity;
  rank: number;
};

type WatchlistItem = {
  id: string;
  symbol: string;
};

type WatchlistGetResponse = {
  success?: boolean;
  watchlist?: WatchlistItem[];
  error?: string;
};

type WatchlistMutationResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

function cleanLabel(value?: string | null) {
  if (!value) {
    return "Unavailable";
  }

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalize(value?: string | null) {
  return value?.trim().toUpperCase().replaceAll("-", "_") ?? "";
}

function getOutlookPresentation(
  opportunity: Opportunity,
) {
  const outlook = normalize(
    opportunity.outlook,
  );

  const direction = normalize(
    opportunity.direction,
  );

  if (
    outlook === "STRONG_BULLISH" ||
    outlook === "BULLISH" ||
    direction === "UP"
  ) {
    return {
      label:
        opportunity.outlook_label ||
        opportunity.direction_label ||
        "Bullish",
      classes:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
      description:
        opportunity.outlook_summary ||
        "Current research evidence leans positive.",
    };
  }

  if (
    outlook === "BEARISH" ||
    outlook === "STRONG_BEARISH" ||
    direction === "DOWN"
  ) {
    return {
      label:
        opportunity.outlook_label ||
        opportunity.direction_label ||
        "Bearish",
      classes:
        "border-red-400/25 bg-red-400/10 text-red-300",
      description:
        opportunity.outlook_summary ||
        "Current research evidence leans negative.",
    };
  }

  if (
    outlook === "NEUTRAL" ||
    outlook === "MIXED" ||
    direction === "NEUTRAL" ||
    direction === "MIXED"
  ) {
    return {
      label:
        opportunity.outlook_label ||
        opportunity.direction_label ||
        "Mixed",
      classes:
        "border-amber-400/25 bg-amber-400/10 text-amber-200",
      description:
        opportunity.outlook_summary ||
        "Current evidence is mixed and needs more confirmation.",
    };
  }

  return {
    label: "Researching",
    classes:
      "border-white/10 bg-white/[0.06] text-white/55",
    description:
      "A directional outlook is not available yet.",
  };
}

function getRiskClasses(risk?: string) {
  switch (normalize(risk)) {
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

function getRegimeReason(regime?: string) {
  const normalized = normalize(regime);

  if (
    normalized.includes("BULL") ||
    normalized.includes("UPTREND") ||
    normalized.includes("POSITIVE")
  ) {
    return "The broader trend is currently moving in a positive direction.";
  }

  if (
    normalized.includes("BEAR") ||
    normalized.includes("DOWNTREND") ||
    normalized.includes("NEGATIVE")
  ) {
    return "The broader trend remains weak, so risk control is important.";
  }

  if (
    normalized.includes("SIDEWAYS") ||
    normalized.includes("RANGE") ||
    normalized.includes("NEUTRAL")
  ) {
    return "The market is moving sideways and may need a clearer breakout.";
  }

  return "The current market structure is being monitored for confirmation.";
}

function getStyleReason(style?: string) {
  const normalized = normalize(style);

  if (normalized.includes("MOMENTUM")) {
    return "Price momentum is one of the strongest signals supporting this ranking.";
  }

  if (normalized.includes("BREAKOUT")) {
    return "The asset is approaching or moving through an important price level.";
  }

  if (
    normalized.includes("REVERSAL") ||
    normalized.includes("MEAN_REVERSION")
  ) {
    return "The model detected a potential recovery after recent weakness.";
  }

  if (normalized.includes("TREND")) {
    return "The current trend remains one of the main reasons for this opportunity.";
  }

  if (normalized.includes("VOLATILITY")) {
    return "Volatility is creating opportunity, but position sizing matters.";
  }

  return "Multiple public market signals contributed to the current AI assessment.";
}

function getBasisReason(scoreBasis?: string) {
  if (!scoreBasis) {
    return null;
  }

  return cleanLabel(scoreBasis);
}

function getAssetType(
  opportunity: Opportunity,
  symbol: string,
) {
  const explicitType =
    opportunity.asset_type?.trim().toLowerCase();

  if (explicitType === "crypto") {
    return "crypto";
  }

  if (explicitType === "stock") {
    return "stock";
  }

  const normalizedSymbol = symbol.toUpperCase();

  if (
    normalizedSymbol.includes("BTC") ||
    normalizedSymbol.includes("ETH") ||
    normalizedSymbol.includes("SOL") ||
    normalizedSymbol.includes("XRP") ||
    normalizedSymbol.includes("DOGE") ||
    normalizedSymbol.includes("ADA")
  ) {
    return "crypto";
  }

  return "stock";
}

export default function OpportunityCard({
  opportunity,
  rank,
}: OpportunityCardProps) {
  const symbol = useMemo(
    () => opportunity.symbol?.trim().toUpperCase() ?? "",
    [opportunity.symbol],
  );

  const score = opportunity.opportunity_score ?? 0;
  const recommendation =
    getOutlookPresentation(opportunity);
  const basisReason = getBasisReason(opportunity.score_basis);

  const publicReasons =
    opportunity.research_reasons
      ?.map((reason) => String(reason).trim())
      .filter(Boolean)
      .slice(0, 3) ?? [];

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isCheckingWatchlist, setIsCheckingWatchlist] = useState(true);
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<
    "success" | "error" | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWatchlistStatus() {
      if (!symbol) {
        if (isMounted) {
          setIsCheckingWatchlist(false);
        }

        return;
      }

      try {
        const response = await fetch("/api/trading/watchlist", {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const result = (await response.json()) as WatchlistGetResponse;

        if (!response.ok) {
          if (response.status !== 401) {
            throw new Error(
              result.error ?? "Unable to load the watchlist.",
            );
          }

          if (isMounted) {
            setIsInWatchlist(false);
          }

          return;
        }

        const exists =
          result.watchlist?.some(
            (item) => item.symbol?.trim().toUpperCase() === symbol,
          ) ?? false;

        if (isMounted) {
          setIsInWatchlist(exists);
        }
      } catch (error) {
        console.error("OpportunityCard watchlist status error:", error);

        if (isMounted) {
          setStatusType("error");
          setStatusMessage("Watchlist status could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setIsCheckingWatchlist(false);
        }
      }
    }

    void loadWatchlistStatus();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  async function handleWatchlistToggle() {
    if (!symbol || isUpdatingWatchlist) {
      return;
    }

    setIsUpdatingWatchlist(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await fetch(
        isInWatchlist
          ? `/api/trading/watchlist?symbol=${encodeURIComponent(symbol)}`
          : "/api/trading/watchlist",
        {
          method: isInWatchlist ? "DELETE" : "POST",
          headers: isInWatchlist
            ? {
                Accept: "application/json",
              }
            : {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
          body: isInWatchlist
            ? undefined
            : JSON.stringify({
                symbol,
                assetName:
                  opportunity.asset_name?.trim() || symbol,
                assetType: getAssetType(
                  opportunity,
                  symbol,
                ),
                opportunityScore: score,
                risk: opportunity.risk ?? null,
                regime: opportunity.regime ?? null,
                notes:
                  opportunity.research_reasons
                    ?.slice(0, 3)
                    .join(" | ") ??
                  opportunity.score_basis ?? null,
              }),
        },
      );

      const result =
        (await response.json()) as WatchlistMutationResponse;

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to use your watchlist.");
        }

        throw new Error(
          result.error ?? "Unable to update the watchlist.",
        );
      }

      const nextState = !isInWatchlist;

      setIsInWatchlist(nextState);
      window.dispatchEvent(
        new CustomEvent("nestrova:watchlist-updated"),
        );
      setStatusType("success");
      setStatusMessage(
        result.message ??
          (nextState
            ? `${symbol} was added to your watchlist.`
            : `${symbol} was removed from your watchlist.`),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update the watchlist.";

      setStatusType("error");
      setStatusMessage(message);
    } finally {
      setIsUpdatingWatchlist(false);
    }
  }

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.055] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]">
      <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-cyan-400/[0.08] blur-3xl transition group-hover:bg-cyan-400/[0.13]" />

      <div className="relative">
        <div className="grid min-w-0 gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              #{rank} Ranked Opportunity
            </p>

            <div className="mt-4 flex min-w-0 items-center gap-3">
              <AssetLogo
                symbol={symbol}
                assetType={opportunity.asset_type}
                size="md"
              />

              <div className="min-w-0">
                <Link
                  href={`/trading/assets/${encodeURIComponent(symbol)}`}
                  className="group/link flex min-w-0 items-center gap-2 transition hover:text-amber-200"
                >
                  <span className="truncate text-3xl font-black tracking-[-0.05em]">
                    {symbol || "Unknown Asset"}
                  </span>

                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-white/25 transition group-hover/link:translate-x-1 group-hover/link:text-amber-200" />
                </Link>

                <p className="mt-1 truncate text-xs text-white/35">
                  {opportunity.asset_name?.trim() ||
                    cleanLabel(opportunity.asset_type)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2 sm:flex-col sm:items-end">
            <div className="rounded-[18px] border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2 text-cyan-200/60">
                <BrainIcon className="h-4 w-4" />

                <p className="text-[9px] font-bold uppercase tracking-[0.14em]">
                  AI Score
                </p>
              </div>

              <p className="mt-1 text-3xl font-black text-cyan-200">
                {Math.round(score)}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${recommendation.classes}`}
            >
              {recommendation.label}
            </span>
          </div>
        </div>

        <div className="mt-7 rounded-[28px] border border-white/10 bg-black/25 p-5">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                AI Confidence
              </p>

              <p className="mt-2 text-sm text-white/42">
                {recommendation.description}
              </p>
            </div>

            <p className="text-4xl font-semibold tracking-[-0.055em]">
              {score}
              <span className="text-lg text-white/30">%</span>
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.5)]"
              style={{
                width: `${Math.max(0, Math.min(100, score))}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Why Nestrova ranked it
          </p>

          <div className="mt-4 space-y-3">
            {publicReasons.length > 0 ? (
              publicReasons.map((reason, index) => (
                <div
                  key={`${symbol}-reason-${index}`}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />

                  <p className="text-sm leading-6 text-white/58">
                    {reason}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />

                  <p className="text-sm leading-6 text-white/58">
                    {getRegimeReason(opportunity.regime)}
                  </p>
                </div>

                <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-300" />

                  <p className="text-sm leading-6 text-white/58">
                    {getStyleReason(opportunity.research_style)}
                  </p>
                </div>

                {basisReason ? (
                  <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />

                    <p className="text-sm leading-6 text-white/58">
                      Signal basis: {basisReason}.
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getRiskClasses(
                  opportunity.risk,
                )}`}
              >
                <ShieldIcon className="h-3.5 w-3.5" />
                {cleanLabel(opportunity.risk)} Risk
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/45">
                <TrendUpIcon className="h-3.5 w-3.5" />
                {cleanLabel(opportunity.regime)}
              </span>
            </div>

            <Link
              href="/trading/markets"
              className="shrink-0 text-sm font-semibold text-white/55 transition hover:text-white"
            >
              View analysis →
            </Link>
          </div>

          <button
            type="button"
            onClick={handleWatchlistToggle}
            disabled={
              !symbol || isCheckingWatchlist || isUpdatingWatchlist
            }
            className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isInWatchlist
                ? "border-amber-300/30 bg-amber-300/12 text-amber-100 hover:bg-amber-300/18"
                : "border-white/10 bg-white/[0.06] text-white/65 hover:border-amber-300/30 hover:bg-amber-300/10 hover:text-amber-100"
            }`}
          >
            <span aria-hidden="true">
              {isInWatchlist ? "★" : "☆"}
            </span>

            {isCheckingWatchlist
              ? "Checking Watchlist..."
              : isUpdatingWatchlist
                ? "Updating..."
                : isInWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
          </button>

          {statusMessage ? (
            <p
              role="status"
              className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                statusType === "success"
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "border-red-400/20 bg-red-400/10 text-red-200"
              }`}
            >
              {statusMessage}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}