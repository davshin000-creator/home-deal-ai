"use client";

import { Badge, Button, Card, MetricCard } from "@/components/ui";
import { workspaceProperty } from "@/lib/workspace/workspaceData";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function PropertyHero() {
  const property = workspaceProperty;

  return (
    <Card variant="glass" className="overflow-hidden rounded-[36px] p-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Current Workspace</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-neutral-950 md:text-6xl">{property.address}</h1>
            <Badge variant="buy">{property.recommendation}</Badge>
          </div>
          <p className="mt-3 text-lg text-neutral-600">{property.city}, {property.state} · {property.status}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Generate Offer</Button>
            <Button variant="secondary">Compare</Button>
            <Button variant="ghost">Save</Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label="Deal Score" value={property.dealScore} sub="Excellent opportunity" />
          <MetricCard label="Confidence" value={`${property.confidence}%`} sub="High confidence" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="AI Fair Value" value={money(property.fairValue)} />
        <MetricCard label="Suggested Offer" value={money(property.suggestedOffer)} />
        <MetricCard label="Rental Yield" value={`${property.rentalYield}%`} />
        <MetricCard label="Appreciation" value={`${property.appreciation}%`} />
      </div>
    </Card>
  );
}
