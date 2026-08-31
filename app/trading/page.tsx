import Link from "next/link";
import ExecutiveBrief from "@/components/trading/ExecutiveBrief";
import MarketOverview from "@/components/trading/MarketOverview";
import MarketUniverseExplorer from "@/components/trading/MarketUniverseExplorer";
import LiveTopOpportunities from "@/components/trading/LiveTopOpportunities";
import TradingAI from "@/components/trading/TradingAI";
import WatchlistPanel from "@/components/trading/WatchlistPanel";


import PortfolioAI from "@/components/trading/PortfolioAI";

import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";
import {
  ArrowRightIcon,
  BrainIcon,
  GaugeIcon,
  PulseIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";
import {
  GlassPanel,
  MetricTile,
  StatusChip,
} from "@/components/ui/nestrova";
export const dynamic = "force-dynamic";

import {
  loadTradingPublicState,
} from "@/lib/trading/public-gateway";

type MarketState = {
  base_asset?: string;
  regime?: string;
  confidence?: number;
  risk?: string;
  research_style?: string;
  data_time?: string | null;
  source_available?: boolean;
};

type Opportunity = {
  symbol?: string;
  asset_name?: string;
  asset_type?: string;
  opportunity_score?: number;
  confidence?: number;
  regime?: string;
  risk?: string;
  direction?: string;
  direction_label?: string;
  outlook?: string;
  outlook_label?: string;
  outlook_summary?: string;
  time_horizon?: string;
  research_style?: string;
  score_basis?: string;
};

type OpportunitiesState = {
  top_opportunities?: Opportunity[];
  candidate_count?: number;
  ranking_status?: string;
  source_available?: boolean;
};

type CouncilVote = {
  agent?: string;
  view?: string;
  confidence?: number;
};

type CouncilState = {
  consensus?: string;
  confidence?: number;
  veto?: boolean;
  agent_count?: number;
  votes?: CouncilVote[];
  source_available?: boolean;
};

type ShadowModule = {
  step?: string;
  status?: string;
};

type ShadowResearchState = {
  total_shadow_results?: number;
  supervisor_status?: string;
  module_count?: number;
  module_statuses?: ShadowModule[];
  last_update?: string | null;
  source_available?: boolean;
};

type StrategyState = {
  name?: string;
  status?: string;
  trade_count?: number;
  win_rate?: number | null;
  profit_factor?: number | null;
  average_return?: number | null;
};

type VerificationState = {
  total_shadow_results?: number;
  verified_count?: number;
  watch_count?: number;
  strategy_count?: number;
  strategies?: StrategyState[];
  generated_at?: string | null;
  source_available?: boolean;
};

type ResearchState = {
  strategy_models_observed?: number;
  active_hypotheses?: number;
  hypothesis_data_status?: string;
  source_available?: boolean;
};

type SystemState = {
  core_health?: string;
  recommended_action?: string;
  kernel_status?: string;
  public_mode?: string;
  execution_exposed?: boolean;
};

type TradingPublicState = {
  schema_version?: string;
  product?: string;
  generated_at?: string;
  disclaimer?: string;
  system?: SystemState;
  market?: MarketState;
  opportunities?: OpportunitiesState;
  council?: CouncilState;
  shadow_research?: ShadowResearchState;
  verification?: VerificationState;
  research?: ResearchState;
};

async function getTradingState(): Promise<{
  data: TradingPublicState | null;
  error: string | null;
}> {
  try {
    const gatewayResult =
      await loadTradingPublicState<TradingPublicState>();

    if (
      gatewayResult.error ||
      !gatewayResult.data
    ) {
      return {
        data: null,
        error:
          gatewayResult.error ??
          "Radar is temporarily unavailable.",
      };
    }

    const data =
      gatewayResult.data;

    if (
      data.system?.public_mode !== "READ_ONLY" ||
      data.system?.execution_exposed !== false
    ) {
      return {
        data: null,
        error: "Radar safety validation failed.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Radar is temporarily unavailable.",
    };
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
    (normalized.match(/\uFFFD/g) ?? []).length;

  const questionMarkCount =
    (normalized.match(/\?/g) ?? []).length;

  const looksCorrupted =
    replacementCharacterCount > 0 ||
    questionMarkCount >= 3 ||
    normalized.includes("챙") ||
    normalized.includes("챘") ||
    normalized.includes("챠");

  if (looksCorrupted) {
    return "AI Research Strategy";
  }

  return normalized
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatNumber(value?: number | null, digits = 2) {
  if (value === null || value === undefined) {
    return "—";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
  });
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${formatNumber(value, 2)}%`;
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

function confidenceWidth(value?: number) {
  const normalized = Math.max(0, Math.min(100, value ?? 0));
  return `${normalized}%`;
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
      return "border-white/10 bg-white/[0.06] text-white/55";
  }
}

function statusClasses(status?: string) {
  switch (status?.toUpperCase()) {
    case "VERIFIED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "WATCH":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
    case "SHADOW":
      return "border-violet-400/20 bg-violet-400/10 text-violet-200";
    case "RESEARCH":
      return "border-white/10 bg-white/[0.06] text-white/55";
    default:
      return "border-white/10 bg-white/[0.06] text-white/55";
  }
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-white/42">
        {detail}
      </p>
    </article>
  );
}

export default async function TradingPage() {
  const { data, error } = await getTradingState();

  const market = data?.market;
  const opportunities =
    data?.opportunities?.top_opportunities ?? [];
  const council = data?.council;
  const shadow = data?.shadow_research;
  const verification = data?.verification;
  const research = data?.research;
  const strategies = verification?.strategies ?? [];
  const votes = council?.votes ?? [];

  const topOpportunity = [...opportunities]
    .sort(
      (first, second) =>
        (second.opportunity_score ?? 0) -
        (first.opportunity_score ?? 0),
    )[0] ?? null;

  const bullishNow = [...opportunities]
    .filter((item) => {
      const direction = String(
        item.direction ?? "",
      ).toUpperCase();

      const outlook = String(
        item.outlook ?? "",
      ).toUpperCase();

      return (
        direction === "UP" ||
        outlook === "BULLISH" ||
        outlook === "STRONG_BULLISH"
      );
    })
    .sort(
      (first, second) =>
        (second.confidence ?? 0) -
          (first.confidence ?? 0) ||
        (second.opportunity_score ?? 0) -
          (first.opportunity_score ?? 0),
    )
    .slice(0, 4);

  const weakeningNow = [...opportunities]
    .filter((item) => {
      const direction = String(
        item.direction ?? "",
      ).toUpperCase();

      const outlook = String(
        item.outlook ?? "",
      ).toUpperCase();

      return (
        direction === "DOWN" ||
        outlook === "BEARISH" ||
        outlook === "STRONG_BEARISH"
      );
    })
    .sort(
      (first, second) =>
        (second.confidence ?? 0) -
          (first.confidence ?? 0),
    )
    .slice(0, 4);

  const highestConfidence = [...opportunities]
    .filter(
      (item) =>
        typeof item.confidence === "number",
    )
    .sort(
      (first, second) =>
        (second.confidence ?? 0) -
        (first.confidence ?? 0),
    )
    .slice(0, 4);


  const marketConfidence = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        market?.confidence ??
          council?.confidence ??
          0,
      ),
    ),
  );

  const publicMode =
    data?.system?.public_mode ?? "READ_ONLY";

  return (
    <UserAwareNestrovaShell
      title="Radar"
      subtitle="Stocks and crypto, explained more clearly."
    >

      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-6 md:px-8 md:py-8">
        <section className="rounded-[34px] border border-white/10 bg-white/[0.045] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/65">
                Market Today
              </p>

              <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.8rem)] font-black leading-[0.95] tracking-[-0.065em]">
                Understand the market.
                <span className="block text-white/35">
                  Find what deserves your attention.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
                Nestrova summarizes market direction, risk, and the strongest
                current opportunities across U.S. stocks and crypto.
              </p>
            </div>

            <StatusChip
              tone={
                data?.system?.core_health === "AVAILABLE" ||
                data?.system?.core_health === "HEALTHY"
                  ? "emerald"
                  : "amber"
              }
              icon={<PulseIcon className="h-3.5 w-3.5" />}
              className="shrink-0 px-4 py-2 text-[11px]"
            >
              AI Online
            </StatusChip>
          </div>

          {error ? (
            <div className="mt-6 rounded-[20px] border border-red-400/20 bg-red-400/10 p-4">
              <p className="font-semibold text-red-200">
                Market intelligence is temporarily unavailable.
              </p>
              <p className="mt-2 text-sm leading-6 text-red-100/55">
                {error}
              </p>
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricTile
              label="Market"
              value={cleanLabel(market?.regime)}
              detail="Current market direction"
              icon={<PulseIcon className="h-5 w-5" />}
              tone="emerald"
            />

            <MetricTile
              label="Confidence"
              value={`${marketConfidence}%`}
              detail="How strong the current research signal is"
              icon={<GaugeIcon className="h-5 w-5" />}
              tone="cyan"
            />

            <MetricTile
              label="Risk"
              value={cleanLabel(market?.risk)}
              detail="Current public market risk"
              icon={<ShieldIcon className="h-5 w-5" />}
              tone={
                String(market?.risk ?? "").toUpperCase() === "LOW"
                  ? "emerald"
                  : String(market?.risk ?? "").toUpperCase() === "MEDIUM"
                    ? "amber"
                    : "red"
              }
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/trading/markets"
              className="inline-flex items-center gap-2 rounded-[14px] bg-white px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              Explore Markets
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <Link
              href="/trading/watchlist"
              className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/[0.09] hover:text-white"
            >
              My Watchlist
            </Link>
          </div>
        </section>

        <MarketUniverseExplorer compact />

        <section className="py-8">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              AI Market Signals
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">
              What Nestrova sees right now.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              A simpler view of current direction, confidence, and risk across the strongest public research signals.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <article className="rounded-[30px] border border-emerald-300/15 bg-emerald-300/[0.045] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-200/55">
                    Bullish Now
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Leaning higher
                  </h3>
                </div>

                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-1 text-[10px] font-bold text-emerald-100">
                  {bullishNow.length} signals
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {bullishNow.length > 0 ? (
                  bullishNow.map((item) => (
                    <Link
                      key={`bullish-${item.symbol}`}
                      href={`/trading/assets/${encodeURIComponent(
                        item.symbol ?? "",
                      )}`}
                      className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 transition hover:border-emerald-300/20 hover:bg-white/[0.05]"
                    >
                      <div className="min-w-0">
                        <p className="font-bold">
                          {item.symbol ?? "Unknown"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-white/30">
                          {item.outlook_label ||
                            item.direction_label ||
                            cleanLabel(
                              item.outlook ??
                                item.direction,
                            )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-200">
                          {item.confidence ?? 0}%
                        </p>

                        <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/25">
                          confidence
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="rounded-[18px] border border-white/10 bg-black/20 p-4 text-xs leading-5 text-white/35">
                    No clearly bullish public research signals are available right now.
                  </p>
                )}
              </div>
            </article>

            <article className="rounded-[30px] border border-orange-300/15 bg-orange-300/[0.04] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-orange-200/55">
                    Weakening
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Leaning lower
                  </h3>
                </div>

                <span className="rounded-full border border-orange-300/15 bg-orange-300/[0.08] px-3 py-1 text-[10px] font-bold text-orange-100">
                  {weakeningNow.length} signals
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {weakeningNow.length > 0 ? (
                  weakeningNow.map((item) => (
                    <Link
                      key={`weakening-${item.symbol}`}
                      href={`/trading/assets/${encodeURIComponent(
                        item.symbol ?? "",
                      )}`}
                      className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 transition hover:border-orange-300/20 hover:bg-white/[0.05]"
                    >
                      <div className="min-w-0">
                        <p className="font-bold">
                          {item.symbol ?? "Unknown"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-white/30">
                          {item.outlook_label ||
                            item.direction_label ||
                            cleanLabel(
                              item.outlook ??
                                item.direction,
                            )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-orange-200">
                          {item.confidence ?? 0}%
                        </p>

                        <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/25">
                          confidence
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="rounded-[18px] border border-white/10 bg-black/20 p-4 text-xs leading-5 text-white/35">
                    No clearly bearish public research signals are available right now.
                  </p>
                )}
              </div>
            </article>

            <article className="rounded-[30px] border border-cyan-300/15 bg-cyan-300/[0.04] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-200/55">
                    Highest Confidence
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Strongest conviction
                  </h3>
                </div>

                <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-3 py-1 text-[10px] font-bold text-cyan-100">
                  Top {highestConfidence.length}
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {highestConfidence.map((item) => (
                  <Link
                    key={`confidence-${item.symbol}`}
                    href={`/trading/assets/${encodeURIComponent(
                      item.symbol ?? "",
                    )}`}
                    className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 transition hover:border-cyan-300/20 hover:bg-white/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="font-bold">
                        {item.symbol ?? "Unknown"}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-white/30">
                        {item.outlook_label ||
                          item.direction_label ||
                          cleanLabel(
                            item.outlook ??
                              item.direction,
                          )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-cyan-100">
                        {item.confidence ?? 0}%
                      </p>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/25">
                        confidence
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="py-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Top Opportunities
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">
                What stands out right now.
              </h2>
            </div>

            <Link
              href="/trading/markets"
              className="text-sm font-semibold text-cyan-200/70 transition hover:text-cyan-200"
            >
              View all markets →
            </Link>
          </div>

          <LiveTopOpportunities
            initialOpportunities={opportunities}
            initialGeneratedAt={data?.generated_at}
          />
        </section>

        <section className="grid gap-5 py-4 lg:grid-cols-2">
          <Link
            href="/trading/watchlist"
            className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-300/20 hover:bg-white/[0.065]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/60">
              Your Trading
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.045em]">
              Watchlist
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Keep the stocks and crypto you care about in one place.
            </p>

            <p className="mt-6 text-sm font-semibold text-cyan-200/70 transition group-hover:text-cyan-200">
              Open Watchlist →
            </p>
          </Link>

          <Link
            href="/trading/portfolio"
            className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-300/20 hover:bg-white/[0.065]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/60">
              Your Trading
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-[-0.045em]">
              Portfolio
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Review your saved positions and portfolio research.
            </p>

            <p className="mt-6 text-sm font-semibold text-violet-200/70 transition group-hover:text-violet-200">
              Open Portfolio →
            </p>
          </Link>
        </section>

        <section className="py-10">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Advanced Research
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                Go deeper when you need to.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
                These tools are optional. Use them when you want more detail
                behind Nestrova&apos;s market view.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/trading/briefing"
                className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.05]"
              >
                <p className="text-sm font-bold">
                  AI Briefing
                </p>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  A more detailed explanation of today&apos;s market.
                </p>
              </Link>

              <Link
                href="/trading/council"
                className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.05]"
              >
                <p className="text-sm font-bold">
                  AI Council
                </p>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  See multiple AI viewpoints on the same market.
                </p>
              </Link>

              <Link
                href="/trading/strategies"
                className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.05]"
              >
                <p className="text-sm font-bold">
                  Strategy Research
                </p>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  Review research strategies and historical evidence.
                </p>
              </Link>

              <Link
                href="/trading/verified"
                className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.05]"
              >
                <p className="text-sm font-bold">
                  Verified Research
                </p>
                <p className="mt-2 text-xs leading-5 text-white/35">
                  Explore research that has passed additional validation.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-8 pt-2">
          <details className="rounded-[30px] border border-white/10 bg-white/[0.03]">
            <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-white/55">
              Technical system details
            </summary>

            <div className="border-t border-white/10 p-6">
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="min-w-0">
                  <ExecutiveBrief
                    market={market}
                    council={council}
                    opportunities={opportunities}
                    system={data?.system}
                  />
                </div>

                <div className="min-w-0">
                  <MarketOverview
                    market={market}
                    opportunities={opportunities}
                    council={council}
                  />
                </div>

                <div className="min-w-0">
                  <PortfolioAI />
                </div>

                <div className="min-w-0">
                  <WatchlistPanel />
                </div>

                <div className="min-w-0 xl:col-span-2">
                  <TradingAI
                    market={market}
                    council={council}
                    opportunities={opportunities}
                    system={data?.system}
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <MetricCard
                  label="Research Results"
                  value={formatNumber(
                    shadow?.total_shadow_results,
                    0,
                  )}
                  detail="Simulated research evidence."
                />

                <MetricCard
                  label="Research Models"
                  value={formatNumber(
                    research?.strategy_models_observed,
                    0,
                  )}
                  detail="Strategy models currently observed."
                />

                <MetricCard
                  label="Verified"
                  value={formatNumber(
                    verification?.verified_count,
                    0,
                  )}
                  detail="Research entries that passed verification."
                />
              </div>
            </div>
          </details>

          <p className="mt-6 text-xs leading-6 text-white/25">
            {data?.disclaimer ??
              "Nestrova Radar provides simulated research and educational market intelligence. It does not provide personalized financial advice or guaranteed results."}
          </p>
        </section>
      </div>
    </UserAwareNestrovaShell>
  );
}

