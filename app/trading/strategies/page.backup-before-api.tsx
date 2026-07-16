import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

type StrategyState = {
  name?: string;
  status?: string;
  trade_count?: number;
  win_rate?: number | null;
  profit_factor?: number | null;
  average_return?: number | null;
};

type TradingState = {
  generated_at?: string;
  disclaimer?: string;
  verification?: {
    total_shadow_results?: number;
    verified_count?: number;
    watch_count?: number;
    strategy_count?: number;
    strategies?: StrategyState[];
    generated_at?: string | null;
    source_available?: boolean;
  };
  shadow_research?: {
    total_shadow_results?: number;
    supervisor_status?: string;
    module_count?: number;
    last_update?: string | null;
    source_available?: boolean;
  };
  research?: {
    strategy_models_observed?: number;
    active_hypotheses?: number;
    hypothesis_data_status?: string;
    source_available?: boolean;
  };
  system?: {
    public_mode?: string;
    execution_exposed?: boolean;
  };
};

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

function formatReturn(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${formatNumber(value * 100, 3)}%`;
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

function statusClasses(status?: string) {
  switch (status?.toUpperCase()) {
    case "VERIFIED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "WATCH":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
    case "SHADOW":
      return "border-violet-400/20 bg-violet-400/10 text-violet-200";
    case "DEGRADED":
      return "border-orange-400/20 bg-orange-400/10 text-orange-200";
    case "RETIRED":
      return "border-red-400/20 bg-red-400/10 text-red-200";
    default:
      return "border-white/10 bg-white/[0.06] text-white/55";
  }
}

function performanceTone(value?: number | null) {
  if (value === null || value === undefined) {
    return "text-white/55";
  }

  if (value > 1.2) {
    return "text-emerald-300";
  }

  if (value >= 1) {
    return "text-cyan-200";
  }

  return "text-orange-200";
}

export default async function TradingStrategiesPage() {
  const data = await getTradingState();
  const verification = data?.verification;
  const shadow = data?.shadow_research;
  const research = data?.research;

  const strategies = [...(verification?.strategies ?? [])].sort(
    (a, b) => (b.trade_count ?? 0) - (a.trade_count ?? 0),
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 bg-[#050505]/90">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/trading" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
              N
            </div>

            <div>
              <p className="text-sm font-semibold">Nestrova Trading</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                Strategy Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/50 md:flex">
            <Link href="/trading" className="hover:text-white">
              Overview
            </Link>
            <Link href="/trading/markets" className="hover:text-white">
              Markets
            </Link>
            <Link href="/trading/strategies" className="text-white">
              Strategies
            </Link>
            <Link href="/trading/verified" className="hover:text-white">
              Verified
            </Link>
          </nav>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Shadow Only
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-violet-300/75">
          Strategy Research
        </p>

        <h1 className="mt-4 max-w-5xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
          Evaluate strategy evidence before verification.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/48">
          These results come from simulated Shadow research. They do not
          represent customer accounts, live positions, brokerage execution, or
          guaranteed future performance.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Shadow Results
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(
                verification?.total_shadow_results ??
                  shadow?.total_shadow_results,
                0,
              )}
            </p>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Strategy Models
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(
                verification?.strategy_count ??
                  research?.strategy_models_observed,
                0,
              )}
            </p>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Verified
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(verification?.verified_count, 0)}
            </p>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Watch
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(verification?.watch_count, 0)}
            </p>
          </article>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Public Performance Registry
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
              Shadow-tested strategy models.
            </h2>
          </div>

          <p className="text-sm text-white/35">
            Updated {formatDate(verification?.generated_at)}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {strategies.length > 0 ? (
            strategies.map((strategy, index) => (
              <article
                key={`${strategy.name}-${index}`}
                className="rounded-[36px] border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.065]"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-2xl font-semibold tracking-[-0.04em]">
                      {cleanLabel(strategy.name)}
                    </p>
                    <p className="mt-2 text-sm text-white/38">
                      {formatNumber(strategy.trade_count, 0)} Shadow samples
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
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                      Win Rate
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {formatPercent(strategy.win_rate)}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                      Profit Factor
                    </p>
                    <p
                      className={`mt-2 text-lg font-semibold ${performanceTone(
                        strategy.profit_factor,
                      )}`}
                    >
                      {formatNumber(strategy.profit_factor)}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                      Avg Return
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {formatReturn(strategy.average_return)}
                    </p>
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-xs leading-6 text-white/32">
                    Status is determined by Nestrova research standards.
                    Strategy formulas, private thresholds, and execution logic
                    are not exposed.
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-8 lg:col-span-2">
              <p className="font-semibold">
                Strategy performance is temporarily unavailable.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/42">
                No private strategy code or execution data is shown while
                public research data is unavailable.
              </p>
            </div>
          )}
        </div>

        <section className="mt-12 rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_420px] xl:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
                Research Boundary
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
                Public evidence without private execution logic.
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/45">
                The public platform may display aggregated Shadow samples,
                win rate, profit factor, average return, and status. It never
                exposes exact entry formulas, thresholds, live orders,
                balances, positions, API credentials, or capital allocation.
              </p>
            </div>

            <div className="rounded-[28px] border border-violet-400/20 bg-violet-400/[0.08] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                Supervisor Status
              </p>
              <p className="mt-4 text-2xl font-semibold">
                {cleanLabel(shadow?.supervisor_status)}
              </p>
              <p className="mt-2 text-sm text-white/45">
                {formatNumber(shadow?.module_count, 0)} monitored public
                research modules
              </p>
            </div>
          </div>
        </section>

        <p className="mt-8 text-xs leading-6 text-white/30">
          {data?.disclaimer ??
            "Nestrova Trading provides simulated research and educational market intelligence. It does not provide personalized financial advice or guaranteed results."}
        </p>
      </section>
    </main>
  );
}
