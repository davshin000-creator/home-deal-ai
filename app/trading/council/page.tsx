import Link from "next/link";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

type CouncilVote = {
  agent?: string;
  view?: string;
  confidence?: number;
};

type TradingState = {
  generated_at?: string;
  disclaimer?: string;
  council?: {
    consensus?: string;
    confidence?: number;
    veto?: boolean;
    agent_count?: number;
    votes?: CouncilVote[];
    source_available?: boolean;
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
      error: "AI Council is temporarily unavailable.",
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

function confidenceWidth(value?: number) {
  return `${Math.max(0, Math.min(100, value ?? 0))}%`;
}

function consensusClasses(value?: string) {
  switch (value?.toUpperCase()) {
    case "BUY":
    case "BULLISH":
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";

    case "HOLD":
    case "WATCH":
    case "SHADOW_ONLY":
      return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";

    case "NO_TRADE":
    case "ABSTAIN":
      return "border-amber-400/25 bg-amber-400/10 text-amber-200";

    case "SELL":
    case "BEARISH":
      return "border-red-400/25 bg-red-400/10 text-red-200";

    default:
      return "border-white/10 bg-white/[0.06] text-white/55";
  }
}

function agentDescription(agent?: string) {
  switch (agent) {
    case "MarketAI":
      return "Evaluates broad market structure and regime.";

    case "OpportunityAI":
      return "Ranks assets and detects research opportunities.";

    case "StrategyLeague":
      return "Reviews current strategy performance and verification status.";

    case "CapitalAI":
      return "Assesses whether current conditions justify capital exposure.";

    case "PositionAI":
      return "Reviews position context without exposing private holdings.";

    case "RiskAI":
      return "Measures downside conditions and applies public risk safeguards.";

    case "ResearchAI":
      return "Examines hypotheses, experiments, and research quality.";

    default:
      return "Contributes a specialized public research view.";
  }
}

export default async function TradingCouncilPage() {
  const { data, error } = await getTradingState();

  const council = data?.council;
  const market = data?.market;
  const votes = council?.votes ?? [];

  const activeVotes = votes.filter(
    (vote) =>
      vote.view &&
      vote.view.toUpperCase() !== "ABSTAIN",
  ).length;

  const averageConfidence =
    votes.length > 0
      ? Math.round(
          votes.reduce(
            (sum, vote) => sum + (vote.confidence ?? 0),
            0,
          ) / votes.length,
        )
      : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-violet-400/10 blur-3xl" />
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
                AI Council
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

            <Link href="/trading/council" className="text-white">
              Council
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-violet-300/70">
              Nestrova Trading
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Multiple research agents. One public consensus.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              The AI Council combines specialized public research views across
              market structure, opportunities, strategy evidence, capital,
              positions, risk, and research quality.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white/45">
            <p className="font-semibold text-white/70">
              Council update
            </p>
            <p className="mt-1">
              {formatDate(data?.generated_at)}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-9 rounded-[30px] border border-red-400/20 bg-red-400/10 p-6">
            <p className="font-semibold text-red-200">
              AI Council unavailable
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
            Consensus
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {cleanLabel(council?.consensus)}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Current combined public research conclusion.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Council Confidence
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {council?.confidence ?? 0}%
          </p>
          <p className="mt-3 text-sm text-white/42">
            Confidence assigned to the final public consensus.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Council Agents
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {council?.agent_count ?? votes.length}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Public agent views included in the Council result.
          </p>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Active Views
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            {activeVotes}
          </p>
          <p className="mt-3 text-sm text-white/42">
            Agent views that did not abstain from the current review.
          </p>
        </article>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-8 md:px-8 xl:grid-cols-[1fr_420px]">
        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300/70">
                Final Council Result
              </p>

              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
                {cleanLabel(council?.consensus)}
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/45">
                Market regime: {cleanLabel(market?.regime)} · Market risk:{" "}
                {cleanLabel(market?.risk)}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${consensusClasses(
                council?.consensus,
              )}`}
            >
              {council?.veto ? "Veto Active" : "No Veto"}
            </span>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/25 p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">
                Final confidence
              </p>
              <p className="text-3xl font-semibold">
                {council?.confidence ?? 0}%
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-400 shadow-[0_0_24px_rgba(167,139,250,0.65)]"
                style={{
                  width: confidenceWidth(council?.confidence),
                }}
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/42">
              The final consensus is decision support only and does not execute
              any trade or connect to a user brokerage account.
            </p>
          </div>
        </article>

        <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
            Council Quality
          </p>

          <div className="mt-7 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Average Agent Confidence
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {averageConfidence}%
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Market Confidence
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {market?.confidence ?? 0}%
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                Source Status
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {council?.source_available
                  ? "Available"
                  : "Unavailable"}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-10 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Council Members
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
            Specialized public research views.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {votes.length > 0 ? (
            votes.map((vote, index) => (
              <article
                key={`${vote.agent}-${index}`}
                className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/28">
                      Council Agent
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
                      {vote.agent ?? "Research Agent"}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/42">
                      {agentDescription(vote.agent)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] ${consensusClasses(
                      vote.view,
                    )}`}
                  >
                    {cleanLabel(vote.view)}
                  </span>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold">
                      Agent confidence
                    </p>
                    <p className="text-2xl font-semibold">
                      {vote.confidence ?? 0}%
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: confidenceWidth(vote.confidence),
                      }}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[34px] border border-white/10 bg-white/[0.05] p-8 text-sm text-white/42 xl:col-span-2">
              No public Council vote details are currently available.
            </div>
          )}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Council Safety Boundary
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em]">
            Public agent views are visible. Private prompts, weights, memory,
            thresholds, and execution decisions remain hidden.
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/45">
            The Council page publishes sanitized agent names, public views, and
            confidence only. It does not expose private model prompts, voting
            formulas, internal weights, account balances, orders, positions,
            or live controls.
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
            <Link
              href="/trading/verified"
              className="hover:text-white"
            >
              Verified
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
