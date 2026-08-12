export const dynamic = "force-dynamic";

import ResearchUsagePanel from "@/components/research/ResearchUsagePanel";
import Link from "next/link";

type PublicOpportunity = {
  symbol?: string;
  name?: string;
  asset_type?: string;
  score?: number;
  weighted_score?: number;
  confidence?: number;
  risk?: string;
  status?: string;
  research_style?: string;
  research_version?: string;
  research_reasons?: string[];
};

type PublicState = {
  schema_version?: string;
  generated_at?: string;
  opportunities?: PublicOpportunity[];
  top_opportunities?: PublicOpportunity[];
  market?: {
    regime?: string;
    research_style?: string;
  };
  research?: {
    strategy_mode?: string;
    total_count?: number;
    verified_count?: number;
    research_count?: number;
  };
};

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrova.com";

function normalizeOpportunityList(
  value: unknown,
): PublicOpportunity[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const objectValue =
      value as Record<string, unknown>;

    const nestedKeys = [
      "items",
      "candidates",
      "opportunities",
      "stocks",
      "crypto",
      "data",
    ];

    for (const key of nestedKeys) {
      const nested =
        objectValue[key];

      if (Array.isArray(nested)) {
        return nested as PublicOpportunity[];
      }
    }

    return Object.values(
      objectValue,
    ).filter(
      (item): item is PublicOpportunity =>
        Boolean(
          item &&
          typeof item === "object",
        ),
    );
  }

  return [];
}

