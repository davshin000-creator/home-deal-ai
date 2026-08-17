"use client";

import Link from "next/link";
import AssetLogo from "@/components/trading/AssetLogo";
import {
  ArrowRightIcon,
  RefreshIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";
import {
  GlassPanel,
  SectionHeader,
  StatusChip,
} from "@/components/ui/nestrova";
import { useCallback, useEffect, useState } from "react";

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
  success?: boolean;
  watchlist?: WatchlistItem[];
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

function normalizeRisk(value?: string | null) {
  return value?.trim().toUpperCase().replaceAll("-", "_") ?? "";
}


function formatScore(score?: number | null) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "—";
  }

  return Math.round(score).toString();
}

export default function WatchlistPanel() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWatchlist = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const response = await fetch("/api/trading/watchlist", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType =
        response.headers.get("content-type") ?? "";

      let result: WatchlistResponse;

      if (contentType.includes("application/json")) {
        result = (await response.json()) as WatchlistResponse;
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

      if (response.status === 401) {
        setIsAuthenticated(false);
        setWatchlist([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to load your watchlist.",
        );
      }

      setIsAuthenticated(true);

      const sortedWatchlist = [...(result.watchlist ?? [])].sort(
        (first, second) =>
          (second.opportunity_score ?? 0) -
          (first.opportunity_score ?? 0),
      );

      setWatchlist(sortedWatchlist);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your watchlist.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadWatchlist();
  }, [loadWatchlist]);

  useEffect(() => {
    function handleFocus() {
      void loadWatchlist(true);
    }

    function handleWatchlistUpdated() {
      void loadWatchlist(true);
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener(
      "nestrova:watchlist-updated",
      handleWatchlistUpdated,
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(
        "nestrova:watchlist-updated",
        handleWatchlistUpdated,
      );
    };
  }, [loadWatchlist]);

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.055] p-6 md:p-7">
      <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-64 w-64 rounded-full bg-amber-300/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
              ★ Personal Intelligence
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
              My Watchlist
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/42">
              Track the market opportunities you want Nestrova to monitor
              more closely.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadWatchlist(true)}
            disabled={isLoading || isRefreshing}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 flex-1 space-y-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-[82px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : !isAuthenticated ? (
          <div className="mt-6 flex flex-1 flex-col justify-center rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="font-semibold text-white/75">
              Sign in to create your personal watchlist.
            </p>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Saved assets are private and connected only to your Nestrova
              account.
            </p>

            <Link
              href="/login"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Sign in
            </Link>
          </div>
        ) : errorMessage ? (
          <div className="mt-6 flex flex-1 flex-col justify-center rounded-[24px] border border-red-400/20 bg-red-400/10 p-5">
            <p className="font-semibold text-red-100">
              Watchlist unavailable
            </p>

            <p className="mt-2 text-sm leading-6 text-red-100/65">
              {errorMessage}
            </p>
          </div>
        ) : watchlist.length > 0 ? (
          <div className="mt-6 flex-1 space-y-3">
            {watchlist.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="group flex min-w-0 flex-col gap-4 rounded-[22px] border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <AssetLogo
                    symbol={item.symbol}
                    assetType={item.asset_type}
                    size="md"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold tracking-[-0.03em]">
                      {item.symbol}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/35">
                      <span>{cleanLabel(item.asset_type)}</span>
                      <span>•</span>
                      <span>{cleanLabel(item.regime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:justify-end">
                  <StatusChip
                    tone={
                      String(item.risk ?? "").toUpperCase() === "LOW"
                        ? "emerald"
                        : String(item.risk ?? "").toUpperCase() === "MEDIUM"
                          ? "amber"
                          : "red"
                    }
                    icon={<ShieldIcon className="h-3.5 w-3.5" />}
                  >
                    {cleanLabel(item.risk)} Risk
                  </StatusChip>

                  <div className="min-w-[58px] shrink-0 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                      Score
                    </p>

                    <p className="mt-1 text-2xl font-black tracking-[-0.04em]">
                      {formatScore(item.opportunity_score)}
                    </p>
                  </div>
                  <button
  type="button"
  onClick={async () => {
    const response = await fetch(
      `/api/trading/watchlist?symbol=${encodeURIComponent(item.symbol)}`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      setWatchlist((current) =>
        current.filter((asset) => asset.symbol !== item.symbol),
      );

      window.dispatchEvent(
        new CustomEvent("nestrova:watchlist-updated"),
      );
    }
  }}
  className="inline-flex h-10 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 px-4 text-xs font-bold text-red-200 transition hover:border-red-400/40 hover:bg-red-400/20"
>
  Remove
</button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-xs text-white/30">
                {watchlist.length} saved{" "}
                {watchlist.length === 1 ? "asset" : "assets"}
              </p>

              <Link
                href="/trading/markets"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
              >
                Explore more markets
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-1 flex-col justify-center rounded-[24px] border border-dashed border-white/15 bg-black/20 p-6">
            <p className="font-semibold text-white/70">
              Your watchlist is empty.
            </p>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Add an asset from the Top Opportunities section to begin
              building your personal market intelligence feed.
            </p>

            <a
              href="#top-opportunities"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15"
            >
              Find opportunities
            </a>
          </div>
        )}
      </div>
    </section>
  );
}