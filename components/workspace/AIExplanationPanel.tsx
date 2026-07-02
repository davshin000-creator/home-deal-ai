"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { DecisionApiResult, ExplanationResult, getExplanation } from "@/lib/ai/client";

export default function AIExplanationPanel({
  decision,
}: {
  decision: DecisionApiResult;
}) {
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
      <Card className="p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="pro">Nestrova Brain</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
              AI explanation is preparing
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Nestrova is turning scores, risks, and offers into a clear action plan.
            </p>
          </div>

          <Button onClick={loadExplanation} loading={loading}>
            Generate
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="inverse" className="p-8">
      <Badge variant="pro">Nestrova Brain</Badge>

      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
        {explanation.nextBestAction}
      </h2>

      <p className="mt-4 max-w-3xl text-neutral-300">
        {explanation.executiveSummary}
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[24px] bg-white/10 p-5">
          <h3 className="font-semibold text-white">Why this decision</h3>
          <ul className="mt-3 grid gap-2 text-sm text-neutral-300">
            {explanation.whyThisDecision.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] bg-white/10 p-5">
          <h3 className="font-semibold text-white">Risk summary</h3>
          <ul className="mt-3 grid gap-2 text-sm text-neutral-300">
            {explanation.riskSummary.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] bg-white/10 p-5">
          <h3 className="font-semibold text-white">Negotiation advice</h3>
          <ul className="mt-3 grid gap-2 text-sm text-neutral-300">
            {explanation.negotiationAdvice.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-sm text-neutral-400">
        {explanation.confidenceExplanation}
      </p>
    </Card>
  );
}
