import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  addWatchlistItem,
  deleteWatchlistItem,
  updateWatchlistSettings,
} from "./actions";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

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
    const response = await fetch(
      `${API_BASE_URL}/api/v1/core/state`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TradingState;

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
  if (!value) {
    return "Unavailable";
  }

  return value
    .replaceAll("_", " ")
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

  const [{ data, error }, tradingState] = await Promise.all([
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
          updated_at
        `,
      )
      .eq("user_id", authData.user.id)
      .order("created_at", {
        ascending: false,
      }),
    getTradingState(),
  ]);

  const watchlist = (data ?? []) as WatchlistItem[];

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
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-300px] top-20 h-[800px] w-[800px] rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
              N
            </div>

            <div>
              <p className="text-sm font-semibold">Nestrova</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Trading Watchlist
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link
              href="/trading"
              className="transition hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/trading/markets"
              className="transition hover:text-white"
            >
              Markets
            </Link>
            <Link
              href="/trading/briefing"
              className="transition hover:text-white"
            >
              Briefing
            </Link>
            <Link href="/trading/watchlist" className="text-white">
              Watchlist
            </Link>
          </nav>

          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

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
            Saved assets currently found in the public scanner.
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
            Saved assets currently meeting your Opportunity threshold.
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
                Opportunity threshold
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

                    <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                          Opportunity
                        </p>

                        <p
                          className={`mt-2 text-2xl font-semibold ${opportunityClasses(
                            opportunityScore,
                          )}`}
                        >
                          {opportunityScore ?? "—"}
                          {opportunityScore !== undefined ? (
                            <span className="text-xs text-white/28">
                              {" "}
                              / 100
                            </span>
                          ) : null}
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                          Regime
                        </p>

                        <p className="mt-2 text-lg font-semibold">
                          {cleanLabel(
                            intelligence?.regime ??
                              tradingState?.market?.regime,
                          )}
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                          Risk
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${riskClasses(
                            intelligence?.risk ??
                              tradingState?.market?.risk,
                          )}`}
                        >
                          {cleanLabel(
                            intelligence?.risk ??
                              tradingState?.market?.risk,
                          )}
                        </span>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                          Research Style
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white/55">
                          {intelligence?.research_style ??
                            "No direct scanner match"}
                        </p>
                      </div>
                    </div>

                    {!intelligence ? (
                      <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-xs leading-6 text-amber-100/60">
                        This asset is saved, but it is not currently included
                        in the public Opportunity Scanner. Global market context
                        is shown instead.
                      </div>
                    ) : null}

                    <form
                      action={updateWatchlistSettings}
                      className="mt-7 grid gap-4 rounded-[28px] border border-white/10 bg-black/20 p-5 md:grid-cols-[1fr_1fr_auto]"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={item.id}
                      />

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
                          Opportunity threshold
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
                          Risk alert
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

                      <div className="flex flex-col justify-end gap-3">
                        <label className="flex items-center gap-3 text-sm text-white/55">
                          <input
                            type="checkbox"
                            name="alert_enabled"
                            defaultChecked={
                              item.alert_enabled
                            }
                            className="h-4 w-4"
                          />
                          Alerts enabled
                        </label>

                        <button
                          type="submit"
                          className="rounded-full border border-white/10 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          Save
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
    </main>
  );
}
