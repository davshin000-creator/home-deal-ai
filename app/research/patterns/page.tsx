export const dynamic = "force-dynamic";


import {
  getPublicOpportunities,
} from "@/lib/research/publicResearch";

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
  generated_at?: string;
  opportunities?: PublicOpportunity[];
  top_opportunities?: PublicOpportunity[];
};

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrova.com";

function cleanLabel(value?: string) {
  if (!value) return "Unclassified";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

async function loadState(): Promise<PublicState | null> {
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
      "research_patterns_failed",
      error,
    );

    return null;
  }
}

export default async function ResearchPatternsPage() {
  const state = await loadState();

  const opportunities =
    getPublicOpportunities(
      state,
    );

  const groups = new Map<
    string,
    PublicOpportunity[]
  >();

  for (const item of opportunities) {
    const key =
      item.research_style ||
      "unclassified";

    const existing =
      groups.get(key) ?? [];

    existing.push(item);

    groups.set(key, existing);
  }

  const patterns = [...groups.entries()]
    .map(([style, items]) => {
      const averageConfidence =
        items.length
          ? Math.round(
              items.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.confidence ??
                      item.weighted_score ??
                      item.score ??
                      0,
                  ),
                0,
              ) / items.length,
            )
          : 0;

      const evidenceCount =
        items.reduce(
          (sum, item) =>
            sum +
            (
              item.research_reasons ??
              []
            ).length,
          0,
        );

      return {
        style,
        items,
        averageConfidence,
        evidenceCount,
      };
    })
    .sort(
      (a, b) =>
        b.averageConfidence -
        a.averageConfidence,
    );

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1480px] px-5 py-16 md:px-8 md:py-20">
          <Link
            href="/research"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            ← Research Feed
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/65">
              Pattern Discovery
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
              Find repeated intelligence.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/45">
              Nestrova groups public research
              opportunities by recurring research
              style, confidence, and supporting
              evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-12 md:px-8">
        {patterns.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {patterns.map(
              (pattern, index) => (
                <article
                  key={pattern.style}
                  className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-200/50">
                        Pattern #{index + 1}
                      </p>

                      <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">
                        {cleanLabel(
                          pattern.style,
                        )}
                      </h2>
                    </div>

                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold text-cyan-100">
                      {
                        pattern.averageConfidence
                      }
                      %
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">
                        Assets
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {
                          pattern.items
                            .length
                        }
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">
                        Evidence
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {
                          pattern.evidenceCount
                        }
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">
                        Confidence
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {
                          pattern.averageConfidence
                        }
                        %
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {pattern.items
                      .slice(0, 5)
                      .map(
                        (
                          item,
                          itemIndex,
                        ) => (
                          <Link
                            key={`${item.symbol}-${itemIndex}`}
                            href={
                              item.symbol
                                ? `/trading/assets/${encodeURIComponent(
                                    item.symbol,
                                  )}`
                                : "/trading/markets"
                            }
                            className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 p-4 transition hover:border-violet-300/20 hover:bg-violet-300/[0.04]"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-bold">
                                {item.symbol ||
                                  item.name ||
                                  "Discovery"}
                              </p>

                              <p className="mt-1 truncate text-xs text-white/32">
                                {cleanLabel(
                                  item.asset_type,
                                )}{" "}
                                ·{" "}
                                {cleanLabel(
                                  item.risk,
                                )}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-bold text-cyan-100">
                              {Math.round(
                                Number(
                                  item.confidence ??
                                    item.weighted_score ??
                                    item.score ??
                                    0,
                                ),
                              )}
                              %
                            </p>
                          </Link>
                        ),
                      )}
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-semibold text-white/65">
              No research patterns are available.
            </p>

            <p className="mt-2 text-sm text-white/30">
              Patterns will appear as the public
              research gateway publishes structured
              research styles.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1480px] px-5 pb-16 md:px-8">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            How Pattern Discovery Works
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              [
                "01",
                "Group",
                "Research opportunities sharing the same public research style are grouped.",
              ],
              [
                "02",
                "Measure",
                "Confidence and supporting evidence are aggregated across the pattern.",
              ],
              [
                "03",
                "Track",
                "Patterns can later be compared over time to detect strengthening or weakening behavior.",
              ],
            ].map(
              ([step, title, body]) => (
                <div
                  key={step}
                  className="rounded-[20px] border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-xs font-bold text-violet-200/55">
                    {step}
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/36">
                    {body}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

