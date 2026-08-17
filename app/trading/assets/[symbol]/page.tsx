"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AlertModal from "@/components/trading/AlertModal";
import UpgradeGate from "@/components/subscriptions/UpgradeGate";
import useSubscription from "@/hooks/useSubscription";
import TradingViewChart from "@/components/trading/TradingViewChart";
import AssetAITimeline from "@/components/trading/AssetAITimeline";
import AIDecisionBreakdown from "@/components/trading/AIDecisionBreakdown";

type PublicOpportunity = {
  symbol?: string;
  asset_name?: string;
  asset_type?: string;
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

  source_available?: boolean;
  generated_at?: string;
  public_mode?: string;
  execution_exposed?: boolean;
  disclaimer?: string;

  access?: {
    tier?: "free" | "pro";
    unlimited?: boolean;
    usage?: {
      used: number;
      limit: number;
      remaining: number;
      usageMonth: string;
    } | null;
    charged?: boolean;
    deduped?: boolean;
  };
};

type TradingResearchAccess = {
  tier: "free" | "pro";
  unlimited: boolean;
  usage: {
    used: number;
    limit: number;
    remaining: number;
    usageMonth: string;
  } | null;
  charged: boolean;
  deduped: boolean;
};

type TradingResearchErrorResponse = {
  success?: false;
  code?: string;
  error?: string;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
    usageMonth: string;
  };
};



type WatchlistItem = {
  id: string;
  symbol: string;
  asset_name: string | null;
  asset_type: string;
  opportunity_score: number | null;
  risk: string | null;
  regime: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type WatchlistResponse = {
  success: boolean;
  watchlist?: WatchlistItem[];
  error?: string;
};


type AssetData = {
  name: string;
  assetType: string;
  score: number;
  confidence: number;
  risk: string;
  regime: string;

  direction?: string;
  directionLabel?: string;
  outlook?: string;
  outlookLabel?: string;
  outlookSummary?: string;
  timeHorizon?: string;
  positiveFactors?: string[];
  watchFactors?: string[];

  summary: string[];
  technicals: {
    label: string;
    value: string;
    interpretation: string;
  }[];
  signals: {
    label: string;
    time: string;
  }[];
};

function cleanSymbol(value: string) {
  return decodeURIComponent(value).trim().toUpperCase();
}

function normalizeAssetType(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "crypto") {
    return "crypto";
  }

  if (normalizedValue === "etf") {
    return "etf";
  }

  return "stock";
}

function getUnratedAsset(
  symbol: string,
): AssetData {
  return {
    name: symbol,
    assetType: "Stock",
    score: 0,
    confidence: 0,
    risk: "UNRATED",
    regime: "Not analyzed",

    direction: "UNRATED",
    directionLabel: "Not analyzed",

    outlook: "UNRATED",
    outlookLabel: "Not analyzed",

    outlookSummary:
      "Nestrova has not generated current public research for this asset yet.",

    timeHorizon: "",

    positiveFactors: [],
    watchFactors: [],

    summary: [
      "This asset is searchable, but current Nestrova public research is not available yet.",
    ],

    technicals: [],
    signals: [],
  };
}


