"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AssetLogo from "@/components/trading/AssetLogo";
import {
  GlassPanel,
  MetricTile,
  SectionHeader,
  StatusChip,
} from "@/components/ui/nestrova";
import {
  BrainIcon,
  GaugeIcon,
  PortfolioIcon,
  RefreshIcon,
  ShieldIcon,
  TrendUpIcon,
} from "@/components/ui/NestrovaIcons";

type WatchlistItem = {
  id?: string;
  symbol: string;
  asset_name?: string | null;
  asset_type: string;
  opportunity_score?: number | null;
  risk?: string | null;
  regime?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

type WatchlistResponse = {
  success?: boolean;
  watchlist?: WatchlistItem[];
  error?: string;
};

type PublicAsset = {
  symbol?: string;
  asset_name?: string;
  asset_type?: string;
  opportunity_score?: number;
  confidence?: number;
  regime?: string;
  risk?: string;
  research_reasons?: string[];
  score_components?: Record<string, number>;
  source_available?: boolean;
  public_mode?: string;
  execution_exposed?: boolean;
};

type PortfolioAsset = {
  symbol: string;
  assetName: string;
  assetType: string;
  score: number;
  confidence: number;
  risk: string;
  regime: string;
  reason: string;
};

function cleanLabel(value?: string | null) {
  return String(value ?? "Unknown")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function riskWeight(risk: string) {
  switch (risk.trim().toUpperCase()) {
    case "CRITICAL":
      return 4;
    case "HIGH":
      return 3;
    case "MEDIUM":
      return 2;
    case "LOW":
      return 1;
    default:
      return 2;
  }
}

function riskClasses(risk: string) {
  switch (risk.trim().toUpperCase()) {
    case "LOW":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    case "HIGH":
    case "CRITICAL":
      return "border-red-400/20 bg-red-400/10 text-red-200";
    default:
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
  }
}

function scoreClasses(score: number) {
  if (score >= 80) {
    return "text-emerald-300";
  }

  if (score >= 65) {
    return "text-cyan-300";
  }

  if (score >= 50) {
    return "text-amber-200";
  }

  return "text-orange-300";
}

function getPortfolioRisk(assets: PortfolioAsset[]) {
  if (assets.length === 0) {
    return "UNKNOWN";
  }

  const average =
    assets.reduce(
      (sum, asset) => sum + riskWeight(asset.risk),
      0,
    ) / assets.length;

  if (average >= 3.5) {
    return "CRITICAL";
  }

  if (average >= 2.5) {
    return "HIGH";
  }

  if (average >= 1.5) {
    return "MEDIUM";
  }

  return "LOW";
}

async function loadPublicAsset(
  item: WatchlistItem,
): Promise<PortfolioAsset> {
  const symbol = item.symbol.trim().toUpperCase();

  try {
    const response = await fetch(
      `/api/trading/public-asset/${encodeURIComponent(
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

    if (!response.ok) {
      throw new Error(
        `Public asset API returned ${response.status}.`,
      );
    }

    const asset = (await response.json()) as PublicAsset;

    if (
      asset.public_mode !== "READ_ONLY" ||
      asset.execution_exposed !== false
    ) {
      throw new Error(
        "Public asset safety validation failed.",
      );
    }

    return {
      symbol,
      assetName:
        asset.asset_name?.trim() ||
        item.asset_name?.trim() ||
        symbol,
      assetType:
        asset.asset_type?.trim() ||
        item.asset_type ||
        "asset",
      score:
        asset.opportunity_score ??
        item.opportunity_score ??
        0,
      confidence: asset.confidence ?? 0,
      risk:
        asset.risk?.trim().toUpperCase() ||
        item.risk?.trim().toUpperCase() ||
        "UNKNOWN",
      regime:
        asset.regime?.trim().toUpperCase() ||
        item.regime?.trim().toUpperCase() ||
        "UNKNOWN",
      reason:
        asset.research_reasons?.find(
          (reason) => String(reason).trim(),
        ) ??
        item.notes ??
        "Public research explanation is not available.",
    };
  } catch {
    return {
      symbol,
      assetName:
        item.asset_name?.trim() || symbol,
      assetType: item.asset_type || "asset",
      score: item.opportunity_score ?? 0,
      confidence: 0,
      risk:
        item.risk?.trim().toUpperCase() ||
        "UNKNOWN",
      regime:
        item.regime?.trim().toUpperCase() ||
        "UNKNOWN",
      reason:
        item.notes ??
        "Using the latest saved watchlist research.",
    };
  }
}

export default function PortfolioAI() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = useCallback(
    async (manualRefresh = false) => {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetch(
          "/api/trading/watchlist",
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          },
        );

        const contentType =
          response.headers.get("content-type") ?? "";

        let data: WatchlistResponse;

        if (contentType.includes("application/json")) {
          data = (await response.json()) as WatchlistResponse;
        } else {
          const body = await response.text();

          console.error(
            "Watchlist API returned a non-JSON response:",
            response.status,
            contentType,
            body.slice(0, 300),
          );

          throw new Error(
            response.ok
              ? "Watchlist service returned an invalid response."
              : `Watchlist service is unavailable (${response.status}).`,
          );
        }

        if (!response.ok || data.success === false) {
          throw new Error(
            data.error ??
              "Unable to load your watchlist.",
          );
        }

        const watchlist = Array.isArray(data.watchlist)
          ? data.watchlist
          : [];

        const publicAssets = await Promise.all(
          watchlist.map(loadPublicAsset),
        );

        publicAssets.sort(
          (first, second) =>
            second.score - first.score,
        );

        setAssets(publicAssets);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Portfolio intelligence is unavailable.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadPortfolio();

    function handleWatchlistUpdated() {
      void loadPortfolio(true);
    }

    window.addEventListener(
      "nestrova:watchlist-updated",
      handleWatchlistUpdated,
    );

    return () => {
      window.removeEventListener(
        "nestrova:watchlist-updated",
        handleWatchlistUpdated,
      );
    };
  }, [loadPortfolio]);

  const summary = useMemo(() => {
    const averageScore =
      assets.length > 0
        ? Math.round(
            assets.reduce(
              (sum, asset) => sum + asset.score,
              0,
            ) / assets.length,
          )
        : 0;

    const averageConfidence =
      assets.length > 0
        ? Math.round(
            assets.reduce(
              (sum, asset) =>
                sum + asset.confidence,
              0,
            ) / assets.length,
          )
        : 0;

    return {
      averageScore,
      averageConfidence,
      topAsset: assets[0] ?? null,
      portfolioRisk: getPortfolioRisk(assets),
      cryptoCount: assets.filter(
        (asset) => asset.assetType === "crypto",
      ).length,
      stockCount: assets.filter(
        (asset) => asset.assetType === "stock",
      ).length,
    };
  }, [assets]);

  if (loading) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300" />

          <p className="text-sm text-white/45">
            Building your AI portfolio...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[32px] border border-red-400/20 bg-red-400/[0.06] p-8">
        <p className="font-semibold text-red-200">
          Portfolio intelligence could not be loaded.
        </p>

        <p className="mt-2 text-sm text-red-100/55">
          {error}
        </p>

        <button
          type="button"
          onClick={() => void loadPortfolio(true)}
          className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
        >
          Try again
        </button>
      </section>
    );
  }

  if (assets.length === 0) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/70">
          My AI Portfolio
        </p>

        <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em]">
          Build your first AI watchlist.
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
          Add stocks or crypto assets to receive current public AI
          scores, confidence, risk, and research explanations.
        </p>

        <Link
          href="/trading/markets"
          className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200"
        >
          Explore Markets
        </Link>
      </section>
    );
  }

  return (
    <GlassPanel
      tone="cyan"
      className="h-full"
      contentClassName="flex h-full min-w-0 flex-col p-6 md:p-8"
    >
      <SectionHeader
        eyebrow="My AI Portfolio"
        title="Your current intelligence snapshot."
        description="Live public research for the assets saved in your Nestrova watchlist."
        tone="cyan"
        icon={<PortfolioIcon className="h-4 w-4" />}
        action={
          <button
            type="button"
            disabled={refreshing}
            onClick={() => void loadPortfolio(true)}
            className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshIcon
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing
              ? "Refreshing..."
              : "Refresh Portfolio"}
          </button>
        }
      />

      <div className="mt-7 grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricTile
          compact
          label="Watchlist Assets"
          value={assets.length}
          detail={`${summary.stockCount} stocks · ${summary.cryptoCount} crypto`}
          icon={<PortfolioIcon className="h-4 w-4" />}
          tone="violet"
        />

        <MetricTile
          compact
          label="Average AI Score"
          value={summary.averageScore}
          detail="Across saved watchlist assets"
          icon={<BrainIcon className="h-4 w-4" />}
          tone={
            summary.averageScore >= 75
              ? "emerald"
              : summary.averageScore >= 55
                ? "cyan"
                : "amber"
          }
        />

        <MetricTile
          compact
          label="Average Confidence"
          value={`${summary.averageConfidence}%`}
          detail="Current public research conviction"
          icon={<GaugeIcon className="h-4 w-4" />}
          tone="cyan"
        />

        <MetricTile
          compact
          label="Portfolio Risk"
          value={
            <StatusChip
              tone={
                summary.portfolioRisk === "LOW"
                  ? "emerald"
                  : summary.portfolioRisk === "MEDIUM"
                    ? "amber"
                    : "red"
              }
              icon={<ShieldIcon className="h-3.5 w-3.5" />}
              className="text-[11px]"
            >
              {cleanLabel(summary.portfolioRisk)}
            </StatusChip>
          }
          detail="Combined risk across watchlist assets"
          icon={<ShieldIcon className="h-4 w-4" />}
          tone={
            summary.portfolioRisk === "LOW"
              ? "emerald"
              : summary.portfolioRisk === "MEDIUM"
                ? "amber"
                : "red"
          }
        />
      </div>

      {summary.topAsset ? (
        <div className="mt-6 min-w-0 rounded-[28px] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(34,211,238,0.10),rgba(139,92,246,0.055),rgba(0,0,0,0.18))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] md:p-7">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_170px] lg:items-stretch">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100/55">
                Highest Opportunity
              </p>

              <div className="mt-4 flex min-w-0 items-center gap-4">
                <AssetLogo
                  symbol={summary.topAsset.symbol}
                  assetType={summary.topAsset.assetType}
                  size="lg"
                />

                <div className="min-w-0">
                  <p className="truncate text-3xl font-black">
                    {summary.topAsset.symbol}
                  </p>

                  <p className="mt-1 truncate text-sm text-white/40">
                    {summary.topAsset.assetName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${riskClasses(
                        summary.topAsset.risk,
                      )}`}
                    >
                      <ShieldIcon className="h-3.5 w-3.5" />
                      {cleanLabel(summary.topAsset.risk)} Risk
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase text-white/40">
                      <TrendUpIcon className="h-3.5 w-3.5" />
                      {cleanLabel(summary.topAsset.regime)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-2xl break-words text-sm leading-6 text-white/45 [overflow-wrap:anywhere]">
                {summary.topAsset.reason}
              </p>
            </div>

            <div className="flex min-h-[170px] shrink-0 flex-col justify-between rounded-[22px] border border-cyan-300/20 bg-black/25 p-5 lg:text-right">
              <div className="flex items-center gap-2 text-cyan-200/55 sm:justify-end">
                <BrainIcon className="h-4 w-4" />

                <p className="text-[9px] font-bold uppercase tracking-[0.15em]">
                  AI Score
                </p>
              </div>

              <p
                className={`mt-2 text-5xl font-black ${scoreClasses(
                  summary.topAsset.score,
                )}`}
              >
                {summary.topAsset.score}
              </p>

              <Link
                href={`/trading/assets/${encodeURIComponent(
                  summary.topAsset.symbol,
                )}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white lg:justify-end"
              >
                View analysis →
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-1 flex-col">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Today&apos;s Focus
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              Your leading watchlist assets.
            </h3>
          </div>

          <Link
            href="/trading/watchlist"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            Manage Watchlist →
          </Link>
        </div>

        <div className="mt-5 grid flex-1 gap-4">
          {assets.slice(0, 3).map((asset) => (
            <Link
              key={`${asset.assetType}-${asset.symbol}`}
              href={`/trading/assets/${encodeURIComponent(
                asset.symbol,
              )}`}
              className="group min-w-0 rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.045] sm:p-6"
            >
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <AssetLogo
                  symbol={asset.symbol}
                  assetType={asset.assetType}
                  size="md"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-2xl font-black tracking-[-0.025em] text-white">
                    {asset.symbol}
                  </p>

                  <p className="mt-1 truncate text-sm text-white/35">
                    {asset.assetName}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200/45">
                    AI Score
                  </p>

                  <p
                    className={`mt-1 text-[2rem] font-black leading-none tracking-[-0.04em] ${scoreClasses(
                      asset.score,
                    )}`}
                  >
                    {asset.score}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase ${riskClasses(
                    asset.risk,
                  )}`}
                >
                  {cleanLabel(asset.risk)} Risk
                </span>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase text-white/35">
                  {cleanLabel(asset.regime)}
                </span>
              </div>

              <p className="mt-5 max-w-3xl break-words text-sm leading-6 text-white/40 [overflow-wrap:anywhere]">
                {asset.reason}
              </p>

              <div className="mt-5 flex justify-end border-t border-white/[0.06] pt-4">
                <span className="text-xs font-semibold text-cyan-200/55 transition group-hover:text-cyan-100">
                  View analysis →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-7 text-xs leading-5 text-white/25">
        Portfolio Intelligence uses your Nestrova watchlist and public
        read-only research. It does not access brokerage balances,
        positions, orders, or execution data.
      </p>
    </GlassPanel>
  );
}

