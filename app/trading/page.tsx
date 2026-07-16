import Link from "next/link";

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
  if (!value) {
    return "Unavailable";
  }

  return value
    .replaceAll("_", " ")
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

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-260px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-280px] top-20 h-[820px] w-[820px] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-[-380px] left-[25%] h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
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
                Trading Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link href="/trading" className="text-white">
              Overview
            </Link>
            <Link
              href="/trading/markets"
              className="transition hover:text-white"
            >
              Markets
            </Link>
            <Link
              href="/trading/strategies"
              className="transition hover:text-white"
            >
              Strategies
            </Link>
            <Link
              href="/trading/verified"
              className="transition hover:text-white"
            >
              Verified
            </Link>
            <Link
              href="/trading/council"
              className="transition hover:text-white"
            >
              Council
            </Link>
            <Link
              href="/trading/briefing"
              className="transition hover:text-white"
            >
              Briefing
            </Link>
            <Link href="/" className="transition hover:text-white">
              Platform
            </Link>
          </nav>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            Read Only
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1480px] px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
              Live Public Intelligence
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              Market research before market action.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/52">
              Review market regime, AI Council consensus, shadow research,
              strategy evidence, and verification status without connecting a
              brokerage account or exposing private execution systems.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/45">
            <p className="font-semibold text-white/75">
              Last public update
            </p>
            <p className="mt-1">
              {formatDate(data?.generated_at)}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-10 rounded-[32px] border border-red-400/20 bg-red-400/10 p-6">
            <p className="font-semibold text-red-200">
              Trading Intelligence unavailable
            </p>
            <p className="mt-2 text-sm leading-6 text-red-100/65">
              {error} The page remains safely available without exposing
              private system information.
            </p>
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Market Regime"
            value={cleanLabel(market?.regime)}
            detail={`${market?.base_asset ?? "Market"} reference · ${
              market?.research_style ?? "Research mode unavailable"
            }`}
          />

          <MetricCard
            label="Confidence"
            value={`${market?.confidence ?? 0}%`}
            detail="Public World Model confidence for the current market state."
          />

          <MetricCard
            label="Risk"
            value={cleanLabel(market?.risk)}
            detail="Aggregated market risk classification, not a guarantee."
          />

          <MetricCard
            label="Shadow Evidence"
            value={formatNumber(shadow?.total_shadow_results, 0)}
            detail="Simulated research results tracked without live execution."
          />
        </div>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300/70">
                Market Intelligence
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
                {cleanLabel(market?.regime)}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/45">
                Base asset: {market?.base_asset ?? "Unavailable"} · Research
                style: {market?.research_style ?? "Unavailable"}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${riskClasses(
                market?.risk,
              )}`}
            >
              {cleanLabel(market?.risk)} Risk
            </span>
          </div>

          <div className="mt-8 rounded-[30px] border border-white/10 bg-black/25 p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">
                Regime confidence
              </p>
              <p className="text-2xl font-semibold">
                {market?.confidence ?? 0}%
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.65)]"
                style={{
                  width: confidenceWidth(market?.confidence),
                }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/42">
              Source time: {formatDate(market?.data_time)}
            </p>
          </div>
        </article>

        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-300/75">
            AI Council
          </p>

          <div className="mt-5 flex items-end justify-between gap-5">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em]">
                {cleanLabel(council?.consensus)}
              </h2>
              <p className="mt-3 text-sm text-white/42">
                {council?.agent_count ?? 0} public research views
              </p>
            </div>

            <p className="text-4xl font-semibold tracking-[-0.055em]">
              {council?.confidence ?? 0}%
            </p>
          </div>

          <div className="mt-7 grid gap-3">
            {votes.length > 0 ? (
              votes.slice(0, 7).map((vote, index) => (
                <div
                  key={`${vote.agent}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {vote.agent ?? "Research Agent"}
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      {cleanLabel(vote.view)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white/60">
                    {vote.confidence ?? 0}%
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/42">
                Council vote details are not currently available.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Opportunity Scanner
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
              Market conditions worth researching.
            </h2>
          </div>

          <Link
            href="/trading/markets"
            className="text-sm font-semibold text-white/55 transition hover:text-white"
          >
            Explore all markets →
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.05]">
          <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 md:grid">
            <p>Asset</p>
            <p>Opportunity</p>
            <p>Regime</p>
            <p>Risk</p>
            <p>Research Style</p>
          </div>

          {opportunities.length > 0 ? (
            opportunities.slice(0, 10).map((item, index) => (
              <div
                key={`${item.symbol}-${index}`}
                className="grid gap-3 border-b border-white/10 px-6 py-5 last:border-b-0 md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:items-center md:gap-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30 md:hidden">
                    Asset
                  </p>
                  <p className="mt-1 text-lg font-semibold md:mt-0">
                    {item.symbol ?? "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30 md:hidden">
                    Opportunity
                  </p>
                  <p className="mt-1 font-semibold md:mt-0">
                    {item.opportunity_score ?? 0}/100
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30 md:hidden">
                    Regime
                  </p>
                  <p className="mt-1 text-sm text-white/62 md:mt-0">
                    {cleanLabel(item.regime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30 md:hidden">
                    Risk
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold md:mt-0 ${riskClasses(
                      item.risk,
                    )}`}
                  >
                    {cleanLabel(item.risk)}
                  </span>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30 md:hidden">
                    Research Style
                  </p>
                  <p className="mt-1 text-sm text-white/48 md:mt-0">
                    {item.research_style ?? "Unavailable"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-8 text-sm text-white/42">
              No public opportunities are currently available.
            </p>
          )}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-[1fr_1fr]">
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
            Open Verified Registry →
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

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
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

      <footer className="relative border-t border-white/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <div>
            <p>© 2026 Nestrova.</p>
            <p className="mt-1">
              Verified intelligence for better decisions.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-white">
              Platform
            </Link>
            <Link href="/real-estate" className="hover:text-white">
              Real Estate
            </Link>
            <Link href="/research" className="hover:text-white">
              Research
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
