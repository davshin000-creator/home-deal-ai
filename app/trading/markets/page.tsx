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

type TradingState = {
  generated_at?: string;
  disclaimer?: string;
  market?: {
    base_asset?: string;
    regime?: string;
    confidence?: number;
    risk?: string;
  };
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

export default async function TradingMarketsPage() {
  const data = await getTradingState();
  const items = data?.opportunities?.top_opportunities ?? [];

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
                Market Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/50 md:flex">
            <Link href="/trading" className="hover:text-white">
              Overview
            </Link>
            <Link href="/trading/markets" className="text-white">
              Markets
            </Link>
            <Link href="/trading/strategies" className="hover:text-white">
              Strategies
            </Link>
            <Link href="/trading/verified" className="hover:text-white">
              Verified
            </Link>
          </nav>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Read Only
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300/70">
          Market Scanner
        </p>

        <h1 className="mt-4 max-w-5xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
          Compare public market intelligence across tracked assets.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/48">
          Opportunity scores are research indicators derived from the public
          World Model. They are not trade recommendations or guaranteed
          forecasts.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Assets Scanned
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {data?.opportunities?.candidate_count ?? 0}
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Base Asset
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {data?.market?.base_asset ?? "—"}
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Global Regime
            </p>
            <p className="mt-3 text-2xl font-semibold">
              {cleanLabel(data?.market?.regime)}
            </p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Confidence
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {data?.market?.confidence ?? 0}%
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.05]">
          <div className="hidden grid-cols-[0.7fr_1fr_1fr_0.8fr_1.1fr] gap-4 border-b border-white/10 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 md:grid">
            <p>Asset</p>
            <p>Opportunity</p>
            <p>Regime</p>
            <p>Risk</p>
            <p>Research Style</p>
          </div>

          {items.length > 0 ? (
            items.map((item, index) => (
              <article
                key={`${item.symbol}-${index}`}
                className="grid gap-4 border-b border-white/10 px-6 py-6 last:border-b-0 md:grid-cols-[0.7fr_1fr_1fr_0.8fr_1.1fr] md:items-center"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Asset
                  </p>
                  <p className="mt-1 text-xl font-semibold md:mt-0">
                    {item.symbol ?? "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Opportunity
                  </p>
                  <div className="mt-2 flex items-center gap-3 md:mt-0">
                    <p className="font-semibold">
                      {item.opportunity_score ?? 0}/100
                    </p>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, item.opportunity_score ?? 0),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Regime
                  </p>
                  <p className="mt-1 text-sm text-white/60 md:mt-0">
                    {cleanLabel(item.regime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
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
                  <p className="text-xs uppercase tracking-[0.14em] text-white/30 md:hidden">
                    Research Style
                  </p>
                  <p className="mt-1 text-sm text-white/48 md:mt-0">
                    {item.research_style ?? "Unavailable"}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="p-8">
              <p className="font-semibold">
                Market intelligence is temporarily unavailable.
              </p>
              <p className="mt-2 text-sm text-white/42">
                The page remains available without exposing private system
                information.
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-xs leading-6 text-white/30">
          {data?.disclaimer ??
            "Nestrova Trading provides simulated research and educational market intelligence. It does not provide personalized financial advice or guaranteed results."}
        </p>
      </section>
    </main>
  );
}