function cleanLabel(value?: string) {
  if (!value) return "Research";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function confidenceTone(
  confidence: number,
) {
  if (confidence >= 80) {
    return {
      label: "High Confidence",
      className:
        "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    };
  }

  if (confidence >= 65) {
    return {
      label: "Moderate Confidence",
      className:
        "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    };
  }

  return {
    label: "Monitoring",
    className:
      "border-amber-300/20 bg-amber-300/10 text-amber-100",
  };
}

async function loadResearchState(): Promise<PublicState | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/core/state`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      "research_state_failed",
      error,
    );

    return null;
  }
}

export default async function ResearchPage() {
  const state =
    await loadResearchState();

  const rawOpportunities =
    normalizeOpportunityList(
      state?.top_opportunities,
    );

  const fallbackOpportunities =
    normalizeOpportunityList(
      state?.opportunities,
    );

  const discoveries =
    [
      ...(
        rawOpportunities.length > 0
          ? rawOpportunities
          : fallbackOpportunities
      ),
    ]
      .sort(
        (a, b) =>
          Number(
            b.confidence ??
              b.weighted_score ??
              b.score ??
              0,
          ) -
          Number(
            a.confidence ??
              a.weighted_score ??
              a.score ??
              0,
          ),
      )
      .slice(0, 12);

  const averageConfidence =
    discoveries.length > 0
      ? Math.round(
          discoveries.reduce(
            (sum, item) =>
              sum +
              Number(
                item.confidence ??
                  item.weighted_score ??
                  item.score ??
                  0,
              ),
            0,
          ) / discoveries.length,
        )
      : 0;

  const evidenceCount =
    discoveries.reduce(
      (sum, item) =>
        sum +
        (item.research_reasons?.length ??
          0),
      0,
    );

  const generatedAt =
    state?.generated_at
      ? new Date(
          state.generated_at,
        ).toLocaleString("en-US")
      : "Unavailable";

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-400/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8 md:py-24">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/80">
                <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.75)]" />
                Continuous Discovery
              </div>

              <h1 className="mt-7 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
                Nestrova Research
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/48">
                Follow public, aggregated discoveries
                produced by Nestrova research systems.
                Patterns, evidence, confidence, and
                evolving intelligence in one layer.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/28">
                Research Source
              </p>

              <p className="mt-2 text-sm font-semibold text-white/70">
                Public Nestrova Gateway
              </p>

              <p className="mt-2 text-xs text-white/30">
                Updated: {generatedAt}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Active Discoveries",
                discoveries.length,
              ],
              [
                "Evidence Signals",
                evidenceCount,
              ],
              [
                "Avg Confidence",
                `${averageConfidence}%`,
              ],
              [
                "Market Regime",
                cleanLabel(
                  state?.market?.regime,
                ),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
                  {label}
                </p>

                <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-white/82">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-12 md:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/65">
              Research Feed
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-4xl">
              Latest discoveries.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Trading",
              "Patterns",
              "Evidence",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/38"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {discoveries.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {discoveries.map(
              (item, index) => {
                const confidence =
                  Math.round(
                    Number(
                      item.confidence ??
                        item.weighted_score ??
                        item.score ??
                        0,
                    ),
                  );

                const tone =
                  confidenceTone(
                    confidence,
                  );

                const reasons =
                  item.research_reasons ??
                  [];

                return (
                  <article
                    key={`${item.symbol ?? "research"}-${index}`}
                    className="group flex min-w-0 flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-200/55">
                          {cleanLabel(
                            item.asset_type,
                          )}
                        </p>

                        <h3 className="mt-3 truncate text-2xl font-black tracking-[-0.04em]">
                          {item.symbol ||
                            item.name ||
                            "Market Discovery"}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] ${tone.className}`}
                      >
                        {tone.label}
                      </span>
                    </div>

                    <div className="mt-6 rounded-[20px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                        Research Pattern
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-6 text-white/66">
                        {cleanLabel(
                          item.research_style,
                        )}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                          Confidence
                        </p>

                        <p className="mt-2 text-xl font-black text-cyan-100">
                          {confidence}%
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                          Evidence
                        </p>

                        <p className="mt-2 text-xl font-black text-violet-100">
                          {reasons.length}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      {reasons
                        .slice(0, 3)
                        .map((reason) => (
                          <div
                            key={reason}
                            className="flex gap-3 text-sm leading-6 text-white/42"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                            <span>
                              {reason}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <Link
                        href={
                          item.symbol
                            ? `/trading/assets/${encodeURIComponent(
                                item.symbol,
                              )}`
                            : "/trading/markets"
                        }
                        className="flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-white/65 transition group-hover:text-white"
                      >
                        View intelligence
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-semibold text-white/65">
              No public discoveries are available
              right now.
            </p>

            <p className="mt-2 text-sm text-white/32">
              The Research feed will populate when
              the public gateway publishes new
              research intelligence.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1480px] px-5 pb-16 md:px-8">
        <div className="mb-8">
            <ResearchUsagePanel />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title:
                "Deep Research",
              description:
                "Generate structured Pro research reports grounded only in Nestrova public evidence.",
              href:
                "/research/deep",
              badge:
                "PRO",
            },
            {
              title:
                "Research Council",
              description:
                "Convene five evidence-grounded AI research perspectives and inspect their final consensus.",
              href:
                "/research/council",
              badge:
                "PRO",
            },
            {
              title:
                "Research Compare",
              description:
                "Compare two research subjects side by side using Nestrova public evidence, confidence, and risk signals.",
              href:
                "/research/compare",
              badge:
                "PRO",
            },
            {
              title:
                "Saved Research",
              description:
                "Return to your saved Deep Research, Council, and Compare results from one private research library.",
              href:
                "/research/saved",
              badge:
                "PRO",
            },
            {
              title:
                "Research Watch",
              description:
                "Track confidence, risk, research style, and engine changes across up to 20 research subjects.",
              href:
                "/research/watch",
              badge:
                "PRO",
            },
            {
              title:
                "Research Alerts",
              description:
                "Review meaningful confidence, risk, research-style, and research-engine changes detected across your watchlist.",
              href:
                "/research/alerts",
              badge:
                "PRO",
            },
            {
              title:
                "Pattern Discovery",
              description:
                "Surface recurring market structures, regime changes, and research signals.",
              href:
                "/research/patterns",
            },
            {
              title:
                "Evidence Tracking",
              description:
                "Trace the public reasons and confidence supporting each surfaced discovery.",
              href:
                "/research/evidence",
            },
            {
              title:
                "Model Evolution",
              description:
                "Follow how Nestrova research engines, strategy modes, and verification states evolve.",
              href:
                "/research/models",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-300/20 hover:bg-violet-300/[0.04]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/55">
                  Research System
                </p>

                {"badge" in item && item.badge ? (
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-100">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/38">
                {item.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-white/65">
                Explore →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/65">
            Public Research Boundary
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/42">
            Nestrova Research displays sanitized,
            read-only intelligence from public
            research systems. It does not expose
            private accounts, positions, execution
            controls, private strategies, or
            brokerage credentials.
          </p>
        </div>
      </section>
    </main>
  );
}

