"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { DecisionApiResult, ExplanationResult, getExplanation } from "@/lib/ai/client";

export default function AIExplanationPanel({ decision }: { decision: DecisionApiResult }) {
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadExplanation() {
    try {
      setLoading(true);
      const result = await getExplanation(decision);
      setExplanation(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decision.address, decision.recommendation, decision.confidence]);

  if (!explanation) {
    return (
      <Card variant="premium" className="relative overflow-hidden p-8">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <Badge variant="pro">Nestrova Brain</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">Preparing AI explanation</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Nestrova is converting scores, risks, offers, and confidence into a clear action plan.</p>
          </div>
          <Button variant="premium" onClick={loadExplanation} loading={loading}>Generate</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge variant="pro">Nestrova Brain</Badge>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-white md:text-6xl">{explanation.nextBestAction}</h2>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Confidence</p>
            <p className="mt-1 text-3xl font-semibold text-white">{decision.confidence}%</p>
          </div>
        </div>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-white/65">{explanation.executiveSummary}</p>
        <div className="mt-9 grid gap-5 xl:grid-cols-3">
          {[
            ["Why this decision", explanation.whyThisDecision],
            ["Risk summary", explanation.riskSummary],
            ["Negotiation advice", explanation.negotiationAdvice],
          ].map(([title, items]) => (
            <div key={title as string} className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <h3 className="font-semibold text-white">{title as string}</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/62">
                {(items as string[]).map((item) => (
                  <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-7 rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/45">{explanation.confidenceExplanation}</p>
      </div>
    </Card>
  );
}

