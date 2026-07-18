"use client";

import { Badge, Card, MetricCard } from "@/components/ui";
import type { CompareProperty } from "@/types/comparison";
import { getWeightedScore } from "@/lib/compare/compareEngine";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function badgeVariant(
  recommendation: CompareProperty["recommendation"],
) {
  if (recommendation === "BUY") return "buy";
  if (recommendation === "SKIP") return "pass";
  if (recommendation === "WAIT") return "hold";
  return "pro";
}

function valueSpreadPercent(property: CompareProperty) {
  if (property.price <= 0) {
    return 0;
  }

  return (
    ((property.fairValue - property.price) / property.price) *
    100
  );
}

export default function PropertyCompareCard({
  property,
}: {
  property: CompareProperty;
}) {
  const weightedScore = getWeightedScore(property);
  const spread = valueSpreadPercent(property);
  const isUndervalued = spread >= 0;

  return (
    <Card
      variant="premium"
      className="group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl transition duration-300 group-hover:bg-indigo-500/15" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge
              variant={badgeVariant(property.recommendation)}
            >
              {property.recommendation}
            </Badge>

            <h3 className="mt-4 break-words text-3xl font-semibold tracking-[-0.04em] text-white">
              {property.address}
            </h3>

            {(property.city || property.state) && (
              <p className="mt-1 text-sm text-white/45">
                {[property.city, property.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-right shadow-lg shadow-black/20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Rank Score
            </p>

            <p className="mt-1 text-3xl font-semibold text-white">
              {weightedScore}
            </p>

            <p className="mt-1 text-[11px] text-white/35">
              out of 100
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-white/55">
          {property.summary}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <MetricCard
            label="AI Brain"
            value={property.brainScore}
            sub="Decision quality"
          />

          <MetricCard
            label="Risk"
            value={property.riskScore}
            sub="Safety profile"
          />

          <MetricCard
            label="Rent"
            value={property.rentalScore}
            sub={`${money(property.estimatedRent)} / month`}
          />

          <MetricCard
            label="ROI"
            value={property.roiScore}
            sub="Return signal"
          />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Asking Price
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {money(property.price)}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              AI Fair Value
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {money(property.fairValue)}
            </p>
          </div>
        </div>

        <div
          className={`mt-3 rounded-[24px] border p-4 ${
            isUndervalued
              ? "border-emerald-400/20 bg-emerald-500/10"
              : "border-amber-400/20 bg-amber-500/10"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  isUndervalued
                    ? "text-emerald-200/70"
                    : "text-amber-200/70"
                }`}
              >
                Value Position
              </p>

              <p
                className={`mt-2 text-lg font-semibold ${
                  isUndervalued
                    ? "text-emerald-100"
                    : "text-amber-100"
                }`}
              >
                {Math.abs(spread).toFixed(1)}%{" "}
                {isUndervalued
                  ? "Below Fair Value"
                  : "Above Fair Value"}
              </p>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-bold ${
                isUndervalued
                  ? "border-emerald-300/20 bg-emerald-500/15 text-emerald-200"
                  : "border-amber-300/20 bg-amber-500/15 text-amber-200"
              }`}
            >
              {isUndervalued ? "↘" : "↗"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-500/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/70">
              Strengths
            </p>

            <div className="mt-3 grid gap-2">
              {property.strengths
                .slice(0, 3)
                .map((strength, index) => (
                  <div
                    key={`${strength}-${index}`}
                    className="flex gap-3 text-sm leading-6 text-white/65"
                  >
                    <span className="mt-1 text-emerald-300">
                      +
                    </span>
                    <span>{strength}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-amber-400/15 bg-amber-500/[0.06] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
              Risks
            </p>

            <div className="mt-3 grid gap-2">
              {property.risks.slice(0, 3).map((risk, index) => (
                <div
                  key={`${risk}-${index}`}
                  className="flex gap-3 text-sm leading-6 text-white/65"
                >
                  <span className="mt-1 text-amber-300">
                    !
                  </span>
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}