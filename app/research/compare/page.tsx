"use client";

import Link from "next/link";
import SaveResearchButton from "@/components/research/SaveResearchButton";

import {
  FormEvent,
  useState,
} from "react";

type Winner =
  | "ASSET_A"
  | "ASSET_B"
  | "TIE";

type CompareResult = {
  ok?: boolean;
  status?: string;

  symbol_a?: string;
  symbol_b?: string;

  generated_at?: string | null;
  market_regime?: string | null;

  error?: string;
  code?: string;
  message?: string;
  missing_symbols?: string[];

  evidence?: {
    asset_a?: {
      symbol?: string;
      name?: string | null;
      asset_type?: string | null;
      confidence?: number;
      risk?: string | null;
      status?: string | null;
      research_style?: string | null;
      research_version?: string | null;
      reasons?: string[];
    };

    asset_b?: {
      symbol?: string;
      name?: string | null;
      asset_type?: string | null;
      confidence?: number;
      risk?: string | null;
      status?: string | null;
      research_style?: string | null;
      research_version?: string | null;
      reasons?: string[];
    };
  };

  comparison?: {
    winner: Winner;
    comparison_confidence: number;
    summary: string;

    categories: Record<
      string,
      {
        winner: Winner;
        reason: string;
      }
    >;

    asset_a_case: string;
    asset_b_case: string;

    key_difference: string;
    final_view: string;
    limitations: string[];
  };
};

const categoryLabels: Record<
  string,
  string
> = {
  research_confidence:
    "Research Confidence",

  evidence_strength:
    "Evidence Strength",

  risk_profile:
    "Risk Profile",

  research_signal:
    "Research Signal",
};

function winnerLabel(
  winner: Winner | undefined,
  symbolA: string,
  symbolB: string,
) {
  if (winner === "ASSET_A") {
    return symbolA;
  }

  if (winner === "ASSET_B") {
    return symbolB;
  }

  return "Tie";
}

function winnerStyle(
  winner?: Winner,
) {
  if (winner === "TIE") {
    return "border-white/10 bg-white/[0.05] text-white/60";
  }

  return "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100";
}

