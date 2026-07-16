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

function registryDescription(status?: string) {
  switch (status?.toUpperCase()) {
    case "VERIFIED":
      return "Passed current Nestrova public verification standards.";
    case "WATCH":
      return "Promising research model still under observation.";
    case "SHADOW":
      return "Actively collecting simulated performance evidence.";
    case "DEGRADED":
      return "Performance weakened and requires renewed validation.";
    case "RETIRED":
      return "Removed from active research consideration.";
    default:
      return "Early-stage research model with limited public evidence.";
  }
}

export default async function VerifiedStrategiesPage() {
  const data = await getTradingState();
  const verification = data?.verification;

  const strategies = verification?.strategies ?? [];

  const verified = strategies.filter(
    (strategy) => strategy.status?.toUpperCase() === "VERIFIED",
  );

  const watch = strategies.filter(
    (strategy) => strategy.status?.toUpperCase() === "WATCH",
  );

  const shadow = strategies.filter(
    (strategy) => strategy.status?.toUpperCase() === "SHADOW",
  );

  const other = strategies.filter(
    (strategy) =>
      !["VERIFIED", "WATCH", "SHADOW"].includes(
        strategy.status?.toUpperCase() ?? "",
      ),
  );

  const registryGroups = [
    {
      title: "Verified",
      description:
        "Models currently meeting Nestrova public research standards.",
      items: verified,
    },
    {
      title: "Watch",
      description:
        "Promising models that require continued observation.",
      items: watch,
    },
    {
      title: "Shadow",
      description:
        "Models still collecting simulated evidence.",
      items: shadow,
    },
    {
      title: "Research",
      description:
        "Early-stage, degraded, retired, or unclassified models.",
      items: other,
    },
  ];

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
                Verified Registry
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
            <Link href="/trading/strategies" className="hover:text-white">
              Strategies
            </Link>
            <Link href="/trading/verified" className="text-white">
              Verified
            </Link>
          </nav>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Read Only
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300/75">
          Verification Registry
        </p>

        <h1 className="mt-4 max-w-5xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
          Track how strategies move through research stages.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/48">
          Verified status means a model passed current Nestrova public research
          standards. It does not guarantee future performance and does not
          authorize live customer trading.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Total Strategies
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(verification?.strategy_count, 0)}
            </p>
          </article>

          <article className="rounded-[30px] border border-emerald-400/20 bg-emerald-400/[0.07] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300/60">
              Verified
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(verification?.verified_count, 0)}
            </p>
          </article>

          <article className="rounded-[30px] border border-cyan-400/20 bg-cyan-400/[0.07] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/60">
              Watch
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(verification?.watch_count, 0)}
            </p>
          </article>

          <article className="rounded-[30px] border border-violet-400/20 bg-violet-400/[0.07] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-violet-300/60">
              Shadow Results
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {formatNumber(verification?.total_shadow_results, 0)}
            </p>
          </article>
        </div>

        <div className="mt-12 rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
            Registry Lifecycle
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              "Research",
              "Shadow",
              "Watch",
              "Verified",
              "Degraded",
              "Retired",
            ].map((status, index) => (
              <div
                key={status}
                className="rounded-[26px] border border-white/10 bg-black/20 p-5"
              >
                <p className="text-xs text-white/25">
                  0{index + 1}
                </p>
                <p className="mt-4 text-lg font-semibold">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {registryGroups.map((group) => (
            <section key={group.title}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
                    Registry Group
                  </p>

                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
                    {group.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/42">
                    {group.description}
                  </p>
                </div>

                <p className="text-sm text-white/35">
                  {group.items.length} models
                </p>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                {group.items.length > 0 ? (
                  group.items.map((strategy, index) => (
                    <article
                      key={`${group.title}-${strategy.name}-${index}`}
                      className="rounded-[36px] border border-white/10 bg-white/[0.05] p-6"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-2xl font-semibold tracking-[-0.04em]">
                            {cleanLabel(strategy.name)}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-white/38">
                            {registryDescription(strategy.status)}
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

                      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Samples
                          </p>
                          <p className="mt-2 font-semibold">
                            {formatNumber(strategy.trade_count, 0)}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Win Rate
                          </p>
                          <p className="mt-2 font-semibold">
                            {formatPercent(strategy.win_rate)}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Profit Factor
                          </p>
                          <p className="mt-2 font-semibold">
                            {formatNumber(strategy.profit_factor)}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Avg Return
                          </p>
                          <p className="mt-2 font-semibold">
                            {formatReturn(strategy.average_return)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-white/30">
                        Public status and aggregate performance only. Exact
                        strategy formulas, thresholds, prompts, execution
                        controls, and private account data remain confidential.
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-7 text-sm text-white/42 lg:col-span-2">
                    No strategies currently appear in this registry stage.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-[42px] border border-emerald-400/20 bg-emerald-400/[0.07] p-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_400px] xl:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300/70">
                Verification Meaning
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
                Verified means researched, not guaranteed.
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/48">
                A Verified model has met current sample, performance, stability,
                and risk standards used by Nestrova. Verification can later be
                removed when evidence weakens. It is not a promise of profit or
                personalized investment advice.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                Registry Updated
              </p>
              <p className="mt-4 text-lg font-semibold">
                {formatDate(verification?.generated_at)}
              </p>
              <p className="mt-3 text-sm text-white/42">
                Public mode: {data?.system?.public_mode ?? "Unavailable"}
              </p>
              <p className="mt-1 text-sm text-white/42">
                Execution exposed:{" "}
                {data?.system?.execution_exposed === false
                  ? "No"
                  : "Unavailable"}
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
