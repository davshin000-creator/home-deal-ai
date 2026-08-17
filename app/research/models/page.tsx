export const dynamic = "force-dynamic";

import {
  loadResearchPublicState,
  type ResearchPublicState,
} from "@/lib/research/public-gateway";


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

function cleanLabel(value?: string) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

export default async function ResearchModelsPage() {
  const state: ResearchPublicState | null =
    await loadResearchPublicState();

  const opportunities =
    getPublicOpportunities(
      state,
    );

  const modelMap = new Map<
    string,
    PublicOpportunity[]
  >();

  for (const item of opportunities) {
    const version =
      item.research_version ||
      "Public Research Engine";

    const existing =
      modelMap.get(version) ?? [];

    existing.push(item);

    modelMap.set(
      version,
      existing,
    );
  }

  const models = [...modelMap.entries()]
    .map(([version, items]) => {
      const averageConfidence =
        items.length > 0
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

      const styles = [
        ...new Set(
          items
            .map(
              (item) =>
                item.research_style,
            )
            .filter(Boolean),
        ),
      ];

      return {
        version,
        items,
        averageConfidence,
        evidenceCount,
        styles,
      };
    })
    .sort(
      (a, b) =>
        b.averageConfidence -
        a.averageConfidence,
    );

  const totalModels =
    models.length;

  const totalCoverage =
    models.reduce(
      (sum, model) =>
        sum + model.items.length,
      0,
    );

  const totalEvidence =
    models.reduce(
      (sum, model) =>
        sum + model.evidenceCount,
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
              Model Evolution
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
              Track the research engines behind the signals.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/45">
              Follow which public research versions
              are active, what styles they support,
              how many assets they cover, and the
              confidence of their currently surfaced
              intelligence.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Active Engines",
                totalModels,
              ],
              [
                "Asset Coverage",
                totalCoverage,
              ],
              [
                "Evidence Signals",
                totalEvidence,
              ],
              [
                "Gateway Schema",
                state?.schema_version ||
                  "Unknown",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
                  {label}
                </p>

                <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/60">
              Active Research Engines
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
              Current model landscape.
            </h2>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/35">
            Updated {generatedAt}
          </div>
        </div>

        {models.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {models.map(
              (model, index) => (
                <article
                  key={model.version}
                  className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-200/50">
                        Engine {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </p>

                      <h2 className="mt-3 break-words text-2xl font-black tracking-[-0.04em]">
                        {model.version}
                      </h2>
                    </div>

                    <div className="shrink-0 rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200/40">
                        Confidence
                      </p>

                      <p className="mt-1 text-xl font-black text-cyan-100">
                        {
                          model.averageConfidence
                        }
                        %
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">
                        Coverage
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {
                          model.items
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
                          model.evidenceCount
                        }
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/28">
                        Styles
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {
                          model.styles
                            .length
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                      Research Styles
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {model.styles.length >
                      0 ? (
                        model.styles.map(
                          (style) => (
                            <span
                              key={style}
                              className="rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-xs font-semibold text-violet-100/70"
                            >
                              {cleanLabel(
                                style,
                              )}
                            </span>
                          ),
                        )
                      ) : (
                        <span className="text-sm text-white/30">
                          No public style
                          metadata.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {model.items
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
                            className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 p-4 transition hover:border-violet-300/20"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-bold">
                                {item.symbol ||
                                  item.name ||
                                  "Discovery"}
                              </p>

                              <p className="mt-1 truncate text-xs text-white/30">
                                {cleanLabel(
                                  item.research_style,
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
          <div className="mt-8 rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-semibold text-white/65">
              No public model metadata is available.
            </p>

            <p className="mt-2 text-sm text-white/30">
              Model cards will appear when the
              gateway publishes research versions.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1480px] px-5 pb-16 md:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Research State
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/38">
                  Strategy Mode
                </span>

                <span className="text-sm font-bold">
                  {cleanLabel(
                    state?.research
                      ?.strategy_mode,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/38">
                  Research Count
                </span>

                <span className="text-sm font-bold">
                  {state?.research
                    ?.research_count ??
                    "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/38">
                  Verified Count
                </span>

                <span className="text-sm font-bold">
                  {state?.research
                    ?.verified_count ??
                    "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-violet-300/15 bg-violet-300/[0.05] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/60">
              What Evolution Means
            </p>

            <p className="mt-4 text-sm leading-7 text-white/42">
              This page tracks public research
              versions, coverage, evidence, and
              current confidence. It does not claim
              that a model autonomously retrained or
              improved unless the public gateway
              explicitly publishes that information.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                [
                  "Observe",
                  "Version and coverage",
                ],
                [
                  "Compare",
                  "Confidence and evidence",
                ],
                [
                  "Verify",
                  "Public research state",
                ],
              ].map(
                ([title, body]) => (
                  <div
                    key={title}
                    className="rounded-[18px] border border-white/10 bg-black/20 p-4"
                  >
                    <p className="font-bold">
                      {title}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/30">
                      {body}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