export default function ResearchComparePage() {
  const [
    symbolA,
    setSymbolA,
  ] = useState("");

  const [
    symbolB,
    setSymbolB,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    result,
    setResult,
  ] =
    useState<CompareResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState("");

  async function runCompare(
    event: FormEvent,
  ) {
    event.preventDefault();

    const a =
      symbolA.trim().toUpperCase();

    const b =
      symbolB.trim().toUpperCase();

    if (!a || !b) {
      setError(
        "Enter two symbols to compare.",
      );
      return;
    }

    if (a === b) {
      setError(
        "Choose two different symbols.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response =
        await fetch(
          "/api/research/compare",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              symbol_a: a,
              symbol_b: b,
            }),
          },
        );

      const data =
        (await response.json()) as CompareResult;

      if (!response.ok) {
        setResult(data);

        setError(
          data.error ||
            "Research Compare could not be generated.",
        );

        return;
      }

      setResult(data);
    } catch (requestError) {
      console.error(
        "research_compare_request_failed",
        requestError,
      );

      setError(
        "Could not connect to Research Compare.",
      );
    } finally {
      setLoading(false);
    }
  }

  const comparison =
    result?.comparison;

  const evidenceA =
    result?.evidence?.asset_a;

  const evidenceB =
    result?.evidence?.asset_b;

  const displayA =
    result?.symbol_a ||
    symbolA.toUpperCase();

  const displayB =
    result?.symbol_b ||
    symbolB.toUpperCase();

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/research"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            ← Research
          </Link>

          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">
            Nestrova Pro
          </span>
        </div>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/55">
            Comparative Intelligence
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            Research Compare
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/45">
            Compare two research subjects
            using only Nestrova&apos;s
            current public evidence,
            confidence, risk, and research
            signals.
          </p>
        </section>

        <form
          onSubmit={runCompare}
          className="rounded-[30px] border border-white/10 bg-white/[0.04] p-3"
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-center">
            <input
              value={symbolA}
              onChange={(event) =>
                setSymbolA(
                  event.target.value,
                )
              }
              placeholder="First symbol"
              autoComplete="off"
              className="min-h-14 min-w-0 rounded-[20px] border border-white/10 bg-black/40 px-5 text-base font-semibold uppercase outline-none placeholder:normal-case placeholder:text-white/25 focus:border-cyan-300/30"
            />

            <div className="hidden text-center text-xs font-black uppercase tracking-[0.22em] text-white/25 lg:block">
              VS
            </div>

            <input
              value={symbolB}
              onChange={(event) =>
                setSymbolB(
                  event.target.value,
                )
              }
              placeholder="Second symbol"
              autoComplete="off"
              className="min-h-14 min-w-0 rounded-[20px] border border-white/10 bg-black/40 px-5 text-base font-semibold uppercase outline-none placeholder:normal-case placeholder:text-white/25 focus:border-cyan-300/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="min-h-14 rounded-[20px] bg-white px-7 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading
                ? "Comparing..."
                : "Compare Research"}
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

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[0, 1].map(
                (item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-[28px] bg-white/[0.04]"
                  />
                ),
              )}
            </div>
          </div>
        )}

        {!loading &&
          result?.status ===
            "INSUFFICIENT_EVIDENCE" && (
            <section className="mt-8 rounded-[32px] border border-amber-300/15 bg-amber-300/[0.05] p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200/55">
                Compare Status
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">
                Insufficient Evidence
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/50">
                {result.message}
              </p>
            </section>
          )}

        {!loading &&
          comparison &&
          evidenceA &&
          evidenceB && (
            <div className="mt-8 space-y-6">
              <section className="rounded-[36px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.07] via-white/[0.03] to-black p-7 sm:p-9">
                <div className="mb-5 flex justify-end">
                  <SaveResearchButton
                    reportType="compare"
                    symbolA={result.symbol_a}
                    symbolB={result.symbol_b}
                    result={result}
                  />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/55">
                  Comparative Result
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div>
                    <h2 className="text-5xl font-black tracking-[-0.06em]">
                      {displayA}
                    </h2>

                    {evidenceA.name && (
                      <p className="mt-2 text-sm text-white/35">
                        {evidenceA.name}
                      </p>
                    )}

                    <p className="mt-5 text-3xl font-black text-cyan-100">
                      {evidenceA.confidence ??
                        0}
                      %
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/28">
                      Research Confidence
                    </p>
                  </div>

                  <div className="text-center text-xs font-black uppercase tracking-[0.2em] text-white/25">
                    VS
                  </div>

                  <div className="md:text-right">
                    <h2 className="text-5xl font-black tracking-[-0.06em]">
                      {displayB}
                    </h2>

                    {evidenceB.name && (
                      <p className="mt-2 text-sm text-white/35">
                        {evidenceB.name}
                      </p>
                    )}

                    <p className="mt-5 text-3xl font-black text-cyan-100">
                      {evidenceB.confidence ??
                        0}
                      %
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/28">
                      Research Confidence
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    Nestrova Comparative Winner
                  </p>

                  <div
                    className={`mt-3 inline-flex rounded-full border px-5 py-2 text-xl font-black ${winnerStyle(
                      comparison.winner,
                    )}`}
                  >
                    {winnerLabel(
                      comparison.winner,
                      displayA,
                      displayB,
                    )}
                  </div>

                  <p className="mt-5 max-w-4xl text-base leading-8 text-white/65">
                    {comparison.summary}
                  </p>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7">
                  <h3 className="text-2xl font-black">
                    {displayA}
                  </h3>

                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-white/35">
                        Risk
                      </span>

                      <span className="font-bold">
                        {evidenceA.risk ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-white/35">
                        Research Style
                      </span>

                      <span className="font-bold">
                        {evidenceA.research_style ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white/35">
                        Evidence
                      </span>

                      <span className="font-bold">
                        {evidenceA.reasons
                          ?.length ?? 0}
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-white/50">
                    {
                      comparison.asset_a_case
                    }
                  </p>
                </article>

                <article className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7">
                  <h3 className="text-2xl font-black">
                    {displayB}
                  </h3>

                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-white/35">
                        Risk
                      </span>

                      <span className="font-bold">
                        {evidenceB.risk ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-white/35">
                        Research Style
                      </span>

                      <span className="font-bold">
                        {evidenceB.research_style ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white/35">
                        Evidence
                      </span>

                      <span className="font-bold">
                        {evidenceB.reasons
                          ?.length ?? 0}
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-white/50">
                    {
                      comparison.asset_b_case
                    }
                  </p>
                </article>
              </section>

              <section>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Comparison Breakdown
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {Object.entries(
                    comparison.categories,
                  ).map(
                    ([
                      key,
                      category,
                    ]) => (
                      <article
                        key={key}
                        className="rounded-[26px] border border-white/10 bg-white/[0.035] p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-bold">
                            {categoryLabels[
                              key
                            ] || key}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${winnerStyle(
                              category.winner,
                            )}`}
                          >
                            {winnerLabel(
                              category.winner,
                              displayA,
                              displayB,
                            )}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-white/48">
                          {
                            category.reason
                          }
                        </p>
                      </article>
                    ),
                  )}
                </div>
              </section>

              <section className="rounded-[30px] border border-violet-300/15 bg-violet-300/[0.045] p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/55">
                  Key Difference
                </p>

                <p className="mt-4 text-base leading-8 text-white/65">
                  {
                    comparison.key_difference
                  }
                </p>
              </section>

              <section className="rounded-[36px] border border-white/10 bg-white/[0.035] p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Final Comparative View
                </p>

                <p className="mt-4 max-w-4xl text-lg font-semibold leading-8 text-white/72">
                  {comparison.final_view}
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-sm text-white/40">
                    Comparison confidence:{" "}
                    <span className="font-bold text-white/70">
                      {
                        comparison.comparison_confidence
                      }
                      %
                    </span>
                  </p>
                </div>
              </section>

              {comparison.limitations
                ?.length > 0 && (
                <section className="rounded-[26px] border border-white/10 bg-black/30 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                    Research Limitations
                  </p>

                  <div className="mt-4 space-y-2">
                    {comparison.limitations.map(
                      (
                        limitation,
                        index,
                      ) => (
                        <p
                          key={`${limitation}-${index}`}
                          className="text-xs leading-5 text-white/35"
                        >
                          • {limitation}
                        </p>
                      ),
                    )}
                  </div>
                </section>
              )}

              <p className="text-center text-[11px] leading-5 text-white/25">
                Nestrova Research Compare
                provides informational
                research intelligence only
                and does not constitute
                personalized financial
                advice.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}
