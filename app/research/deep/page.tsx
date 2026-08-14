"use client";

import Link from "next/link";
import SaveResearchButton from "@/components/research/SaveResearchButton";
import ResearchSymbolSearch from "@/components/research/ResearchSymbolSearch";
import { useResearchUniverse } from "@/components/research/useResearchUniverse";

import {
  FormEvent,
  useState,
} from "react";

type Dimension = {
  assessment: string;
  confidence: number;
};

type DeepResearchResult = {
  ok?: boolean;
  status?: string;
  symbol?: string;
  generated_at?: string | null;
  market_regime?: string | null;
  source?: string;
  gateway_confidence?: number;

  message?: string;
  error?: string;
  code?: string;

  evidence?: {
    symbol?: string;
    name?: string | null;
    asset_type?: string | null;
    risk?: string | null;
    research_style?: string | null;
    research_version?: string | null;
    reasons?: string[];
  };

  report?: {
    executive_thesis: string;
    research_confidence: number;

    dimensions: {
      growth: Dimension;
      valuation: Dimension;
      momentum: Dimension;
      risk: Dimension;
      macro: Dimension;
      competitive_position: Dimension;
    };

    bull_case: string;
    bear_case: string;

    key_catalysts: string[];
    key_risks: string[];
    evidence_used: string[];

    final_view: string;
    limitations: string[];
  };
};

const dimensionLabels: Record<
  string,
  string
> = {
  growth: "Growth",
  valuation: "Valuation",
  momentum: "Momentum",
  risk: "Risk",
  macro: "Macro",
  competitive_position:
    "Competitive Position",
};

function ConfidenceBar({
  value,
}: {
  value: number;
}) {
  const safeValue =
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0,
      ),
    );

  return (
    <div className="mt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-white/70 transition-all duration-500"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-8 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-xl">
        ✦
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-[-0.03em]">
        Research intelligence ready
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/40">
        Enter a symbol above to generate a
        structured research view using
        Nestrova public evidence.
      </p>
    </div>
  );
}

