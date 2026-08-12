"use client";

import Link from "next/link";
import SaveResearchButton from "@/components/research/SaveResearchButton";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

type Vote =
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH";

type AgentResult = {
  vote: Vote;
  confidence: number;
  reason: string;
};

type CouncilResult = {
  ok?: boolean;
  status?: string;
  symbol?: string;
  gateway_confidence?: number;
  error?: string;
  code?: string;
  message?: string;

  evidence?: {
    symbol?: string;
    name?: string | null;
    asset_type?: string | null;
    confidence?: number;
    risk?: string | null;
    research_style?: string | null;
    research_version?: string | null;
    research_reasons?: string[];
    market_regime?: string | null;
  };

  council?: {
    agents: {
      growth: AgentResult;
      value: AgentResult;
      momentum: AgentResult;
      risk: AgentResult;
      macro: AgentResult;
    };

    consensus: {
      vote: Vote;
      agreement_score: number;
      confidence: number;
      bullish_count: number;
      neutral_count: number;
      bearish_count: number;
      summary: string;
      dissenting_view: string;
    };

    evidence_strength: string;

    limitations: string[];
  };
};

const agentLabels = {
  growth: "Growth Analyst",
  value: "Value Analyst",
  momentum: "Momentum Analyst",
  risk: "Risk Analyst",
  macro: "Macro Analyst",
};

function voteStyle(vote?: Vote) {
  if (vote === "BULLISH") {
    return "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-100";
  }

  if (vote === "BEARISH") {
    return "border-red-300/20 bg-red-300/[0.07] text-red-100";
  }

  return "border-white/10 bg-white/[0.05] text-white/60";
}

