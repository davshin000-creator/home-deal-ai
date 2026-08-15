import Link from "next/link";
import ExecutiveBrief from "@/components/trading/ExecutiveBrief";
import MarketOverview from "@/components/trading/MarketOverview";
import TopOpportunities from "@/components/trading/TopOpportunities";
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

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

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
  opportunity_score?: number;
  regime?: string;
  risk?: string;
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
      return {
        data: null,
        error: `Trading Intelligence API returned ${response.status}.`,
      };
    }

    const data = (await response.json()) as TradingPublicState;

    if (
      data.system?.public_mode !== "READ_ONLY" ||
      data.system?.execution_exposed !== false
    ) {
      return {
        data: null,
        error: "Trading Intelligence safety validation failed.",
      };
    }

    return {
      data,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Trading Intelligence is temporarily unavailable.",
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
  title="Trading Intelligence"
  subtitle="Public AI research for crypto and U.S. stocks."
>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />
        <div className="absolute -left-52 top-[-260px] h-[720px] w-[720px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-280px] top-16 h-[760px] w-[760px] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-[-360px] left-[24%] h-[720px] w-[720px] rounded-full bg-emerald-400/[0.08] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1580px] px-5 py-6 md:px-8 md:py-8">
        <section className="grid min-w-0 gap-6 pb-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <GlassPanel
            tone="cyan"
            contentClassName="min-w-0 p-6 md:p-8"
          >
            <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <BrainIcon className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/65">
                      Today&apos;s Executive Summary
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Updated {formatDate(data?.generated_at)}
                    </p>
                  </div>
                </div>

                <h1 className="mt-6 max-w-4xl break-words text-[clamp(2rem,5vw,4.25rem)] font-black leading-[0.96] tracking-[-0.065em] [overflow-wrap:anywhere]">
                  {cleanLabel(market?.regime)} market.
                  <span className="block text-white/38">
                    Focus on selective opportunities.
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/45 md:text-base">
                  Review current market conditions, portfolio intelligence,
                  AI-ranked opportunities, and risk before making an
                  independent decision.
                </p>

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
                    className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:-translate-y-0.5 hover:bg-white/[0.1] hover:text-white"
                  >
                    My Watchlist
                  </Link>

                  <Link
                    href="/trading/briefing"
                    className="inline-flex items-center gap-2 rounded-[14px] border border-violet-300/20 bg-violet-300/10 px-5 py-3 text-sm font-semibold text-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-300/[0.16]"
                  >
                    AI Briefing
                  </Link>

                  <Link
                    href="/trading/council"
                    className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:-translate-y-0.5 hover:bg-white/[0.1] hover:text-white"
                  >
                    AI Council
                  </Link>
                </div>
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
                  Public intelligence is temporarily unavailable.
                </p>

                <p className="mt-2 text-sm leading-6 text-red-100/55">
                  {error}
                </p>
              </div>
            ) : null}

            <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricTile
                label="Market Regime"
                value={cleanLabel(market?.regime)}
                detail={market?.base_asset ?? "Public market reference"}
                icon={<PulseIcon className="h-5 w-5" />}
                tone="emerald"
              />

              <MetricTile
                label="AI Confidence"
                value={`${marketConfidence}%`}
                detail="Current public research conviction"
                icon={<GaugeIcon className="h-5 w-5" />}
                tone="cyan"
              />

              <MetricTile
                label="Risk Outlook"
                value={cleanLabel(market?.risk)}
                detail="Current market risk classification"
                icon={<ShieldIcon className="h-5 w-5" />}
                tone={
                  String(market?.risk ?? "").toUpperCase() === "LOW"
                    ? "emerald"
                    : String(market?.risk ?? "").toUpperCase() === "MEDIUM"
                      ? "amber"
                      : "red"
                }
              />

              <MetricTile
                label="Top Opportunity"
                value={topOpportunity?.symbol ?? "—"}
                detail={
                  topOpportunity
                    ? `AI Score ${Math.round(
                        topOpportunity.opportunity_score ?? 0,
                      )}`
                    : "No ranked opportunity available"
                }
                icon={<SparkIcon className="h-5 w-5" />}
                tone="violet"
              />
            </div>
          </GlassPanel>

          <GlassPanel
            tone="violet"
            className="h-full"
            contentClassName="flex h-full min-w-0 flex-col p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/65">
                  Nestrova AI Status
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.045em]">
                  Research systems online.
                </h2>
              </div>

              <span className="relative mt-1 flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-55" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/40">
                  Public mode
                </span>

                <StatusChip tone="emerald">
                  {publicMode.replaceAll("_", " ")}
                </StatusChip>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/40">
                  Execution access
                </span>

                <StatusChip tone="cyan">
                  Disabled
                </StatusChip>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/40">
                  Research state
                </span>

                <StatusChip tone="violet">
                  Shadow Research
                </StatusChip>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white/40">
                  Coverage
                </span>

                <span className="text-right text-sm font-semibold text-white/75">
                  Crypto + U.S. Stocks
                </span>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-[20px] border border-emerald-300/15 bg-emerald-300/[0.055] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/60">
                  Safety Boundary
                </p>

                <p className="mt-2 text-sm leading-6 text-emerald-50/55">
                  Private credentials, balances, positions, and orders are
                  never exposed through this dashboard.
                </p>
              </div>
            </div>
          </GlassPanel>
        </section>

      <section className="grid min-w-0 items-stretch gap-6 py-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)]">
        <div className="h-full min-w-0">
          <PortfolioAI />
        </div>

        <div className="h-full min-w-0">
          <ExecutiveBrief
            market={market}
            council={council}
            opportunities={opportunities}
            system={data?.system}
          />
        </div>
      </section>

      <section className="grid min-w-0 items-stretch gap-6 py-4 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="h-full min-w-0">
          <MarketOverview
            market={market}
            opportunities={opportunities}
            council={council}
          />
        </div>

        <div className="h-full min-w-0">
          <WatchlistPanel />
        </div>
      </section>

      <section className="min-w-0 py-4">
        <TopOpportunities
          opportunities={opportunities}
        />
      </section>

      <section className="grid min-w-0 items-stretch gap-6 py-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/65">
            AI Research Workspace
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em]">
            Intelligence, risk, and current action.
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/40">
            Nestrova combines public market context, Council research,
            opportunity rankings, and safety constraints.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Market Regime"
              value={cleanLabel(market?.regime)}
              detail={
                market?.research_style ??
                "Research mode unavailable"
              }
            />

            <MetricCard
              label="Shadow Evidence"
              value={formatNumber(
                shadow?.total_shadow_results,
                0,
              )}
              detail="Simulated research results without live execution."
            />
          </div>
        </div>

        <div className="h-full min-w-0">
          <TradingAI
            market={market}
            council={council}
            opportunities={opportunities}
            system={data?.system}
          />
        </div>
      </section>

      <section className="grid min-w-0 items-stretch gap-6 py-4 xl:grid-cols-2">
        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300/70">
                Shadow Research
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
                {formatNumber(shadow?.total_shadow_results, 0)} results
              </h2>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/50">
              {cleanLabel(shadow?.supervisor_status)}
            </span>
          </div>

          <div className="mt-7 grid gap-3">
            {(shadow?.module_statuses ?? []).length > 0 ? (
              shadow?.module_statuses?.map((module, index) => (
                <div
                  key={`${module.step}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <p className="text-sm text-white/60">
                    {cleanLabel(module.step)}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                    {module.status ?? "Unknown"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/42">
                Shadow module details are currently unavailable.
              </p>
            )}
          </div>

          <p className="mt-6 text-xs leading-6 text-white/30">
            Last supervisor update: {formatDate(shadow?.last_update)}
          </p>
        </article>

        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
            Research Activity
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Strategy Models
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(
                  research?.strategy_models_observed,
                  0,
                )}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Hypotheses
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(research?.active_hypotheses, 0)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Verified
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(verification?.verified_count, 0)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Watch
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(verification?.watch_count, 0)}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Strategy Intelligence
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
              Public research performance.
            </h2>
          </div>

          <Link
            href="/trading/verified"
            className="text-sm font-semibold text-white/55 transition hover:text-white"
          >
            Open Verified Registry ??
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {strategies.length > 0 ? (
            strategies.slice(0, 8).map((strategy, index) => (
              <article
                key={`${strategy.name}-${index}`}
                className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold tracking-[-0.035em]">
                      {cleanLabel(strategy.name)}
                    </p>
                    <p className="mt-2 text-sm text-white/38">
                      {formatNumber(strategy.trade_count, 0)} shadow samples
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusClasses(
                      strategy.status,
                    )}`}
                  >
                    {strategy.status ?? "Research"}
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                      Win Rate
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatPercent(strategy.win_rate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                      Profit Factor
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatNumber(strategy.profit_factor)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                      Avg Return
                    </p>
                    <p className="mt-2 font-semibold">
                      {strategy.average_return === null ||
                      strategy.average_return === undefined
                        ? "—"
                        : `${formatNumber(
                            strategy.average_return * 100,
                            3,
                          )}%`}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-7 text-sm text-white/42 lg:col-span-2">
              No public strategy performance is currently available.
            </div>
          )}
        </div>
      </section>

      <section className="min-w-0 py-8">
        <div className="rounded-[44px] border border-white/10 bg-white/[0.055] p-8 md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
                Safety Boundary
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
                Intelligence only. No account access or trade execution.
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/45">
                The public platform receives sanitized, read-only research.
                Exchange credentials, balances, live positions, orders,
                capital allocation, and private strategy formulas remain
                inside the private Trading OS.
              </p>
            </div>

            <div className="rounded-[30px] border border-emerald-400/20 bg-emerald-400/[0.08] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Public API Status
              </p>
              <p className="mt-4 text-2xl font-semibold">
                {data?.system?.public_mode ?? "Unavailable"}
              </p>
              <p className="mt-2 text-sm text-white/48">
                Execution exposed:{" "}
                {data?.system?.execution_exposed === false
                  ? "No"
                  : "Unavailable"}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs leading-6 text-white/30">
          {data?.disclaimer ??
            "Nestrova Trading provides simulated research and educational market intelligence. It does not provide personalized financial advice or guaranteed results."}
        </p>
      </section>

      </div>
      </UserAwareNestrovaShell>
  );
}