function buildAssetFromPublicOpportunity(
  fallback: AssetData,
  opportunity: PublicOpportunity,
): AssetData {
  const reasons =
    opportunity.research_reasons
      ?.map((reason) => String(reason).trim())
      .filter(Boolean) ?? [];

  const components =
    opportunity.score_components ?? {};

  const componentTechnicals = Object.entries(
    components,
  ).map(([key, value]) => ({
    label: key
      .replaceAll("_", " ")
      .replace(/\w/g, (letter) =>
        letter.toUpperCase(),
      ),
    value:
      value > 0
        ? `+${value}`
        : String(value),
    interpretation:
      `${key.replaceAll("_", " ")} contribution to the public AI score.`,
  }));

  const publicAssetType =
    opportunity.asset_type === "crypto"
      ? "Crypto"
      : opportunity.asset_type === "stock"
        ? "Stock"
        : fallback.assetType;

  return {
    ...fallback,
    name:
      opportunity.asset_name?.trim() ||
      fallback.name,
    assetType: publicAssetType,
    score:
      opportunity.opportunity_score ??
      fallback.score,
    confidence:
      opportunity.confidence ??
      fallback.confidence,
    risk:
      opportunity.risk ??
      fallback.risk,
    regime:
      opportunity.regime ??
      fallback.regime,

    direction:
      opportunity.direction?.trim() ||
      fallback.direction ||
      "NEUTRAL",

    directionLabel:
      opportunity.direction_label?.trim() ||
      fallback.directionLabel ||
      "Mixed",

    outlook:
      opportunity.outlook?.trim() ||
      fallback.outlook ||
      "NEUTRAL",

    outlookLabel:
      opportunity.outlook_label?.trim() ||
      fallback.outlookLabel ||
      "Neutral",

    outlookSummary:
      opportunity.outlook_summary?.trim() ||
      fallback.outlookSummary ||
      "",

    timeHorizon:
      opportunity.time_horizon?.trim() ||
      fallback.timeHorizon ||
      "1-4 weeks",

    positiveFactors:
      opportunity.positive_factors?.length
        ? opportunity.positive_factors
        : reasons.slice(0, 4),

    watchFactors:
      opportunity.watch_factors?.length
        ? opportunity.watch_factors
        : [],

    summary:
      reasons.length > 0
        ? reasons
        : fallback.summary,

    technicals:
      componentTechnicals.length > 0
        ? componentTechnicals
        : fallback.technicals,
    signals: [
      {
        label:
          opportunity.outlook_label?.trim() ||
          opportunity.direction_label?.trim() ||
          "Mixed",
        time: "Current public research",
      },
      {
        label:
          opportunity.direction?.trim() === "UP"
            ? "Positive Setup"
            : opportunity.direction?.trim() === "DOWN"
              ? "Negative Setup"
              : "Mixed Setup",
        time:
          opportunity.time_horizon?.trim() ||
          "Current horizon",
      },
    ],
  };
}


function getRiskClasses(risk: string) {
  const normalizedRisk = risk.toUpperCase();

  if (normalizedRisk === "LOW") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (normalizedRisk === "HIGH") {
    return "border-red-400/25 bg-red-400/10 text-red-200";
  }

  return "border-amber-300/25 bg-amber-300/10 text-amber-100";
}

function getSignalClasses(signal: string) {
  const normalizedSignal = signal.toUpperCase();

  if (normalizedSignal === "BUY") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (normalizedSignal === "SELL") {
    return "border-red-400/25 bg-red-400/10 text-red-200";
  }

  return "border-white/10 bg-white/[0.04] text-white/70";
}

