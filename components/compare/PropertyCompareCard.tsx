"use client";

import { Badge, Card, MetricCard } from "@/components/ui";
import type { CompareProperty } from "@/types/comparison";
import { getWeightedScore } from "@/lib/compare/compareEngine";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function badgeVariant(recommendation: CompareProperty["recommendation"]) {
  if (recommendation === "BUY") return "buy";
  if (recommendation === "SKIP") return "pass";
  if (recommendation === "WAIT") return "hold";
  return "pro";
}

export default function PropertyCompareCard({ property }: { property: CompareProperty }) {
  return (
    <Card variant="premium" className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant={badgeVariant(property.recommendation)}>{property.recommendation}</Badge>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{property.address}</h3>
          <p className="mt-1 text-sm text-white/45">{property.city}, {property.state}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">Rank Score</p>
          <p className="mt-1 text-3xl font-semibold text-white">{getWeightedScore(property)}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-white/55">{property.summary}</p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <MetricCard label="Brain" value={property.brainScore} sub="Decision quality" />
        <MetricCard label="Risk" value={property.riskScore} sub="Safety profile" />
        <MetricCard label="Rent" value={property.rentalScore} sub={money(property.estimatedRent)} />
        <MetricCard label="ROI" value={property.roiScore} sub="Return signal" />
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Asking / Fair Value</p>
        <p className="mt-2 text-sm text-white/60">{money(property.price)} / {money(property.fairValue)}</p>
      </div>
    </Card>
  );
}
