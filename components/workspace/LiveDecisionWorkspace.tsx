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
import AIExplanationPanel from "@/components/workspace/AIExplanationPanel";
import BrainMemoryPanel from "@/components/workspace/BrainMemoryPanel";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function badgeVariant(recommendation: "BUY" | "HOLD" | "PASS") {
  if (recommendation === "BUY") return "buy";
  if (recommendation === "PASS") return "pass";
  return "hold";
}

function brainAction(recommendation: "BUY" | "HOLD" | "PASS") {
  if (recommendation === "BUY") return "BUY";
  if (recommendation === "HOLD") return "WAIT";
  return "SKIP";
}

function reasoningSteps(decision: any) {
  return [
    {
      label: "Property Data",
      title: "Input normalized",
      body: `${decision.address} was scored across value, rental, risk, negotiation, and timing signals.`,
    },
    {
      label: "Valuation",
      title: `Fair value score ${decision.scores.fairValueScore}`,
      body: "Nestrova compares asking price against estimated fair value to detect margin of safety.",
    },
    {
      label: "Rental Strength",
      title: `Rental score ${decision.scores.rentalScore}`,
      body: "Estimated rent is translated into yield strength and long-term income support.",
    },
    {
      label: "Risk Review",
      title: `${decision.risks.length} risk checks completed`,
      body: "Inspection, rental, HOA, and carrying cost risks are reviewed before final action.",
    },
    {
      label: "Offer Strategy",
      title: `${decision.offers.length} offers generated`,
      body: "Aggressive, balanced, and safe offers are prepared for negotiation planning.",
    },
    {
      label: "Final Decision",
      title: decision.recommendation,
      body: decision.summary,
    },
  ];
}

export default function LiveDecisionWorkspace() {
  const { input, decision, loading, running, error, refresh, run } = useDecision();

  if (loading) {
    return (
      <div className="grid gap-8">
        <LoadingOverlay show title="Loading Nestrova Brain" />
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

  const balancedOffer =
    decision.offers.find((offer) => offer.name === "Balanced") || decision.offers[0];

  const steps = reasoningSteps(decision);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[42px] border border-white/10 bg-[#050505] p-4 text-white shadow-[0_40px_120px_rgba(0,0,0,0.42)] md:p-6 xl:p-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute right-[-180px] top-24 h-[620px] w-[620px] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-240px] left-1/3 h-[620px] w-[620px] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid gap-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
              Premium Brain OS
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Nestrova Executive Brain
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Brain Online", "Decision Engine", "Memory Active"].map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/60"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.95)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <DecisionInputForm initialValue={input} running={running} onSubmit={run} />

        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <Card variant="premium" className="relative overflow-hidden p-8 md:p-10">
            <div className="absolute right-[-90px] top-[-90px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <Badge variant={badgeVariant(decision.recommendation)}>
                    {decision.recommendation}
                  </Badge>

                  <h2 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">
                    {decision.address}
                  </h2>

                  <p className="mt-7 max-w-4xl text-lg leading-8 text-white/62">
                    {decision.summary}
                  </p>
                </div>

                <div className="grid min-w-[210px] gap-3 rounded-[30px] border border-white/10 bg-white/[0.07] p-5 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    Brain Score
                  </p>
                  <p className="text-6xl font-semibold tracking-[-0.06em] text-white">
                    {decision.scores.investmentScore}
                  </p>
                  <ProgressBar value={decision.confidence} label="Confidence" />
                </div>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button variant="premium">{decision.nextAction}</Button>
                <Button
                  variant="ghost"
                  className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:text-white"
                  onClick={refresh}
                  loading={running}
                >
                  Refresh Brain
                </Button>
              </div>
            </div>
          </Card>

          <div className="xl:sticky xl:top-24 xl:self-start">
            <Card variant="premium" className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Floating Brain
              </p>
              <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                {decision.recommendation}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Confidence {decision.confidence}%. Recommended action: {decision.nextAction}.
              </p>
              <div className="mt-6 grid gap-3">
                <Button variant="premium" onClick={refresh} loading={running}>
                  Re-run
                </Button>
                <Button
                  variant="ghost"
                  className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:text-white"
                >
                  Compare
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Investment" value={decision.scores.investmentScore} sub="Unified score" />
          <MetricCard label="Fair Value" value={decision.scores.fairValueScore} sub="Price signal" />
          <MetricCard label="Rental" value={decision.scores.rentalScore} sub="Yield signal" />
          <MetricCard label="Risk" value={decision.scores.riskScore} sub="Safety signal" />
          <MetricCard label="Negotiation" value={decision.scores.negotiationScore} sub="Offer leverage" />
          <MetricCard label="Timing" value={decision.scores.marketTimingScore} sub="Market timing" />
        </div>

        <AIExplanationPanel decision={decision} />

        <BrainMemoryPanel
          current={{
            address: decision.address,
            action: brainAction(decision.recommendation),
            brainScore: decision.scores.investmentScore,
            confidence: decision.confidence,
            headline: decision.nextAction,
            executiveSummary: decision.summary,
          }}
        />

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <Card variant="premium" className="p-8">
            <Badge variant="pro">Explainable AI</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              Brain reasoning timeline
            </h2>

            <div className="mt-8 grid gap-5">
              {steps.map((step, index) => (
                <div key={step.label} className="grid gap-4 md:grid-cols-[80px_1fr]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="hidden h-full w-px bg-white/10 md:block" />
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      {step.label}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                Risk review
              </h3>
              <div className="mt-5 grid gap-3">
                {decision.risks.map((risk) => (
                  <div key={risk.label} className="rounded-2xl bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-neutral-900">{risk.label}</p>
                      <Badge variant={risk.level === "High" ? "risk" : "default"}>
                        {risk.level}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{risk.reason}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                Offer Studio
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Recommended strategy: {balancedOffer.name}
              </p>
              <div className="mt-5 grid gap-3">
                {decision.offers.map((offer) => (
                  <div key={offer.name} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-neutral-950">{offer.name}</p>
                      <Badge variant="buy">{offer.acceptanceProbability.toFixed(1)}%</Badge>
                    </div>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-neutral-950">
                      {money(offer.offer)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{offer.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <Section
          eyebrow="Nestrova Intelligence"
          title="Executive decision output"
          description="The premium workspace turns raw scores into a clear investment command center."
          action={<Badge variant={badgeVariant(decision.recommendation)}>{decision.recommendation}</Badge>}
        >
          <Card className="p-8">
            <div className="grid gap-6 xl:grid-cols-3">
              {decision.reasons.map((reason) => (
                <div key={reason} className="rounded-[28px] bg-neutral-50 p-5">
                  <p className="text-sm leading-6 text-neutral-700">✓ {reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}