export default function AssetDetailPage() {
  const params = useParams<{ symbol: string }>();

 const {
  isLoaded,
  isSignedIn,
  isLoading: isSubscriptionLoading,
  hasTradingAccess,
} = useSubscription();

  const symbol = useMemo(() => {
    const rawSymbol = params?.symbol ?? "";
    return cleanSymbol(rawSymbol);
  }, [params]);

  const fallbackAsset = useMemo(
    () => getUnratedAsset(symbol),
    [symbol],
  );

  const [asset, setAsset] =
    useState<AssetData>(fallbackAsset);

  const [isPublicResearchLoading, setIsPublicResearchLoading] =
    useState(true);

  const [publicResearchError, setPublicResearchError] =
    useState<string | null>(null);

  const [
    researchAccess,
    setResearchAccess,
  ] = useState<TradingResearchAccess | null>(
    null,
  );

  const [
    researchLimitReached,
    setResearchLimitReached,
  ] = useState(false);

  const [
    researchLimitUsage,
    setResearchLimitUsage,
  ] = useState<
    TradingResearchErrorResponse["usage"] | null
  >(null);

  const [
    isResearchUpgradeGateOpen,
    setIsResearchUpgradeGateOpen,
  ] = useState(false);

  useEffect(() => {
    let active = true;

    setAsset(fallbackAsset);
    setIsPublicResearchLoading(true);
    setPublicResearchError(null);
    setResearchAccess(null);
    setResearchLimitReached(false);
    setResearchLimitUsage(null);

    async function loadPublicResearch() {
      try {
        const response = await fetch(
          `/api/trading/research/${encodeURIComponent(
            symbol,
          )}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          },
        );

        const responseData =
          (await response.json()) as
            | PublicOpportunity
            | TradingResearchErrorResponse;

        if (
          response.status === 403 &&
          "code" in responseData &&
          responseData.code ===
            "TRADING_RESEARCH_LIMIT_REACHED"
        ) {
          if (active) {
            setResearchLimitReached(true);
            setResearchLimitUsage(
              responseData.usage ?? null,
            );
            setResearchAccess(null);
            setPublicResearchError(null);
          }

          return;
        }

        if (response.status === 401) {
          throw new Error(
            "Sign in to access Trading Research.",
          );
        }

        if (response.status === 404) {
          throw new Error(
            "Public research is not currently available for this asset.",
          );
        }

        if (!response.ok) {
          throw new Error(
            "Trading Research is temporarily unavailable.",
          );
        }

        const opportunity =
          responseData as PublicOpportunity;

        if (
          opportunity.public_mode !== "READ_ONLY" ||
          opportunity.execution_exposed !== false
        ) {
          throw new Error(
            "Public API safety validation failed.",
          );
        }

        if (
          opportunity.source_available !== true
        ) {
          throw new Error(
            "Public research source is unavailable.",
          );
        }

        if (!active) {
          return;
        }

        setAsset(
          buildAssetFromPublicOpportunity(
            fallbackAsset,
            opportunity,
          ),
        );

        if (opportunity.access) {
          setResearchAccess({
            tier:
              opportunity.access.tier === "pro"
                ? "pro"
                : "free",

            unlimited:
              opportunity.access.unlimited === true,

            usage:
              opportunity.access.usage ?? null,

            charged:
              opportunity.access.charged === true,

            deduped:
              opportunity.access.deduped === true,
          });
        } else {
          setResearchAccess(null);
        }

        setResearchLimitReached(false);
        setResearchLimitUsage(null);
        setPublicResearchError(null);
      } catch (error) {
        if (!active) {
          return;
        }

        setPublicResearchError(
          error instanceof Error
            ? error.message
            : "Public research could not be loaded.",
        );
      } finally {
        if (active) {
          setIsPublicResearchLoading(false);
        }
      }
    }

    void loadPublicResearch();

    return () => {
      active = false;
    };
  }, [
    fallbackAsset,
    symbol,
  ]);

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isCheckingWatchlist, setIsCheckingWatchlist] = useState(true);
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isUpgradeGateOpen, setIsUpgradeGateOpen] =
  useState(false);
  const [
  isWatchlistUpgradeGateOpen,
  setIsWatchlistUpgradeGateOpen,
] = useState(false);
  
  const [statusType, setStatusType] = useState<
    "success" | "error" | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    async function checkWatchlist() {
      if (!symbol) {
        if (isMounted) {
          setIsCheckingWatchlist(false);
        }
        return;
      }

      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        if (isMounted) {
          setIsInWatchlist(false);
          setIsCheckingWatchlist(false);
          setStatusType(null);
          setStatusMessage(null);
        }
        return;
      }

      setIsCheckingWatchlist(true);

      try {
        const response = await fetch("/api/trading/watchlist", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as WatchlistResponse;

        if (response.status === 401) {
          if (isMounted) {
            setIsInWatchlist(false);
          }
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ??
              "Unable to load the watchlist.",
          );
        }

        const matchingAsset = data.watchlist?.some(
          (item) =>
            item.symbol.trim().toUpperCase() === symbol &&
            item.asset_type.trim().toLowerCase() ===
              normalizeAssetType(asset.assetType),
        );

        if (isMounted) {
          setIsInWatchlist(Boolean(matchingAsset));
        }
      } catch (error) {
        console.error("Watchlist check error:", error);

        if (isMounted) {
          setStatusType("error");
          setStatusMessage("Unable to check the watchlist.");
        }
      } finally {
        if (isMounted) {
          setIsCheckingWatchlist(false);
        }
      }
    }

    void checkWatchlist();

    return () => {
      isMounted = false;
    };
  }, [
    asset.assetType,
    symbol,
    isLoaded,
    isSignedIn,
  ]);

    function handleAddAlertClick() {
    if (!isLoaded || isSubscriptionLoading) {
      return;
    }

    if (!isSignedIn) {
      window.location.href =
        "/login?next=" +
        encodeURIComponent(
          `/trading/assets/${symbol}`,
        );
      return;
    }

    if (hasTradingAccess) {
      setIsAlertModalOpen(true);
      return;
    }

    setIsUpgradeGateOpen(true);
  }

  async function addToWatchlist() {
    if (!symbol || isUpdatingWatchlist) {
      return;
    }

    setIsUpdatingWatchlist(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await fetch("/api/trading/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          asset_name: asset.name,
          asset_type: normalizeAssetType(asset.assetType),
          opportunity_score: asset.score,
          risk: asset.risk,
          regime: asset.regime,
          notes: `Added from the ${symbol} asset detail page.`,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        code?: string;
        error?: string;
      };

      if (
  response.status === 403 &&
  data.code === "WATCHLIST_LIMIT_REACHED"
) {
  setIsWatchlistUpgradeGateOpen(true);
  return;
}

if (!response.ok || !data.success) {
  throw new Error(
    data.error ?? "Unable to add the asset.",
  );
}

      setIsInWatchlist(true);
      setStatusType("success");
      setStatusMessage(`${symbol} was added to your watchlist.`);

      window.dispatchEvent(
        new CustomEvent("nestrova:watchlist-updated"),
      );
    } catch (error) {
      console.error("Watchlist POST error:", error);

      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to add the asset to your watchlist.",
      );
    } finally {
      setIsUpdatingWatchlist(false);
    }
  }

  async function removeFromWatchlist() {
    if (!symbol || isUpdatingWatchlist) {
      return;
    }

    setIsUpdatingWatchlist(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const query = new URLSearchParams({
        symbol,
        asset_type: normalizeAssetType(asset.assetType),
      });

      const response = await fetch(
        `/api/trading/watchlist?${query.toString()}`,
        {
          method: "DELETE",
        },
      );

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to remove the asset.");
      }

      setIsInWatchlist(false);
      setStatusType("success");
      setStatusMessage(`${symbol} was removed from your watchlist.`);

      window.dispatchEvent(
        new CustomEvent("nestrova:watchlist-updated"),
      );
    } catch (error) {
      console.error("Watchlist DELETE error:", error);

      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove the asset from your watchlist.",
      );
    } finally {
      setIsUpdatingWatchlist(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-[1480px] px-5 py-8 md:px-8 md:py-12">
        <Link
          href="/trading"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Back to Trading
        </Link>

        <div className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035]">
          <div className="border-b border-white/10 px-6 py-7 md:px-8 md:py-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-100">
                    {asset.assetType}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${getRiskClasses(
                      asset.risk,
                    )}`}
                  >
                    {asset.risk} Risk
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] md:text-6xl">
                  {symbol}
                </h1>

                <p className="mt-2 text-lg text-white/45">
                  {asset.name}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      publicResearchError
                        ? "bg-amber-300"
                        : "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]"
                    }`}
                  />

                  <p className="text-xs text-white/35">
                    {isPublicResearchLoading
                      ? "Loading current public research..."
                      : researchLimitReached
                        ? "Monthly research limit reached"
                        : publicResearchError
                          ? "Research is currently unavailable"
                          : "Connected to current Nestrova research"}
                  </p>
                </div>

                {publicResearchError ? (
                  <p className="mt-3 max-w-2xl text-xs leading-5 text-amber-100/55">
                    {publicResearchError}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <div className="flex flex-wrap gap-3">
                  <button
  type="button"
  disabled={!isLoaded || isSubscriptionLoading}
  onClick={handleAddAlertClick}
  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] px-5 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
>
  {!isLoaded || isSubscriptionLoading
    ? "Checking Access..."
    : "Add Alert"}
</button>

                  <button
                    type="button"
                    disabled={
                      isCheckingWatchlist || isUpdatingWatchlist
                    }
                    onClick={
                      isInWatchlist
                        ? removeFromWatchlist
                        : addToWatchlist
                    }
                    className={`inline-flex h-11 min-w-[174px] items-center justify-center rounded-xl border px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isInWatchlist
                        ? "border-red-400/25 bg-red-400/10 text-red-200 hover:border-red-400/40 hover:bg-red-400/15"
                        : "border-amber-300/25 bg-amber-300/10 text-amber-100 hover:border-amber-300/40 hover:bg-amber-300/15"
                    }`}
                  >
                    {isCheckingWatchlist
                      ? "Checking..."
                      : isUpdatingWatchlist
                        ? "Updating..."
                        : isInWatchlist
                          ? "Remove from Watchlist"
                          : "Add to Watchlist"}
                  </button>
                </div>

                {statusMessage ? (
                  <p
                    className={`text-sm ${
                      statusType === "success"
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {statusMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            <div className="bg-[#090909] p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                AI Score
              </p>

              <p className="mt-4 text-5xl font-black tracking-[-0.05em]">
                {asset.risk === "UNRATED"
                  ? "Pending"
                  : asset.score}
              </p>

              <p className="mt-2 text-sm text-white/40">
                {asset.risk === "UNRATED"
                  ? "Not analyzed yet"
                  : "Out of 100"}
              </p>
            </div>

            <div className="bg-[#090909] p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                Confidence
              </p>

              <p className="mt-4 text-5xl font-black tracking-[-0.05em]">
                {asset.risk === "UNRATED"
                  ? "Pending"
                  : `${asset.confidence}%`}
              </p>

              <p className="mt-2 text-sm text-white/40">
                {asset.risk === "UNRATED"
                  ? "Research pending"
                  : "AI signal confidence"}
              </p>
            </div>

            <div className="bg-[#090909] p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                Current Regime
              </p>

              <p className="mt-4 text-3xl font-black tracking-[-0.04em]">
                {asset.regime}
              </p>

              <p className="mt-2 text-sm text-white/40">
                Current market environment
              </p>
            </div>
          </div>
        </div>

        {researchLimitReached ? (
          <section className="mt-8 overflow-hidden rounded-[28px] border border-amber-300/20 bg-amber-300/[0.055] p-7 md:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/60">
                  Free Trading Research
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">
                  Monthly research limit reached
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  You have used all free Trading Research analyses available for this month.
                </p>

                {researchLimitUsage ? (
                  <p className="mt-3 text-sm font-semibold text-amber-100/70">
                    {researchLimitUsage.used} / {researchLimitUsage.limit} analyses used
                    {" · "}
                    {researchLimitUsage.remaining} remaining
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsResearchUpgradeGateOpen(true)
                }
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-black text-black transition hover:bg-white/90"
              >
                Upgrade to Trading Pro
              </button>
            </div>
          </section>
        ) : researchAccess ? (
          <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  {researchAccess.unlimited
                    ? "Trading Pro"
                    : "Free Trading Research"}
                </p>

                <p className="mt-3 text-xl font-black tracking-[-0.035em]">
                  {researchAccess.unlimited
                    ? "Unlimited Trading Research"
                    : researchAccess.usage
                      ? `${researchAccess.usage.remaining} / ${researchAccess.usage.limit} analyses remaining this month`
                      : "Trading Research"}
                </p>

                {!researchAccess.unlimited &&
                researchAccess.usage ? (
                  <div className="mt-4 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white/65 transition-all"
                      style={{
                        width: `${
                          researchAccess.usage.limit > 0
                            ? Math.max(
                                0,
                                Math.min(
                                  100,
                                  (
                                    researchAccess.usage.remaining /
                                    researchAccess.usage.limit
                                  ) * 100,
                                ),
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                ) : null}

                <p className="mt-3 text-sm text-white/40">
                  {researchAccess.unlimited
                    ? "No monthly Trading Research limit."
                    : researchAccess.deduped
                      ? "Recently analyzed - No additional research usage charged."
                      : researchAccess.charged
                        ? "This research counted toward your monthly usage."
                        : "Current monthly Trading Research usage."}
                </p>
              </div>

              {!researchAccess.unlimited ? (
                <button
                  type="button"
                  onClick={() =>
                    setIsResearchUpgradeGateOpen(true)
                  }
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] px-5 text-sm font-bold transition hover:border-white/20 hover:bg-white/[0.09]"
                >
                  Get Unlimited Research
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {asset.risk === "UNRATED" ? (
          <section className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))]">
            <div className="p-7 md:p-10 lg:p-12">
              <div className="max-w-3xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Nestrova Research
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-white md:text-5xl">
                  Not analyzed yet
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/48">
                  {symbol} is available in the Nestrova market universe,
                  but current AI research has not been generated for this
                  asset yet.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      AI Score
                    </p>

                    <p className="mt-3 text-xl font-black text-white/65">
                      ?
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      Confidence
                    </p>

                    <p className="mt-3 text-xl font-black text-white/65">
                      ?
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      Research Status
                    </p>

                    <p className="mt-3 text-xl font-black text-white/65">
                      Pending
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-[22px] border border-cyan-300/10 bg-cyan-300/[0.035] p-5">
                  <p className="text-sm leading-7 text-white/45">
                    Nestrova only displays a directional outlook when
                    sufficient public research evidence is available.
                    No score, direction, or confidence estimate is shown
                    before that analysis exists.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
        <section className="mt-8 overflow-hidden rounded-[32px] border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.075),rgba(255,255,255,0.025))]">
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 max-w-3xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/65">
                  Nestrova AI Outlook
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <h2 className="text-4xl font-black tracking-[-0.055em] text-white md:text-6xl">
                    {asset.directionLabel || "Mixed"}
                  </h2>

                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100">
                    {asset.outlookLabel || "Neutral"}
                  </span>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/52">
                  {asset.outlookSummary ||
                    `Nestrova currently sees a mixed setup for ${symbol}.`}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                    Research horizon
                  </span>

                  <span className="text-sm font-bold text-white/75">
                    {asset.timeHorizon || "1-4 weeks"}
                  </span>
                </div>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-[440px]">
                <div className="rounded-[22px] border border-cyan-300/15 bg-black/25 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                    AI Confidence
                  </p>

                  <p className="mt-3 text-3xl font-black text-cyan-100">
                    {asset.confidence}%
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/25 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                    Risk
                  </p>

                  <p className="mt-3 text-xl font-black text-white/80">
                    {asset.risk}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/25 p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
                    AI Score
                  </p>

                  <p className="mt-3 text-xl font-black text-white/80">
                    {asset.score}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[26px] border border-emerald-300/10 bg-black/20 p-5 md:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/65">
                  Why Nestrova leans {asset.direction === "UP" ? "up" : asset.direction === "DOWN" ? "down" : "this way"}
                </p>

                <div className="mt-5 space-y-3">
                  {(asset.positiveFactors?.length
                    ? asset.positiveFactors
                    : asset.summary.slice(0, 4)
                  ).map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4"
                    >
                      <span className="mt-0.5 text-emerald-200">
                        +
                      </span>

                      <p className="text-sm leading-6 text-white/58">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-amber-300/10 bg-black/20 p-5 md:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/65">
                  What could change the outlook
                </p>

                <div className="mt-5 space-y-3">
                  {(asset.watchFactors?.length
                    ? asset.watchFactors
                    : [
                        `Current risk is ${asset.risk}.`,
                        `The current market regime is ${asset.regime}.`,
                      ]
                  ).map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4"
                    >
                      <span className="mt-0.5 text-amber-200">
                        !
                      </span>

                      <p className="text-sm leading-6 text-white/58">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-white/25">
            This outlook is automated market research, not a prediction,
            personalized investment recommendation, or instruction to buy or
            sell.
          </p>
        </section>

          </>
        )}

        {asset.risk !== "UNRATED" ? (
          <AIDecisionBreakdown
            score={asset.score}
            confidence={asset.confidence}
            risk={asset.risk}
            regime={asset.regime}
            components={asset.technicals}
          />
        ) : null}

        {asset.risk !== "UNRATED" ? (
          <AssetAITimeline
            symbol={symbol}
          />
        ) : null}

        {normalizeAssetType(asset.assetType) !== "crypto" ? (
          <TradingViewChart
            symbol={symbol}
            assetType={normalizeAssetType(
              asset.assetType,
            )}
          />
        ) : null}

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
            Technical Snapshot
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {asset.technicals.map((technical) => (
              <div
                key={technical.label}
                className="rounded-2xl border border-white/8 bg-black/20 p-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
                  {technical.label}
                </p>

                <p className="mt-3 text-xl font-bold">
                  {technical.value}
                </p>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {technical.interpretation}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-6 text-xs leading-5 text-white/25">
          Nestrova provides market intelligence and research only. It
          does not execute trades or provide personalized financial
          advice.
        </p>
      </section>

      <UpgradeGate
        isOpen={isResearchUpgradeGateOpen}
        product="trading"
        featureName="Unlimited Trading Research"
        description="Upgrade to Trading Pro or Nestrova AI Pro for unlimited Trading Research without the free monthly analysis limit."
        onClose={() =>
          setIsResearchUpgradeGateOpen(false)
        }
      />

      <UpgradeGate
  isOpen={isUpgradeGateOpen}
  product="trading"
  featureName="Custom Trading Alerts"
  description="Create personalized alerts based on AI score, risk level, and market regime."
  onClose={() => setIsUpgradeGateOpen(false)}
/>

<UpgradeGate
  isOpen={isWatchlistUpgradeGateOpen}
  product="trading"
  featureName="Unlimited Trading Watchlists"
  description="Free accounts can save up to 5 assets. Upgrade to Trading Pro or Nestrova AI Pro to create unlimited watchlists."
  onClose={() =>
    setIsWatchlistUpgradeGateOpen(false)
  }
/>

      <AlertModal
  isOpen={isAlertModalOpen}
  symbol={symbol}
  assetType={asset.assetType}
  currentScore={asset.score}
  currentRisk={asset.risk}
  onClose={() => setIsAlertModalOpen(false)}
  onSaved={() => {
    setStatusType("success");
    setStatusMessage("Alert created successfully.");
  }}
/>
    </main>
  );
}
