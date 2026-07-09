"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, MetricCard } from "@/components/ui";

type UnifiedBrainResult = {
  address: string;
  action: "BUY" | "NEGOTIATE" | "WAIT" | "SKIP";
  headline: string;
  brainScore: number;
  confidence: number;
  averageConsensus: number;
  unifiedAction: string;
  finalMemo: string;
  agentConsensus: Array<{
    agent: string;
    signal: string;
    confidence: number;
  }>;
};

export default function UnifiedBrainPanel() {
  const [result, setResult] = useState<UnifiedBrainResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    try {
      setLoading(true);
      const response = await fetch("/api/unified-brain", { cache: "no-store" });
      const data = await response.json();
      if (data.ok && data.result) setResult(data.result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
  }, []);

  if (!result) {
    return (
      <Card variant="premium" className="p-8">
        <Badge variant="pro">Unified Brain</Badge>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
          Preparing unified decision
        </h2>
        <Button variant="premium" className="mt-6" onClick={run} loading={loading}>
          Run Unified Brain
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">RC7-0 Unified Brain</Badge>

        <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
          {result.unifiedAction}
        </h2>

        <p className="mt-5 max-w-4xl text-lg leading-8 text-white/60">
          {result.finalMemo}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="Brain Score" value={result.brainScore} sub="Unified intelligence" />
          <MetricCard label="Confidence" value={`${result.confidence}%`} sub="Decision strength" />
          <MetricCard label="Consensus" value={result.averageConsensus} sub="Agent agreement" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {result.agentConsensus.map((item) => (
            <div
              key={item.agent}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-white">{item.agent}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/55">
                  {item.signal}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${item.confidence}%` }}
                />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">
                {item.confidence}% confidence
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button variant="premium" onClick={run} loading={loading}>
            Re-run Unified Brain
          </Button>
        </div>
      </div>
    </Card>
  );
}