export default function DeepResearchPage() {
  const {
    assets: researchAssets,
    loading: universeLoading,
  } = useResearchUniverse();

  const [
    symbol,
    setSymbol,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    result,
    setResult,
  ] =
    useState<DeepResearchResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState("");

  async function runResearch(
    event: FormEvent,
  ) {
    event.preventDefault();

    const normalized =
      symbol
        .trim()
        .toUpperCase();

    if (!normalized) {
      setError(
        "Enter a symbol to begin research.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response =
        await fetch(
          "/api/research/deep",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              symbol: normalized,
            }),
          },
        );

      const data =
        (await response.json()) as DeepResearchResult;

      if (!response.ok) {
        setResult(data);

        setError(
          data.error ||
            "Deep Research could not be generated.",
        );

        return;
      }

      setResult(data);
    } catch (requestError) {
      console.error(
        "deep_research_request_failed",
        requestError,
      );

      setError(
        "Could not connect to Deep Research.",
      );
    } finally {
      setLoading(false);
    }
  }

  const report =
    result?.report;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/research"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            ← Research
          </Link>

          <div className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100">
            Nestrova Pro
          </div>
        </div>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/55">
            Research Intelligence
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            Deep Research
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/45">
            Turn Nestrova&apos;s public
            research evidence into a
            structured AI research view
            without exposing private
            trading systems.
          </p>
        </section>

        <form
          onSubmit={runResearch}
          className="rounded-[30px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={symbol}
              onChange={(event) =>
                setSymbol(
                  event.target.value,
                )
              }
              placeholder="Enter symbol — NVDA, AAPL, BTC..."
              autoComplete="off"
              className="min-h-14 min-w-0 flex-1 rounded-[20px] border border-white/10 bg-black/40 px-5 text-base font-semibold uppercase outline-none transition placeholder:normal-case placeholder:text-white/25 focus:border-cyan-300/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="min-h-14 rounded-[20px] bg-white px-7 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Researching..."
                : "Run Deep Research"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-5 rounded-[22px] border border-red-300/15 bg-red-300/[0.06] px-5 py-4 text-sm text-red-100/80">
            {error}

            {result?.code ===
              "RESEARCH_PRO_REQUIRED" && (
              <Link
                href="/pricing"
                className="ml-2 font-bold text-white underline underline-offset-4"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-[32px] border border-cyan-300/10 bg-cyan-300/[0.035] p-8">
            <div className="h-3 w-36 animate-pulse rounded-full bg-white/10" />

            <div className="mt-6 h-10 w-2/3 animate-pulse rounded-xl bg-white/[0.07]" />

            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/[0.05]" />

            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-white/[0.05]" />
          </div>
        )}

        {!loading &&
          !result &&
          !error && (
            <div className="mt-8">
              <EmptyState />
            </div>
          )}

        {!loading &&
          result?.status ===
            "INSUFFICIENT_EVIDENCE" && (
            <section className="mt-8 rounded-[32px] border border-amber-300/15 bg-amber-300/[0.05] p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200/55">
                Evidence Status
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">
                Insufficient Evidence
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                {result.message}
              </p>
            </section>
          )}

        {!loading &&
          report &&
          result?.status ===
            "COMPLETE" && (
            <div className="mt-8 space-y-6">
              <section className="overflow-hidden rounded-[36px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.09] via-white/[0.035] to-black p-7 sm:p-9">
                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
                  <div>
                    <div className="mb-5 flex justify-end">
                    <SaveResearchButton
                      reportType="deep"
                      symbolA={result.symbol}
                      result={result}
                    />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/55">
                      Deep Research Report
                    </p>

                    <h2 className="mt-3 text-5xl font-black tracking-[-0.06em]">
                      {result.symbol}
                    </h2>

                    {result.evidence
                      ?.name && (
                      <p className="mt-2 text-sm text-white/40">
                        {
                          result
                            .evidence
                            .name
                        }
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[22px] border border-white/10 bg-black/30 px-5 py-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Research Confidence
                      </p>

                      <p className="mt-2 text-3xl font-black">
                        {
                          report.research_confidence
                        }
                        %
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-black/30 px-5 py-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                        Gateway Confidence
                      </p>

                      <p className="mt-2 text-3xl font-black">
                        {result.gateway_confidence ??
                          0}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Executive Thesis
                  </p>

                  <p className="mt-3 max-w-4xl text-base leading-8 text-white/70">
                    {
                      report.executive_thesis
                    }
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {result.market_regime && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/45">
                      Market:{" "}
                      {
                        result.market_regime
                      }
                    </span>
                  )}

                  {result.evidence
                    ?.risk && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/45">
                      Risk:{" "}
                      {
                        result
                          .evidence.risk
                      }
                    </span>
                  )}

                  {result.evidence
                    ?.research_style && (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/45">
                      {
                        result
                          .evidence
                          .research_style
                      }
                    </span>
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                    Research Dimensions
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                    Intelligence Breakdown
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(
                    report.dimensions,
                  ).map(
                    ([
                      key,
                      dimension,
                    ]) => (
                      <article
                        key={key}
                        className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-bold">
                            {
                              dimensionLabels[
                                key
                              ]
                            }
                          </h3>

                          <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-bold text-white/55">
                            {
                              dimension.confidence
                            }
                            %
                          </span>
                        </div>

                        <ConfidenceBar
                          value={
                            dimension.confidence
                          }
                        />

                        <p className="mt-5 text-sm leading-7 text-white/50">
                          {
                            dimension.assessment
                          }
                        </p>
                      </article>
                    ),
                  )}
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-[30px] border border-emerald-300/15 bg-emerald-300/[0.045] p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/55">
                    Bull Case
                  </p>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    {report.bull_case}
                  </p>
                </article>

                <article className="rounded-[30px] border border-red-300/15 bg-red-300/[0.045] p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-200/55">
                    Bear Case
                  </p>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    {report.bear_case}
                  </p>
                </article>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7">
                  <h3 className="text-xl font-black tracking-[-0.03em]">
                    Key Catalysts
                  </h3>

                  <div className="mt-5 space-y-3">
                    {report.key_catalysts
                      .length > 0 ? (
                      report.key_catalysts.map(
                        (
                          item,
                          index,
                        ) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[18px] border border-white/[0.07] bg-black/20 p-4 text-sm leading-6 text-white/50"
                          >
                            {item}
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-sm text-white/35">
                        Insufficient
                        evidence.
                      </p>
                    )}
                  </div>
                </article>

                <article className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7">
                  <h3 className="text-xl font-black tracking-[-0.03em]">
                    Key Risks
                  </h3>

                  <div className="mt-5 space-y-3">
                    {report.key_risks
                      .length > 0 ? (
                      report.key_risks.map(
                        (
                          item,
                          index,
                        ) => (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[18px] border border-white/[0.07] bg-black/20 p-4 text-sm leading-6 text-white/50"
                          >
                            {item}
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-sm text-white/35">
                        Insufficient
                        evidence.
                      </p>
                    )}
                  </div>
                </article>
              </section>

              <section className="rounded-[32px] border border-white/10 bg-white/[0.035] p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Evidence Used
                </p>

                <div className="mt-5 space-y-3">
                  {report.evidence_used
                    .length > 0 ? (
                    report.evidence_used.map(
                      (
                        item,
                        index,
                      ) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex gap-4 rounded-[18px] border border-white/[0.07] bg-black/20 p-4"
                        >
                          <span className="text-xs font-black text-cyan-200/60">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <p className="text-sm leading-6 text-white/50">
                            {item}
                          </p>
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-white/35">
                      No supporting
                      evidence was
                      supplied.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-[36px] border border-violet-300/15 bg-violet-300/[0.055] p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/55">
                  Final Research View
                </p>

                <p className="mt-4 max-w-4xl text-lg font-semibold leading-8 text-white/75">
                  {report.final_view}
                </p>

                {report.limitations
                  .length > 0 && (
                  <div className="mt-7 border-t border-white/10 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                      Research Limitations
                    </p>

                    <div className="mt-3 space-y-2">
                      {report.limitations.map(
                        (
                          item,
                          index,
                        ) => (
                          <p
                            key={`${item}-${index}`}
                            className="text-xs leading-5 text-white/35"
                          >
                            • {item}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </section>

              <p className="px-2 text-center text-[11px] leading-5 text-white/25">
                Nestrova Research is
                informational research
                intelligence and does not
                constitute personalized
                financial advice.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}
