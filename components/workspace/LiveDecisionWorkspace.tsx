"use client";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingOverlay,
  MetricCard,
  ProgressBar,
  Section,
  SkeletonCard,
  SkeletonMetricGrid,
} from "@/components/ui";
import { useDecision } from "@/hooks/useDecision";
import DecisionInputForm from "@/components/workspace/DecisionInputForm";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function badgeVariant(recommendation: "BUY" | "HOLD" | "PASS") {
  if (recommendation === "BUY") return "buy";
  if (recommendation === "PASS") return "pass";
  return "hold";
}

export default function LiveDecisionWorkspace() {
  const { input, decision, loading, running, error, refresh, run } = useDecision();

  if (loading) {
    return (
      <div className="grid gap-8">
        <LoadingOverlay show title="Loading AI decision" />
        <SkeletonCard />
        <SkeletonMetricGrid />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="grid gap-6">
        <DecisionInputForm initialValue={input} running={running} onSubmit={run} />
        <EmptyState
          title="Unable to load AI decision"
          description={error || "The decision engine did not return a result."}
          actionLabel="Try Again"
          onAction={refresh}
          icon="!"
        />
      </div>
    );
  }

  const balancedOffer = decision.offers.find((offer) => offer.name === "Balanced") || decision.offers[0];

  return (
    <div className="grid gap-8">
      <DecisionInputForm initialValue={input} running={running} onSubmit={run} />

      <Card variant="glass" className="overflow-hidden rounded-[36px] p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Live AI Decision</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-5xl font-semibold tracking-[-0.04em] text-neutral-950 md:text-6xl">{decision.address}</h1>
              <Badge variant={badgeVariant(decision.recommendation)}>{decision.recommendation}</Badge>
            </div>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600">{decision.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>{decision.nextAction}</Button>
              <Button variant="secondary" onClick={refresh} loading={running}>Refresh AI</Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Investment Score" value={decision.scores.investmentScore} sub="Live from AI Decision Engine" />
            <MetricCard label="Confidence" value={`${decision.confidence}%`} sub="Recommendation confidence" />
          </div>
        </div>
      </Card>

      <Section eyebrow="Executive Workspace" title="Decision engine output" description="This section reads directly from /api/ai-decision." action={<Badge variant={badgeVariant(decision.recommendation)}>{decision.recommendation}</Badge>}>
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Card className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Recommendation</p>
            <h2 className="mt-3 text-5xl font-semibold tracking-[-0.04em]">{decision.recommendation}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <MetricCard label="Fair Value Score" value={decision.scores.fairValueScore} />
              <MetricCard label="Rental Score" value={decision.scores.rentalScore} />
              <MetricCard label="Negotiation" value={decision.scores.negotiationScore} />
            </div>
          </Card>

          <Card variant="inverse" className="p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">AI Confidence</p>
            <h3 className="mt-3 text-5xl font-semibold">{decision.confidence}%</h3>
            <p className="mt-4 text-sm leading-6 text-neutral-300">Based on scoring, risks, offers, and decision rules.</p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <ProgressBar value={decision.confidence} label="Confidence" />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">Why this decision?</h3>
            <ul className="mt-5 grid gap-3 text-sm text-neutral-600">
              {decision.reasons.map((reason) => <li key={reason}>✓ {reason}</li>)}
            </ul>
          </Card>
          <Card>
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">Risk review</h3>
            <div className="mt-5 grid gap-3">
              {decision.risks.map((risk) => (
                <div key={risk.label} className="rounded-2xl bg-neutral-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-neutral-900">{risk.label}</p>
                    <Badge variant={risk.level === "High" ? "risk" : "default"}>{risk.level}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{risk.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Decision Center" title="Live offer strategies" description="Offer strategies now come from the decision engine.">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Offer Studio</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Recommended strategy: {balancedOffer.name}</h3>
            </div>
            <Badge variant="buy">{balancedOffer.acceptanceProbability.toFixed(1)}%</Badge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {decision.offers.map((offer) => (
              <MetricCard key={offer.name} label={offer.name} value={money(offer.offer)} sub={`${offer.acceptanceProbability.toFixed(1)}% acceptance`} />
            ))}
          </div>
        </Card>
      </Section>

      <Section eyebrow="Nestrova Intelligence" title="AI summary" description="Nestrova explains what happened and what to do next.">
        <Card variant="inverse" className="p-8">
          <Badge variant="pro">Decision Engine</Badge>
          <h3 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">{decision.nextAction}</h3>
          <p className="mt-4 max-w-3xl text-neutral-300">{decision.summary}</p>
        </Card>
      </Section>
    </div>
  );
}
