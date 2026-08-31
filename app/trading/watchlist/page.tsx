import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";

import {
  addWatchlistItem,
  deleteWatchlistItem,
  updateWatchlistSettings,
} from "./actions";

export const dynamic = "force-dynamic";

import {
  loadTradingPublicState,
} from "@/lib/trading/public-gateway";

type WatchlistItem = {
  id: string;
  symbol: string;
  asset_type: string;
  display_name: string | null;
  alert_enabled: boolean;
  opportunity_threshold: number;
  risk_threshold: string | null;
  created_at: string;
  updated_at: string;
  last_confidence: number | null;
  last_direction: string | null;
  last_outlook: string | null;
  last_risk: string | null;
  last_research_checked_at: string | null;
};

type TradingChangeAlert = {
  id: string;
  symbol: string;
  alert_type: string;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type Opportunity = {
  symbol?: string;
  opportunity_score?: number;
  regime?: string;
  risk?: string;
  research_style?: string;
};

type TradingState = {
  generated_at?: string;
  opportunities?: {
    top_opportunities?: Opportunity[];
  };
  market?: {
    regime?: string;
    confidence?: number;
    risk?: string;
  };
  system?: {
    public_mode?: string;
    execution_exposed?: boolean;
  };
};

type SearchParams = Promise<{
  success?: string;
  error?: string;
}>;

async function getTradingState(): Promise<TradingState | null> {
  try {
    const gatewayResult =
      await loadTradingPublicState<TradingState>();

    if (
      gatewayResult.error ||
      !gatewayResult.data
    ) {
      return null;
    }

    const data =
      gatewayResult.data;

    if (
      data.system?.public_mode !== "READ_ONLY" ||
      data.system?.execution_exposed !== false
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function cleanLabel(value?: string | null) {
  const normalized = String(value ?? "")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "AI Research Strategy";
  }

  const replacementCharacterCount =
    (normalized.match(/�/g) ?? []).length;

  const questionMarkCount =
    (normalized.match(/\?/g) ?? []).length;

  const looksCorrupted =
    replacementCharacterCount > 0 ||
    questionMarkCount >= 3 ||
    normalized.includes("ì") ||
    normalized.includes("ë") ||
    normalized.includes("í");

  if (looksCorrupted) {
    return "AI Research Strategy";
  }

  return normalized
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeSymbol(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/^KRW-/, "")
    .replace(/^USDT-/, "")
    .replace(/^USD-/, "");
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Update unavailable";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(parsed);
}

function riskClasses(value?: string | null) {
  switch (value?.toUpperCase()) {
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

function opportunityClasses(score?: number | null) {
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

function messageForSuccess(value?: string) {
  switch (value) {
    case "added":
      return "Asset added to your Watchlist.";
    case "deleted":
      return "Asset removed from your Watchlist.";
    case "updated":
      return "Watchlist settings updated.";
    default:
      return null;
  }
}

function messageForError(value?: string) {
  switch (value) {
    case "invalid-symbol":
      return "Enter a valid asset symbol.";
    case "already-added":
      return "That asset is already in your Watchlist.";
    case "unable-to-add":
      return "The asset could not be added.";
    case "unable-to-delete":
      return "The asset could not be removed.";
    case "unable-to-update":
      return "The settings could not be updated.";
    case "invalid-item":
      return "The selected Watchlist item is invalid.";
    default:
      return null;
  }
}

export default async function TradingWatchlistPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login?next=/trading/watchlist");
  }

  const [
    { data, error },
    tradingState,
    { data: recentAlertData },
  ] = await Promise.all([
    supabase
      .from("trading_watchlist")
      .select(
        `
          id,
          symbol,
          asset_type,
          display_name,
          alert_enabled,
          opportunity_threshold,
          risk_threshold,
          created_at,
          updated_at,
          last_confidence,
          last_direction,
          last_outlook,
          last_risk,
          last_research_checked_at
        `,
      )
      .eq("user_id", authData.user.id)
      .order("created_at", {
        ascending: false,
      }),
    getTradingState(),
    supabase
      .from("trading_alerts")
      .select(
        `
          id,
          symbol,
          alert_type,
          title,
          message,
          metadata,
          created_at
        `,
      )
      .eq(
        "user_id",
        authData.user.id,
      )
      .in(
        "alert_type",
        [
          "CONFIDENCE_CHANGE",
          "DIRECTION_CHANGE",
          "OUTLOOK_CHANGE",
          "RISK_CHANGE",
        ],
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(100),
  ]);

  const watchlist = (data ?? []) as WatchlistItem[];

  const recentAlerts =
    (recentAlertData ??
      []) as TradingChangeAlert[];

  const recentChangesBySymbol =
    new Map<
      string,
      TradingChangeAlert[]
    >();

  for (const alert of recentAlerts) {
    const symbol =
      normalizeSymbol(
        alert.symbol,
      );

    const current =
      recentChangesBySymbol.get(
        symbol,
      ) ?? [];

    if (current.length >= 4) {
      continue;
    }

    current.push(alert);

    recentChangesBySymbol.set(
      symbol,
      current,
    );
  }

  const opportunities =
    tradingState?.opportunities?.top_opportunities ?? [];

  const opportunityMap = new Map(
    opportunities.map((item) => [
      normalizeSymbol(item.symbol),
      item,
    ]),
  );

  const matchedCount = watchlist.filter((item) =>
    opportunityMap.has(normalizeSymbol(item.symbol)),
  ).length;

  const triggeredCount = watchlist.filter((item) => {
    const intelligence = opportunityMap.get(
      normalizeSymbol(item.symbol),
    );

    return (
      item.alert_enabled &&
      intelligence?.opportunity_score !== undefined &&
      intelligence.opportunity_score >=
        item.opportunity_threshold
    );
  }).length;

  const successMessage = messageForSuccess(params.success);

  const errorMessage =
    messageForError(params.error) ??
    (error ? "Your Watchlist could not be loaded." : null);

  return (
    <UserAwareNestrovaShell
      title="Radar"
      subtitle="Track saved markets and monitor changing conditions."
    >


      <section className="relative mx-auto max-w-[1480px] px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-cyan-300/70">
              Personal Intelligence
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Track the markets that matter to you.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              Save crypto, stocks, ETFs, and indexes, then compare your
              preferences against current public Opportunity, Regime, and Risk
              intelligence.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/45">
            <p className="font-semibold text-white/70">
              Intelligence update
            </p>
            <p className="mt-1">
              {formatDate(tradingState?.generated_at)}
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="mt-8 rounded-[26px] border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-8 rounded-[26px] border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-5 px-5 py-8 sm:grid-cols-2 md:px-8 xl:grid-cols-4">
        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Saved Assets
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {watchlist.length}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Markets saved privately to your account.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Intelligence Matches
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {matchedCount}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Saved assets with current public research coverage.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Alert Conditions
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {triggeredCount}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Saved assets currently meeting your AI Score threshold.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Global Market
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {cleanLabel(tradingState?.market?.regime)}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Current public market context for unmatched assets.
          </p>
        </article>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-[420px_1fr]">
        <article className="h-fit rounded-[38px] border border-white/10 bg-white/[0.055] p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Add Asset
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
            New Watchlist item
          </h2>

          <form
            action={addWatchlistItem}
            className="mt-7 grid gap-5"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/65">
                Symbol
              </span>

              <input
                name="symbol"
                required
                maxLength={20}
                placeholder="BTC, ETH, NVDA..."
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/65">
                Asset type
              </span>

              <select
                name="asset_type"
                defaultValue="crypto"
                className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none focus:border-cyan-400/40"
              >
                <option value="crypto">Crypto</option>
                <option value="stock">Stock</option>
                <option value="etf">ETF</option>
                <option value="index">Index</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/65">
                Display name
              </span>

              <input
                name="display_name"
                maxLength={80}
                placeholder="Bitcoin"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/40"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/65">
                AI Score threshold
              </span>

              <input
                name="opportunity_threshold"
                type="number"
                min={0}
                max={100}
                defaultValue={80}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Add to Watchlist
            </button>
          </form>
        </article>

        <div>
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                Your Watchlist
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
                {watchlist.length} saved asset
                {watchlist.length === 1 ? "" : "s"}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-5">
            {watchlist.length > 0 ? (
              watchlist.map((item) => {
                const intelligence = opportunityMap.get(
                  normalizeSymbol(item.symbol),
                );

                const opportunityScore =
                  intelligence?.opportunity_score;

                const recentChanges =
                  recentChangesBySymbol.get(
                    normalizeSymbol(
                      item.symbol,
                    ),
                  ) ?? [];

                const opportunityTriggered =
                  item.alert_enabled &&
                  opportunityScore !== undefined &&
                  opportunityScore >=
                    item.opportunity_threshold;

                const riskTriggered =
                  item.alert_enabled &&
                  item.risk_threshold &&
                  intelligence?.risk === item.risk_threshold;

                return (
                  <article
                    key={item.id}
                    className={`rounded-[36px] border bg-white/[0.05] p-6 ${
                      opportunityTriggered || riskTriggered
                        ? "border-cyan-400/30 shadow-[0_0_70px_rgba(34,211,238,0.08)]"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-3xl font-semibold tracking-[-0.05em]">
                            {item.symbol}
                          </h3>

                          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-white/50">
                            {item.asset_type}
                          </span>

                          {item.alert_enabled ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                              Alerts On
                            </span>
                          ) : null}

                          {opportunityTriggered ||
                          riskTriggered ? (
                            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                              Condition Met
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-3 text-sm text-white/42">
                          {item.display_name ||
                            `${item.symbol} Intelligence`}
                        </p>
                      </div>

                      <form action={deleteWatchlistItem}>
                        <input
                          type="hidden"
                          name="id"
                          value={item.id}
                        />

                        <button
                          type="submit"
                          className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/15"
                        >
                          Remove
                        </button>
                      </form>
                    </div>

                    <div className="mt-7 rounded-[28px] border border-white/10 bg-black/20 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/28">
                            Nestrova Research View
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold text-cyan-100">
                              {item.last_direction === "UP"
                                ? "Likely Up"
                                : item.last_direction === "DOWN"
                                  ? "Leaning Down"
                                  : item.last_direction
                                    ? item.last_direction
                                    : "Research Pending"}
                            </span>

                            <span className="text-lg font-black text-white/75">
                              {item.last_outlook
                                ? cleanLabel(
                                    item.last_outlook,
                                  )
                                : "Analysis Pending"}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/trading/assets/${encodeURIComponent(
                            normalizeSymbol(
                              item.symbol,
                            ),
                          )}`}
                          className="inline-flex items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-5 py-2.5 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/[0.13]"
                        >
                          Open AI Research ?
                        </Link>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                            Confidence
                          </p>

                          <p className="mt-2 text-2xl font-black text-cyan-100">
                            {item.last_confidence !== null
                              ? `${item.last_confidence}%`
                              : "Pending"}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                            Risk
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${riskClasses(
                              item.last_risk ??
                                intelligence?.risk ??
                                tradingState?.market?.risk,
                            )}`}
                          >
                            {cleanLabel(
                              item.last_risk ??
                                intelligence?.risk ??
                                tradingState?.market?.risk,
                            )}
                          </span>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                            AI Score
                          </p>

                          <p
                            className={`mt-2 text-2xl font-black ${opportunityClasses(
                              opportunityScore,
                            )}`}
                          >
                            {opportunityScore ?? "Pending"}

                            {opportunityScore !== undefined ? (
                              <span className="ml-1 text-xs font-semibold text-white/25">
                                /100
                              </span>
                            ) : null}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                            Last Research
                          </p>

                          <p className="mt-2 text-xs font-semibold leading-5 text-white/55">
                            {item.last_research_checked_at
                              ? formatDate(
                                  item.last_research_checked_at,
                                )
                              : "Waiting for first check"}
                          </p>
                        </div>
                      </div>

                      {item.last_direction ? (
                        <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-white/40">
                          Nestrova's latest public research for{" "}
                          <span className="font-semibold text-white/65">
                            {item.symbol}
                          </span>{" "}
                          currently leans{" "}
                          <span className="font-semibold text-white/65">
                            {item.last_direction === "UP"
                              ? "up"
                              : item.last_direction === "DOWN"
                                ? "down"
                                : "mixed"}
                          </span>

                          {item.last_confidence !== null
                            ? ` with ${item.last_confidence}% research confidence.`
                            : "."}
                        </p>
                      ) : null}
                    </div>

                    {!item.last_research_checked_at ? (
                      <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-4 text-xs leading-6 text-cyan-100/55">
                        Monitoring baseline pending. Nestrova will establish the first AI research snapshot when the alert engine checks this asset.
                      </div>
                    ) : null}

                    <div className="mt-5 rounded-[26px] border border-white/10 bg-white/[0.025] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/28">
                            Recent Changes
                          </p>

                          <p className="mt-1 text-xs text-white/35">
                            Meaningful AI research changes detected by Nestrova.
                          </p>
                        </div>

                        {recentChanges.length > 0 ? (
                          <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1 text-[10px] font-bold text-cyan-100/65">
                            {recentChanges.length} recent
                          </span>
                        ) : null}
                      </div>

                      {recentChanges.length > 0 ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {recentChanges.map(
                            (change) => (
                              <div
                                key={change.id}
                                className="rounded-[18px] border border-white/10 bg-black/20 p-4"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100/60">
                                    {change.alert_type ===
                                    "CONFIDENCE_CHANGE"
                                      ? "Confidence"
                                      : change.alert_type ===
                                          "DIRECTION_CHANGE"
                                        ? "Direction"
                                        : change.alert_type ===
                                            "OUTLOOK_CHANGE"
                                          ? "Outlook"
                                          : change.alert_type ===
                                              "RISK_CHANGE"
                                            ? "Risk"
                                            : cleanLabel(
                                                change.alert_type,
                                              )}
                                  </p>

                                  <span className="text-[9px] text-white/22">
                                    {formatDate(
                                      change.created_at,
                                    )}
                                  </span>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-white/55">
                                  {change.message}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-[18px] border border-white/8 bg-black/20 p-4">
                          <p className="text-xs leading-5 text-white/35">
                            No meaningful research changes detected yet.
                          </p>
                        </div>
                      )}
                    </div>

                    <form
                      action={updateWatchlistSettings}
                      className="mt-7 rounded-[28px] border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/28">
                            Monitoring Settings
                          </p>

                          <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
                            Nestrova monitors meaningful changes in AI confidence,
                            direction, outlook, and risk for this asset.
                          </p>
                        </div>

                        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/60">
                          <input
                            type="checkbox"
                            name="alert_enabled"
                            defaultChecked={
                              item.alert_enabled
                            }
                            className="h-4 w-4"
                          />

                          Monitoring enabled
                        </label>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                            Confidence
                          </p>

                          <p className="mt-2 text-xs leading-5 text-white/45">
                            Alerts when research confidence changes meaningfully.
                          </p>
                        </div>

                        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                            Direction
                          </p>

                          <p className="mt-2 text-xs leading-5 text-white/45">
                            Alerts when the research direction changes.
                          </p>
                        </div>

                        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                            Outlook
                          </p>

                          <p className="mt-2 text-xs leading-5 text-white/45">
                            Alerts when the AI outlook materially changes.
                          </p>
                        </div>

                        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                            Risk
                          </p>

                          <p className="mt-2 text-xs leading-5 text-white/45">
                            Alerts when the modeled risk level changes.
                          </p>
                        </div>
                      </div>

                      <details className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.025]">
                        <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-white/50">
                          Advanced alert thresholds
                        </summary>

                        <div className="grid gap-4 border-t border-white/10 p-4 md:grid-cols-2">

                      <input
                        type="hidden"
                        name="id"
                        value={item.id}
                      />

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
                          AI Score threshold
                        </span>

                        <input
                          name="opportunity_threshold"
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={
                            item.opportunity_threshold
                          }
                          className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
                          Specific risk level
                        </span>

                        <select
                          name="risk_threshold"
                          defaultValue={
                            item.risk_threshold ?? ""
                          }
                          className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        >
                          <option value="">No risk alert</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">
                            Medium
                          </option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">
                            Critical
                          </option>
                        </select>
                      </label>

                        </div>
                      </details>

                      <div className="mt-5 flex justify-end">
                        <button
                          type="submit"
                          className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.13]"
                        >
                          Save monitoring settings
                        </button>
                      </div>
                    </form>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-8">
                <p className="text-lg font-semibold">
                  Your Watchlist is empty.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/42">
                  Add BTC, ETH, SOL, NVDA, SPY, or another
                  market you want Nestrova to track.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Alert Preview
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em]">
            Conditions are now evaluated. Notifications come next.
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/45">
            Nestrova now compares each saved asset against your Opportunity and
            Risk settings. This page only highlights matches; email and push
            delivery will be connected in the next phase.
          </p>
        </div>
      </section>
    </UserAwareNestrovaShell>
  );
}
