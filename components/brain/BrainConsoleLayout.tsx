"use client";

import { Badge, Button, Card, MetricCard, ProgressBar } from "@/components/ui";
import BrainStream from "@/components/brain/BrainStream";
import MultiAgentNetwork from "@/components/brain/MultiAgentNetwork";
import LiveBrainHud from "@/components/brain/LiveBrainHud";
import AgentConversation from "@/components/brain/AgentConversation";
import BrainMemoryGraph from "@/components/brain/BrainMemoryGraph";

const metrics = [
  ["Brain Score", "92", "Unified judgment"],
  ["Confidence", "96%", "Decision strength"],
  ["Risk", "Low", "Guardrail status"],
  ["Action", "Negotiate", "Next move"],
];

export default function BrainConsoleLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] p-4 text-white md:p-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-white/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute right-[-220px] top-20 h-[720px] w-[720px] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-260px] left-1/4 h-[640px] w-[640px] rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative mx-auto grid max-w-[1680px] gap-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
              RC6-3
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Nestrova Brain Console
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">
              Live AI investment terminal with reasoning stream, pulse HUD,
              memory modules, and executive decision controls.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Brain Online", "HUD Active", "Stream Active"].map((item) => (
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

        <div className="grid gap-6 xl:grid-cols-[340px_1fr_380px]">
          <Card variant="premium" className="p-6">
            <Badge variant="pro">Executive Status</Badge>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-white">
              NEGOTIATE
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/55">
              Nestrova Brain recommends negotiating before moving forward.
              Strong upside exists, but price discipline matters.
            </p>

            <div className="mt-8 grid gap-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Brain Score
                </p>
                <ProgressBar value={92} label="Score" />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                  Confidence
                </p>
                <ProgressBar value={96} label="Confidence" />
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              <Button variant="premium">Run Agent</Button>
              <Button
                variant="ghost"
                className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:text-white"
              >
                Generate Memo
              </Button>
            </div>
          </Card>

          <BrainStream />
          <MultiAgentNetwork />
          <AgentConversation />
          <BrainMemoryGraph />

          <div className="grid gap-6">
            <LiveBrainHud />

            <Card variant="premium" className="p-6">
              <Badge variant="pro">Live Metrics</Badge>
              <div className="mt-6 grid gap-4">
                {metrics.map(([label, value, sub]) => (
                  <MetricCard key={label} label={label} value={value} sub={sub} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
