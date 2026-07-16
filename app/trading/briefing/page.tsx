import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

type Opportunity = {
  symbol?: string;
  opportunity_score?: number;
  regime?: string;
  risk?: string;
  research_style?: string;
};

type TradingState = {
  generated_at?: string;
  disclaimer?: string;
  system?: {
    core_health?: string;
    recommended_action?: string;
    kernel_status?: string;
    public_mode?: string;
    execution_exposed?: boolean;
  };
  market?: {
    base_asset?: string;
    regime?: string;
    confidence?: number;
    risk?: string;
    research_style?: string;
    data_time?: string | null;
  };
  opportunities?: {
    top_opportunities?: Opportunity[];
    candidate_count?: number;
    ranking_status?: string;
  };
  council?: {
    consensus?: string;
    confidence?: number;
    veto?: boolean;
    agent_count?: number;
  };
  shadow_research?: {
    total_shadow_results?: number;
    supervisor_status?: string;
    module_count?: number;
    last_update?: string | null;
  };
  verification?: {
    verified_count?: number;
    watch_count?: number;
    strategy_count?: number;
    total_shadow_results?: number;
  };
  research?: {
    strategy_models_observed?: number;
    active_hypotheses?: number;
    hypothesis_data_status?: string;
  };
};

async function getTradingState(): Promise<{
  data: TradingState | null;
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
        error: `Trading API returned ${response.status}.`,
      };
    }

    const data = (await response.json()) as TradingState;

    if (
      data.system?.public_mode !== "READ_ONLY" ||
      data.system?.execution_exposed !== false
    ) {
      return {
        data: null,
        error: "Public safety validation failed.",
      };
    }

    return { data, error: null };
  } catch {
    return {
      data: null,
      error: "Daily Briefing is temporarily unavailable.",
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

function formatNumber(value?: number | null, digits = 0) {
  if (value === null || value === undefined) {
    return "—";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
  });
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

function riskClasses(value?: string) {
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
      return "border-white/10 bg-white/[0.06] text-white/55";
  }
}

function consensusClasses(value?: string) {
  switch (value?.toUpperCase()) {
    case "BUY":
    case "BULLISH":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "SHADOW_ONLY":
    case "WATCH":
    case "HOLD":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
    case "NO_TRADE":
    case "ABSTAIN":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    case "SELL":
    case "BEARISH":
      return "border-red-400/20 bg-red-400/10 text-red-200";
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
    <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
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

export default async function TradingBriefingPage() {
  const { data, error } = await getTradingState();

  const market = data?.market;
  const council = data?.council;
  const opportunities =
    data?.opportunities?.top_opportunities ?? [];
  const shadow = data?.shadow_research;
  const verification = data?.verification;
  const research = data?.research;
  const system = data?.system;

  const topOpportunity = opportunities[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-300px] top-20 h-[800px] w-[800px] rounded-full bg-emerald-400/10 blur-3xl" />
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
                Daily Briefing
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link href="/trading" className="transition hover:text-white">
              Overview
            </Link>
            <Link href="/trading/markets" className="transition hover:text-white">
              Markets
            </Link>
            <Link href="/trading/strategies" className="transition hover:text-white">
              Strategies
            </Link>
            <Link href="/trading/verified" className="transition hover:text-white">
              Verified
            </Link>
            <Link href="/trading/council" className="transition hover:text-white">
              Council
            </Link>
            <Link href="/trading/briefing" className="text-white">
              Briefing
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-cyan-300/70">
              Nestrova Trading
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Today&apos;s market intelligence in one view.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              Market regime, Council consensus, top opportunity, risk,
              Shadow research, and verification status—summarized from the
              public read-only intelligence layer.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/45">
            <p className="font-semibold text-white/70">
              Briefing generated
            </p>
            <p className="mt-1">
              {formatDate(data?.generated_at)}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-9 rounded-[30px] border border-red-400/20 bg-red-400/10 p-6">
            <p className="font-semibold text-red-200">
              Daily Briefing unavailable
            </p>
            <p className="mt-2 text-sm text-red-100/65">
              {error}
            </p>
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-5 px-5 py-8 sm:grid-cols-2 md:px-8 xl:grid-cols-4">
        <MetricCard
          label="Market Regime"
          value={cleanLabel(market?.regime)}
          detail={`${market?.base_asset ?? "Market"} reference · ${
            market?.confidence ?? 0
          }% confidence`}
        />

        <MetricCard
          label="Council"
          value={cleanLabel(council?.consensus)}
          detail={`${council?.confidence ?? 0}% confidence · ${
            council?.agent_count ?? 0
          } agents`}
        />

        <MetricCard
          label="Top Opportunity"
          value={topOpportunity?.symbol ?? "Unavailable"}
          detail={
            topOpportunity
              ? `${topOpportunity.opportunity_score ?? 0}/100 · ${cleanLabel(
                  topOpportunity.risk,
                )} risk`
              : "No public opportunity currently available."
          }
        />

        <MetricCard
          label="Shadow Evidence"
          value={formatNumber(shadow?.total_shadow_results)}
          detail="Simulated research results without live execution."
        />
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
                Market Summary
              </p>

              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
                {cleanLabel(market?.regime)}
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/45">
                Research style: {market?.research_style ?? "Unavailable"}
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

          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/25 p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">
                Market confidence
              </p>
              <p className="text-3xl font-semibold">
                {market?.confidence ?? 0}%
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, market?.confidence ?? 0),
                  )}%`,
                }}
              />
            </div>

            <p className="mt-5 text-xs text-white/30">
              Market source: {formatDate(market?.data_time)}
            </p>
          </div>
        </article>

        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300/70">
            AI Council
          </p>

          <div className="mt-5 flex items-start justify-between gap-5">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.055em]">
                {cleanLabel(council?.consensus)}
              </h2>

              <p className="mt-3 text-sm text-white/42">
                {council?.agent_count ?? 0} public research agents
              </p>
            </div>

            <span
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${consensusClasses(
                council?.consensus,
              )}`}
            >
              {council?.veto ? "Veto Active" : "No Veto"}
            </span>
          </div>

          <div className="mt-7 rounded-[26px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
              Final Confidence
            </p>
            <p className="mt-2 text-4xl font-semibold">
              {council?.confidence ?? 0}%
            </p>
          </div>

          <Link
            href="/trading/council"
            className="mt-6 inline-flex text-sm font-semibold text-white/55 transition hover:text-white"
          >
            Open AI Council →
          </Link>
        </article>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-2">
        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/70">
            Verification
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Verified
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(verification?.verified_count)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Watch
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(verification?.watch_count)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Strategy Models
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(verification?.strategy_count)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Shadow Results
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(verification?.total_shadow_results)}
              </p>
            </div>
          </div>

          <Link
            href="/trading/verified"
            className="mt-6 inline-flex text-sm font-semibold text-white/55 transition hover:text-white"
          >
            Open Verified Registry →
          </Link>
        </article>

        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
            Research Health
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4">
            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Models Observed
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(research?.strategy_models_observed)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Hypotheses
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {formatNumber(research?.active_hypotheses)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Core Health
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {cleanLabel(system?.core_health)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Supervisor
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {cleanLabel(shadow?.supervisor_status)}
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-white/30">
            Recommended action: {cleanLabel(system?.recommended_action)}
          </p>
        </article>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-10 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Top Opportunities
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
            Assets currently worth researching.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.length > 0 ? (
            opportunities.slice(0, 6).map((item, index) => (
              <article
                key={`${item.symbol}-${index}`}
                className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">
                      Rank #{index + 1}
                    </p>

                    <h3 className="mt-3 text-3xl font-semibold">
                      {item.symbol ?? "Unknown"}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClasses(
                      item.risk,
                    )}`}
                  >
                    {cleanLabel(item.risk)}
                  </span>
                </div>

                <p className="mt-7 text-4xl font-semibold">
                  {item.opportunity_score ?? 0}
                  <span className="text-sm text-white/30"> / 100</span>
                </p>

                <p className="mt-4 text-sm text-white/42">
                  {cleanLabel(item.regime)} ·{" "}
                  {item.research_style ?? "Unavailable"}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-8 text-sm text-white/42 xl:col-span-3">
              No public opportunities are currently available.
            </div>
          )}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Briefing Boundary
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em]">
            A concise public summary—not a personalized investment instruction.
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/45">
            The briefing contains sanitized research only. It does not expose
            account balances, holdings, orders, live positions, private
            strategy formulas, execution controls, or brokerage credentials.
          </p>
        </div>

        <p className="mt-8 text-xs leading-6 text-white/30">
          {data?.disclaimer ??
            "Nestrova Trading provides simulated research and educational market intelligence. It does not provide personalized financial advice or guaranteed results."}
        </p>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Nestrova Trading Intelligence.</p>

          <div className="flex flex-wrap gap-5">
            <Link href="/trading" className="hover:text-white">
              Overview
            </Link>
            <Link href="/trading/markets" className="hover:text-white">
              Markets
            </Link>
            <Link href="/trading/council" className="hover:text-white">
              Council
            </Link>
            <Link href="/trading/verified" className="hover:text-white">
              Verified
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
