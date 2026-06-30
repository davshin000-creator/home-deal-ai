"use client";

import { Badge, Button, Card, MetricCard, Section } from "@/components/ui";
import { workspaceProperty } from "@/lib/workspace/workspaceData";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function DecisionCenter() {
  const p = workspaceProperty;
  return (
    <Section eyebrow="Decision Center" title="Offer and negotiation workspace" description="Choose a strategy, understand tradeoffs, and move from analysis to action.">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Offer Studio</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Recommended offer</h3>
            </div>
            <Badge variant="buy">Balanced</Badge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard label="Aggressive" value={money(p.suggestedOffer - 12500)} sub="68% acceptance" />
            <MetricCard label="Balanced" value={money(p.suggestedOffer)} sub="82% acceptance" />
            <MetricCard label="Safe" value={money(p.suggestedOffer + 12500)} sub="94% acceptance" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Generate Offer</Button>
            <Button variant="secondary">Adjust Strategy</Button>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Negotiation Studio</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Negotiation plan</h3>
          <div className="mt-6 grid gap-3">
            {["Opening: offer 4.5% below asking.", "If counter: increase by 1.1% while keeping inspection protection.", "Credit: ask for HVAC or inspection credit instead of price cut."].map((item) => (
              <div key={item} className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">{item}</div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
