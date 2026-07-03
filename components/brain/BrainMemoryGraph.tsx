"use client";

import { Badge, Card } from "@/components/ui";

const memories = [
  { day: "Mon", action: "WAIT", score: 71, note: "Price discipline recommended" },
  { day: "Tue", action: "NEGOTIATE", score: 82, note: "Offer leverage improved" },
  { day: "Wed", action: "NEGOTIATE", score: 86, note: "Risk stayed controlled" },
  { day: "Thu", action: "BUY", score: 91, note: "Margin of safety expanded" },
  { day: "Today", action: "BUY", score: 94, note: "Brain confidence increased" },
];

function actionStyle(action: string) {
  if (action === "BUY") return "bg-emerald-400 text-black shadow-[0_0_22px_rgba(52,211,153,0.65)]";
  if (action === "NEGOTIATE") return "bg-cyan-300 text-black shadow-[0_0_22px_rgba(103,232,249,0.55)]";
  return "bg-white/10 text-white/60";
}

export default function BrainMemoryGraph() {
  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">Brain Memory Graph</Badge>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Decision evolution
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Nestrova tracks how its recommendation changes as price, risk, timing, and confidence evolve.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Current Memory Signal
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">Improving</p>
          </div>
        </div>

        <div className="mt-9 grid gap-4">
          {memories.map((item) => (
            <div
              key={item.day}
              className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.055] p-5 md:grid-cols-[90px_1fr_110px]"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.day}</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${actionStyle(item.action)}`}>
                  {item.action}
                </span>
              </div>

              <div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/50">{item.note}</p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{item.score}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
