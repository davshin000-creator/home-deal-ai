"use client";

import { Badge, Card } from "@/components/ui";
import type { CompareResult } from "@/types/comparison";
import { getWeightedScore } from "@/lib/compare/compareEngine";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function ExecutiveComparisonSummary({
  result,
}: {
  result: CompareResult;
}) {
  const winner = result.ranking[0];
  const runnerUp = result.ranking[1];

  const scoreGap = runnerUp
    ? getWeightedScore(winner) - getWeightedScore(runnerUp)
    : 0;

  const valueSpread =
    winner.price > 0
      ? ((winner.fairValue - winner.price) / winner.price) * 100
      : 0;

  return (
    <Card
      variant="premium"
      className="relative overflow-hidden p-6 md:p-8"
    >
      <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">Executive Summary</Badge>

        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
          AI comparison verdict
        </h2>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-white/55">
          {result.executiveSummary}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[26px] border border-emerald-400/20 bg-emerald-500/[0.08] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/70">
              Selected Winner
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              {winner.address}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Highest weighted score across valuation, risk,
              rental performance, forecast, negotiation, and ROI.
            </p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              Winning Margin
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              +{Math.max(0, scoreGap)}
            </p>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Weighted comparison points above the closest
              alternative.
            </p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              Value Position
            </p>

            <p
              className={`mt-3 text-3xl font-semibold ${
                valueSpread >= 0
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {Math.abs(valueSpread).toFixed(1)}%
            </p>

            <p className="mt-2 text-sm leading-6 text-white/45">
              {valueSpread >= 0
                ? "Below estimated AI fair value."
                : "Above estimated AI fair value."}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Final Ranking
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Property decision order
              </h3>
            </div>

            <p className="text-sm text-white/35">
              {result.ranking.length} properties analyzed
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {result.ranking.map((property, index) => {
              const isWinner = index === 0;

              return (
                <div
                  key={property.id}
                  className={`rounded-[28px] border p-5 transition hover:-translate-y-0.5 ${
                    isWinner
                      ? "border-emerald-400/25 bg-emerald-500/[0.07]"
                      : "border-white/10 bg-white/[0.035]"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold ${
                            isWinner
                              ? "border-emerald-300/20 bg-emerald-500/20 text-emerald-200"
                              : "border-white/10 bg-white/[0.06] text-white/60"
                          }`}
                        >
                          #{index + 1}
                        </span>

                        <div>
                          <h4 className="text-xl font-semibold tracking-[-0.03em] text-white">
                            {property.address}
                          </h4>

                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
                            {property.recommendation}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-6 text-white/50">
                        {property.summary}
                      </p>
                    </div>

                    <div className="grid shrink-0 grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                          Score
                        </p>

                        <p className="mt-1 text-xl font-semibold text-white">
                          {getWeightedScore(property)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                          Price
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {money(property.price)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                          Rent
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {money(property.estimatedRent)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-[26px] border border-amber-400/15 bg-amber-500/[0.06] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
            Final Due Diligence
          </p>

          <p className="mt-3 text-sm leading-6 text-white/55">
            Confirm inspection findings, HOA obligations,
            insurance, taxes, achievable rent, and financing
            assumptions before making a final offer.
          </p>
        </div>
      </div>
    </Card>
  );
}