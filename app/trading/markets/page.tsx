import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";
import MarketsOpportunityExplorer, {
  type MarketOpportunity,
} from "@/components/trading/MarketsOpportunityExplorer";
import MarketUniverseExplorer from "@/components/trading/MarketUniverseExplorer";

export const dynamic = "force-dynamic";

import {
  loadTradingPublicState,
} from "@/lib/trading/public-gateway";

type Opportunity = MarketOpportunity;

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
    crypto_candidate_count?: number;
    stock_candidate_count?: number;
    us_stock_source_available?: boolean;
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
    const gatewayResult =
      await loadTradingPublicState<TradingState>();

    if (
      gatewayResult.error ||
      !gatewayResult.data
    ) {
      return {
        data: null,
        error:
          gatewayResult.error ??
          "Market Intelligence is temporarily unavailable.",
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
  const normalized = String(value ?? "")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "AI Research Strategy";
  }

  const replacementCharacterCount =
    (normalized.match(/�/g) ?? []).length;

  const questionMarkCount =
    (normalized.match(/\?/g) ?? []).length;

  const looksCorrupted =
    replacementCharacterCount > 0 ||
    questionMarkCount >= 3 ||
    normalized.includes("ì") ||
    normalized.includes("ë") ||
    normalized.includes("í");

  if (looksCorrupted) {
    return "AI Research Strategy";
  }

  return normalized
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
    <UserAwareNestrovaShell
      title="Trading"
      subtitle="Explore current market conditions and ranked opportunities."
    >


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
              Compare current market conditions, AI scores,
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
            Current market reference asset.
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
            Public market confidence.
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
                Market Context
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
                Analyzed Opportunities
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {data?.opportunities?.candidate_count ?? 0}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                    Crypto
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {data?.opportunities?.crypto_candidate_count ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                    U.S. Stocks
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {data?.opportunities?.stock_candidate_count ?? 0}
                  </p>
                </div>
              </div>
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
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
            Explore Markets
          </p>

          <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
            Search the Nestrova research universe.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45">
            Explore U.S. stocks and crypto supported by Nestrova public research.
            Selecting an asset opens its public research profile and can trigger
            on-demand analysis when available.
          </p>
        </div>

        <MarketUniverseExplorer />
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

        <MarketsOpportunityExplorer
          opportunities={opportunities}
        />
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
            AI scores are derived from sanitized public market research
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

      <SiteFooter />
    </UserAwareNestrovaShell>
  );
}

