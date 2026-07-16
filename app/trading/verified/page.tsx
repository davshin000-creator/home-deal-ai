import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

type Strategy = {
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
    strategies?: Strategy[];
    generated_at?: string | null;
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
      error: "Verified Registry is temporarily unavailable.",
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
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
    case "WATCH":
      return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
    case "SHADOW":
      return "border-violet-400/25 bg-violet-400/10 text-violet-200";
    case "RESEARCH":
      return "border-white/10 bg-white/[0.06] text-white/55";
    case "DEGRADED":
      return "border-orange-400/25 bg-orange-400/10 text-orange-200";
    case "RETIRED":
      return "border-red-400/25 bg-red-400/10 text-red-200";
    default:
      return "border-white/10 bg-white/[0.06] text-white/55";
  }
}

function statusDescription(status: string) {
  switch (status) {
    case "VERIFIED":
      return "Meets the current public Nestrova verification standard.";
    case "WATCH":
      return "Passed initial checks and is gathering more evidence.";
    case "SHADOW":
      return "Actively tracked through simulated research.";
    case "RESEARCH":
      return "Still in early research and sample collection.";
    case "DEGRADED":
      return "Previously stronger evidence has weakened.";
    case "RETIRED":
      return "No longer included in active public research.";
    default:
      return "Current public research status.";
  }
}

function evidenceScore(strategy: Strategy) {
  const tradeScore = Math.min((strategy.trade_count ?? 0) / 3, 35);
  const winScore = Math.min((strategy.win_rate ?? 0) * 0.35, 35);
  const pfScore = Math.min((strategy.profit_factor ?? 0) * 12, 30);

  return Math.max(
    0,
    Math.min(100, Math.round(tradeScore + winScore + pfScore)),
  );
}

const statusOrder = [
  "VERIFIED",
  "WATCH",
  "SHADOW",
  "RESEARCH",
  "DEGRADED",
  "RETIRED",
];

function RegistryCard({
  strategy,
}: {
  strategy: Strategy;
}) {
  const status = strategy.status?.toUpperCase() ?? "RESEARCH";
  const score = evidenceScore(strategy);

  return (
    <article className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">
            Strategy Model
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
            {cleanLabel(strategy.name)}
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/40">
            {statusDescription(status)}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] ${statusClasses(
            status,
          )}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6 rounded-[26px] border border-white/10 bg-black/20 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">
              Public Evidence
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {score}
              <span className="text-sm text-white/28"> / 100</span>
            </p>
          </div>

          <p className="text-sm text-white/40">
            {formatNumber(strategy.trade_count, 0)} samples
          </p>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.55)]"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
            Trades
          </p>
          <p className="mt-2 font-semibold">
            {formatNumber(strategy.trade_count, 0)}
          </p>
        </div>

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
            {formatReturn(strategy.average_return)}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function VerifiedStrategiesPage() {
  const { data, error } = await getTradingState();

  const verification = data?.verification;
  const strategies = verification?.strategies ?? [];

  const grouped = Object.fromEntries(
    statusOrder.map((status) => [
      status,
      strategies.filter(
        (strategy) =>
          (strategy.status ?? "RESEARCH").toUpperCase() === status,
      ),
    ]),
  ) as Record<string, Strategy[]>;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-[-300px] top-16 h-[800px] w-[800px] rounded-full bg-cyan-400/10 blur-3xl" />
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
                Verified Registry
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link href="/trading" className="transition hover:text-white">
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
            <Link href="/trading/verified" className="text-white">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-emerald-300/70">
              Nestrova Trading
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Verification status built on public evidence.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              Strategies move through research, Shadow, watch, verification,
              degradation, and retirement states. Public status never exposes
              private execution rules or account information.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/45">
            <p className="font-semibold text-white/70">
              Registry update
            </p>
            <p className="mt-1">
              {formatDate(
                verification?.generated_at ?? data?.generated_at,
              )}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-9 rounded-[30px] border border-red-400/20 bg-red-400/10 p-6">
            <p className="font-semibold text-red-200">
              Verified Registry unavailable
            </p>
            <p className="mt-2 text-sm text-red-100/65">
              {error}
            </p>
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-5 px-5 py-8 sm:grid-cols-2 md:px-8 xl:grid-cols-4">
        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Verified
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(verification?.verified_count, 0)}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Strategies meeting the current public standard.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Watch
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(verification?.watch_count, 0)}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Models collecting more evidence before promotion.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Registry Models
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(verification?.strategy_count, 0)}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Total public strategy models currently included.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Shadow Results
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(
              verification?.total_shadow_results,
              0,
            )}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Simulated research observations behind the registry.
          </p>
        </article>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.045] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Verification Path
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {statusOrder.map((status, index) => (
              <div
                key={status}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-[10px] text-white/25">
                  0{index + 1}
                </p>
                <p className="mt-3 font-semibold">
                  {cleanLabel(status)}
                </p>
                <p className="mt-2 text-xs text-white/35">
                  {grouped[status].length} model
                  {grouped[status].length === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {statusOrder.map((status) => {
        const items = grouped[status];

        if (items.length === 0) {
          return null;
        }

        return (
          <section
            key={status}
            className="relative mx-auto max-w-[1480px] px-5 py-10 md:px-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  Registry Status
                </p>

                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
                  {cleanLabel(status)}
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/42">
                  {statusDescription(status)}
                </p>
              </div>

              <p className="text-sm text-white/35">
                {items.length} model{items.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="mt-7 grid gap-5 xl:grid-cols-2">
              {items.map((strategy, index) => (
                <RegistryCard
                  key={`${status}-${strategy.name}-${index}`}
                  strategy={strategy}
                />
              ))}
            </div>
          </section>
        );
      })}

      {strategies.length === 0 ? (
        <section className="relative mx-auto max-w-[1480px] px-5 py-10 md:px-8">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-8 text-sm text-white/42">
            No public verification records are currently available.
          </div>
        </section>
      ) : null}

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Meaning of Verified
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em]">
            Verified means the Nestrova research standard was met. It does not
            mean future profit is guaranteed.
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/45">
            Verification reflects available sample size and public performance
            evidence at the recorded update time. Market conditions can change,
            and previously verified models may later be degraded or retired.
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
              href="/trading/markets"
              className="hover:text-white"
            >
              Markets
            </Link>
            <Link
              href="/trading/strategies"
              className="hover:text-white"
            >
              Strategies
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
