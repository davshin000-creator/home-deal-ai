"use client";

import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { useBrainPulse } from "@/hooks/useBrainPulse";

const modules = [
  ["Decision", "Online"],
  ["Risk", "Online"],
  ["Offer", "Online"],
  ["Memory", "Ready"],
  ["Forecast", "Ready"],
];

export default function LiveBrainHUD() {
  const pulse = useBrainPulse();

  return (
    <Card variant="premium" className="relative overflow-hidden p-6">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="pro">Live Brain HUD</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-white">
              {pulse.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/55">{pulse.detail}</p>
          </div>

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
            <div className="absolute h-20 w-20 animate-ping rounded-full border border-white/20" />
            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.95)]" />
          </div>
        </div>

        <div className="mt-7">
          <ProgressBar value={pulse.progress} label="Neural activity" />
        </div>

        <div className="mt-6 grid gap-3">
          {modules.map(([name, status]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3"
            >
              <p className="text-sm font-semibold text-white/70">{name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                {status}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-3">
          <Button variant="premium">Run Full Brain</Button>
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