export default function ResearchCouncilPage() {
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
    useState<CouncilResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState("");

  const agents =
    useMemo(() => {
      if (!result?.council?.agents) {
        return [];
      }

      return Object.entries(
        result.council.agents,
      ) as [
        keyof typeof agentLabels,
        AgentResult,
      ][];
    }, [result]);

  async function runCouncil(
    event: FormEvent,
  ) {
    event.preventDefault();

    const normalized =
      symbol.trim().toUpperCase();

    if (!normalized) {
      setError(
        "Enter a symbol to begin Council analysis.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response =
        await fetch(
          "/api/research/council",
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
        (await response.json()) as CouncilResult;

      if (!response.ok) {
        setResult(data);
        setError(
          data.error ||
            "Research Council could not be generated.",
        );
        return;
      }

      setResult(data);
    } catch (requestError) {
      console.error(
        "research_council_request_failed",
        requestError,
      );

      setError(
        "Could not connect to Research Council.",
      );
    } finally {
      setLoading(false);
    }
  }

  const consensus =
    result?.council?.consensus;

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

          <span className="rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
            Nestrova Pro
          </span>
        </div>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200/55">
            Multi-Perspective Intelligence
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            Research Council
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/45">
            Five independent research
            perspectives evaluate the same
            public Nestrova evidence and
            produce a transparent Council
            consensus.
          </p>
        </section>

        <form
          onSubmit={runCouncil}
          className="rounded-[30px] border border-white/10 bg-white/[0.04] p-3"
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
              className="min-h-14 min-w-0 flex-1 rounded-[20px] border border-white/10 bg-black/40 px-5 text-base font-semibold uppercase outline-none placeholder:normal-case placeholder:text-white/25 focus:border-violet-300/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="min-h-14 rounded-[20px] bg-white px-7 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading
                ? "Convening Council..."
                : "Run Research Council"}
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
          <div className="mt-8 rounded-[32px] border border-violet-300/10 bg-violet-300/[0.035] p-8">
            <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="mt-6 h-10 w-2/3 animate-pulse rounded-xl bg-white/[0.07]" />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {[0, 1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-[24px] bg-white/[0.04]"
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
                Council Status
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
          result?.council &&
          consensus && (
            <div className="mt-8 space-y-6">
              <section className="rounded-[36px] border border-violet-300/15 bg-gradient-to-br from-violet-300/[0.08] via-white/[0.035] to-black p-7 sm:p-9">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-5 flex justify-end">
                    <SaveResearchButton
                      reportType="council"
                      symbolA={result.symbol}
                      result={result}
                    />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/55">
                      Council Consensus
                    </p>

                    <h2 className="mt-3 text-5xl font-black tracking-[-0.06em]">
                      {result.symbol}
                    </h2>

                    {result.evidence?.name && (
                      <p className="mt-2 text-sm text-white/40">
                        {result.evidence.name}
                      </p>
                    )}
                  </div>

                  <div
                    className={`rounded-[24px] border px-6 py-5 ${voteStyle(
                      consensus.vote,
                    )}`}
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] opacity-60">
                      Final Vote
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {consensus.vote}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      Council Confidence
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {consensus.confidence}%
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      Agreement
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {consensus.agreement_score}%
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      Gateway Confidence
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {result.gateway_confidence ??
                        0}
                      %
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-black/25 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
                      Evidence Strength
                    </p>

                    <p className="mt-2 text-xl font-black">
                      {
                        result.council
                          .evidence_strength
                      }
                    </p>
                  </div>
                </div>

                <p className="mt-7 max-w-4xl text-base leading-8 text-white/65">
                  {consensus.summary}
                </p>
              </section>

              <section>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Council Members
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                  Five independent views.
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {agents.map(
                    ([key, agent]) => (
                      <article
                        key={key}
                        className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                          {agentLabels[key]}
                        </p>

                        <div
                          className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black ${voteStyle(
                            agent.vote,
                          )}`}
                        >
                          {agent.vote}
                        </div>

                        <p className="mt-5 text-3xl font-black">
                          {agent.confidence}%
                        </p>

                        <p className="mt-4 text-sm leading-6 text-white/45">
                          {agent.reason}
                        </p>
                      </article>
                    ),
                  )}
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-[28px] border border-emerald-300/15 bg-emerald-300/[0.045] p-6">
                  <p className="text-xs font-bold text-emerald-100/70">
                    Bullish Votes
                  </p>

                  <p className="mt-3 text-4xl font-black">
                    {consensus.bullish_count}
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
                  <p className="text-xs font-bold text-white/50">
                    Neutral Votes
                  </p>

                  <p className="mt-3 text-4xl font-black">
                    {consensus.neutral_count}
                  </p>
                </div>

                <div className="rounded-[28px] border border-red-300/15 bg-red-300/[0.045] p-6">
                  <p className="text-xs font-bold text-red-100/70">
                    Bearish Votes
                  </p>

                  <p className="mt-3 text-4xl font-black">
                    {consensus.bearish_count}
                  </p>
                </div>
              </section>

              <section className="rounded-[30px] border border-white/10 bg-white/[0.035] p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Dissenting View
                </p>

                <p className="mt-4 max-w-4xl text-sm leading-7 text-white/55">
                  {consensus.dissenting_view}
                </p>
              </section>

              {result.evidence
                ?.research_reasons &&
                result.evidence
                  .research_reasons.length >
                  0 && (
                  <section className="rounded-[30px] border border-cyan-300/15 bg-cyan-300/[0.04] p-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/50">
                      Evidence Reviewed
                    </p>

                    <div className="mt-5 space-y-3">
                      {result.evidence.research_reasons.map(
                        (
                          reason,
                          index,
                        ) => (
                          <div
                            key={`${reason}-${index}`}
                            className="flex gap-4 rounded-[18px] border border-white/[0.07] bg-black/20 p-4"
                          >
                            <span className="text-xs font-black text-cyan-100/55">
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <p className="text-sm leading-6 text-white/50">
                              {reason}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </section>
                )}

              {result.council.limitations
                ?.length > 0 && (
                <section className="rounded-[28px] border border-white/10 bg-black/30 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                    Council Limitations
                  </p>

                  <div className="mt-4 space-y-2">
                    {result.council.limitations.map(
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
                Nestrova Research Council
                provides informational
                research intelligence and
                does not constitute
                personalized financial
                advice.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}
