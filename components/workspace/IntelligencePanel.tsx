"use client";

import { Badge, Button, Card, MetricCard, Section } from "@/components/ui";

const signals = [
  "Dallas inventory decreased 6% this week.",
  "A comparable property sold $18,000 above this target.",
  "The offer window looks strongest over the next 7–10 days.",
];

export default function IntelligencePanel() {
  return (
    <Section eyebrow="Nestrova Intelligence" title="AI found your next best action" description="The market signal, valuation spread, and negotiation leverage support moving forward now." action={<Button variant="ai">Ask AI</Button>}>
      <Card variant="inverse" className="p-8">
        <Badge variant="pro">Intelligence</Badge>
        <h3 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">Generate an offer strategy today.</h3>
        <p className="mt-4 max-w-3xl text-neutral-300">Nestrova detected enough discount margin and market leverage to support preparing an offer before comparing alternative properties.</p>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <MetricCard label="Buyer Power" value="Strong" />
        <MetricCard label="Inventory" value="Low" />
        <MetricCard label="Negotiation" value="High" />
      </div>

      <Card>
        <h3 className="text-2xl font-semibold tracking-[-0.02em]">Today’s signals</h3>
        <div className="mt-5 grid gap-3">
          {signals.map((signal, index) => (
            <div key={signal} className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold text-neutral-500">Signal {index + 1}</p>
              <p className="mt-1 text-sm font-medium text-neutral-800">{signal}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}
