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
  score_basis?: string;
};

type MarketState = {
  base_asset?: string;
  regime?: string;
  confidence?: number;
  risk?: string;
  research_style?: string;
  data_time?: string | null;
  source_available?: boolean;
};

type TradingState = {
  generated_at?: string;
  disclaimer?: string;
  market?: MarketState;
  opportunities?: {
    top_opportunities?: Opportunity[];
    candidate_count?: number;
    ranking_status?: string;
    source_available?: boolean;
  };
  system?: {
    public_mode?: string;
    execution_exposed?: boolean;
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
        error: `API returned status ${response.status}.`,
      };
    }

    const data = (await response.json()) as TradingState;

    if (
      data.system?.public_mode !== "READ_ONLY" ||
      data.system?.execution_exposed !== false
    ) {
      return {
        data: null,
        error: "Public API safety validation failed.",
      };
    }

    return { data, error: null };
  } catch {
    return {
      data: null,
      error: "Market Intelligence is temporarily unavailable.",
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
      return "border-white/10 bg-white/[0.06] text-white/50";
  }
}

function opportunityClasses(score?: number) {
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

function confidenceWidth(value?: number) {
  return `${Math.max(0, Math.min(100, value ?? 0))}%`;
}

export default async function TradingMarketsPage() {
  const { data, error } = await getTradingState();

  const market = data?.market;
  const opportunities =
    data?.opportunities?.top_opportunities ?? [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-320px] top-20 h-[780px] w-[780px] rounded-full bg-violet-400/10 blur-3xl" />
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
                Market Intelligence
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

            <Link href="/trading/markets" className="text-white">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-cyan-300/70">
              Nestrova Trading
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Market conditions, ranked by public intelligence.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              Compare public World Model conditions, opportunity scores,
              market regimes, risk classifications, and research styles.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/45">
            <p className="font-semibold text-white/70">
              Latest public state
            </p>
            <p className="mt-1">{formatDate(data?.generated_at)}</p>
          </div>
        </div>

        {error ? (
          <div className="mt-9 rounded-[30px] border border-red-400/20 bg-red-400/10 p-6">
            <p className="font-semibold text-red-200">
              Market data unavailable
            </p>
            <p className="mt-2 text-sm text-red-100/65">
              {error}
            </p>
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-5 px-5 py-8 md:px-8 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Primary Market
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {market?.base_asset ?? "Unavailable"}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Current World Model reference asset.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Global Regime
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {cleanLabel(market?.regime)}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Aggregated multi-timeframe market state.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Confidence
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {market?.confidence ?? 0}%
          </p>
          <p className="mt-3 text-sm text-white/42">
            Public World Model confidence.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Assets Observed
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {data?.opportunities?.candidate_count ?? 0}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Assets included in the public ranking.
          </p>
        </article>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-[1fr_420px]">
        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                World Model
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
                {cleanLabel(market?.regime)}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/45">
                Research style:{" "}
                {market?.research_style ?? "Unavailable"}
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
            <div className="flex items-center justify-between">
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

            <p className="mt-5 text-xs leading-6 text-white/30">
              Source update: {formatDate(market?.data_time)}
            </p>
          </div>
        </article>

        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
            Ranking Status
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
            {cleanLabel(data?.opportunities?.ranking_status)}
          </h2>

          <div className="mt-7 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Candidate Count
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {data?.opportunities?.candidate_count ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Public Source
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {data?.opportunities?.source_available
                  ? "Available"
                  : "Unavailable"}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-10 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Opportunity Ranking
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
              Assets currently worth researching.
            </h2>
          </div>

          <Link
            href="/trading"
            className="text-sm font-semibold text-white/50 transition hover:text-white"
          >
            Return to overview →
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.05]">
          <div className="hidden grid-cols-[0.6fr_1fr_1fr_1fr_1.2fr] gap-4 border-b border-white/10 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 md:grid">
            <p>Rank</p>
            <p>Asset</p>
            <p>Opportunity</p>
            <p>Regime</p>
            <p>Risk / Style</p>
          </div>

          {opportunities.length > 0 ? (
            opportunities.map((item, index) => (
              <article
                key={`${item.symbol}-${index}`}
                className="grid gap-4 border-b border-white/10 px-6 py-6 last:border-b-0 md:grid-cols-[0.6fr_1fr_1fr_1fr_1.2fr] md:items-center"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Rank
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white/45 md:mt-0">
                    #{index + 1}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Asset
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] md:mt-0">
                    {item.symbol ?? "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Opportunity
                  </p>
                  <p
                    className={`mt-1 text-2xl font-semibold md:mt-0 ${opportunityClasses(
                      item.opportunity_score,
                    )}`}
                  >
                    {item.opportunity_score ?? 0}
                    <span className="text-sm text-white/30"> / 100</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Regime
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/62 md:mt-0">
                    {cleanLabel(item.regime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Risk / Style
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-0">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClasses(
                        item.risk,
                      )}`}
                    >
                      {cleanLabel(item.risk)}
                    </span>

                    <span className="text-xs text-white/40">
                      {item.research_style ?? "Unavailable"}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="p-10 text-sm text-white/42">
              No public market rankings are currently available.
            </div>
          )}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Public Research Boundary
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em]">
            Rankings describe research conditions, not investment instructions.
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/45">
            Opportunity scores are derived from sanitized World Model
            information. They do not expose private strategy formulas,
            brokerage credentials, account balances, positions, orders, or
            execution controls.
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
            <Link
              href="/trading/strategies"
              className="hover:text-white"
            >
              Strategies
            </Link>
            <Link
              href="/trading/verified"
              className="hover:text-white"
            >
              Verified
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
