"use client";

import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { useBrainPulse } from "@/hooks/useBrainPulse";

const modules = [
  "Decision",
  "Risk",
  "Offer",
  "Memory",
  "Forecast",
  "Agent",
];

export default function LiveBrainHud() {
  const { mode, pulse, status } = useBrainPulse();

  return (
    <Card variant="premium" className="relative overflow-hidden p-6">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="pro">Live Brain HUD</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              {mode}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Nestrova Brain is continuously cycling through active reasoning modules.
            </p>
          </div>

          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute h-20 w-20 animate-ping rounded-full bg-emerald-400/20" />
            <div className="absolute h-16 w-16 rounded-full border border-white/10 bg-white/[0.06]" />
            <div className="relative h-8 w-8 rounded-full bg-emerald-400 shadow-[0_0_34px_rgba(52,211,153,0.9)]" />
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Neural Activity
            </p>
            <p className="text-sm font-semibold text-white/60">{status}</p>
          </div>
          <div className="mt-4">
            <ProgressBar value={pulse} label="Brain Pulse" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {modules.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white/70">{item}</p>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3">
          <Button variant="premium">Run Full Brain Cycle</Button>
          <Button
            variant="ghost"
            className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:text-white"
          >
            Open Agent Mode
          </Button>
        </div>
      </div>
    </Card>
  );
}
