"use client";

import { Badge, Button, Card, MetricCard, ProgressBar, Section } from "@/components/ui";
import { workspaceProperty, workspaceRisks, workspaceSignals } from "@/lib/workspace/workspaceData";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function ExecutiveWorkspace() {
  const property = workspaceProperty;

  return (
    <Section eyebrow="Executive Workspace" title="Investment decision summary" description="Nestrova summarizes the property into a simple decision, supporting metrics, risks, and the next best action." action={<Badge variant="buy">{property.recommendation}</Badge>}>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Should you buy?</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-[-0.04em]">{property.recommendation}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">
            This property appears undervalued relative to estimated fair value. Rental yield remains healthy and the current assumptions support a disciplined offer below asking price.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Fair Value" value={money(property.fairValue)} />
            <MetricCard label="Offer" value={money(property.suggestedOffer)} />
            <MetricCard label="Cash Flow" value={property.cashFlow} />
          </div>
        </Card>

        <Card variant="inverse" className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">AI Confidence</p>
          <h3 className="mt-3 text-5xl font-semibold">{property.confidence}%</h3>
          <p className="mt-4 text-sm leading-6 text-neutral-300">Based on valuation, rental yield, market signals, and risk review.</p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <ProgressBar value={property.confidence} label="Confidence" />
          </div>
          <Button variant="secondary" className="mt-6 w-full">Explain Score</Button>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-2xl font-semibold tracking-[-0.02em]">Why this deal?</h3>
          <ul className="mt-5 grid gap-3 text-sm text-neutral-600">
            {workspaceSignals.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="text-2xl font-semibold tracking-[-0.02em]">Risk review</h3>
          <ul className="mt-5 grid gap-3 text-sm text-neutral-600">
            {workspaceRisks.map((item) => <li key={item}>⚠ {item}</li>)}
          </ul>
        </Card>
      </div>
    </Section>
  );
}
