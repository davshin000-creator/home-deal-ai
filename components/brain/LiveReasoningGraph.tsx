"use client";

import { Badge, Card } from "@/components/ui";

const nodes = [
  { name: "Valuation", x: "12%", y: "22%", status: "complete" },
  { name: "Rental", x: "18%", y: "68%", status: "complete" },
  { name: "Risk", x: "43%", y: "18%", status: "active" },
  { name: "Offer", x: "50%", y: "70%", status: "thinking" },
  { name: "Memory", x: "72%", y: "26%", status: "complete" },
  { name: "Executive", x: "78%", y: "62%", status: "active" },
];

const links = [
  ["Valuation", "Risk"],
  ["Valuation", "Offer"],
  ["Rental", "Offer"],
  ["Risk", "Executive"],
  ["Offer", "Executive"],
  ["Memory", "Executive"],
];

function nodeStyle(status: string) {
  if (status === "complete") return "bg-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.85)]";
  if (status === "active") return "bg-cyan-300 shadow-[0_0_32px_rgba(103,232,249,0.9)] animate-pulse";
  return "bg-amber-300 shadow-[0_0_26px_rgba(252,211,77,0.85)]";
}

function getNode(name: string) {
  return nodes.find((node) => node.name === name)!;
}

export default function LiveReasoningGraph() {
  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative">
        <Badge variant="pro">Live Reasoning Graph</Badge>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Agent signal network
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Nestrova visualizes how valuation, rental, risk, offer, memory, and executive reasoning flow into one final decision.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Network Status
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">Synchronized</p>
          </div>
        </div>

        <div className="relative mt-9 h-[430px] overflow-hidden rounded-[34px] border border-white/10 bg-black/25">
          <svg className="absolute inset-0 h-full w-full">
            {links.map(([from, to]) => {
              const a = getNode(from);
              const b = getNode(to);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="1.4"
                  strokeDasharray="6 8"
                />
              );
            })}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className={`h-5 w-5 rounded-full ${nodeStyle(node.status)}`} />
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-2 text-center shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  <p className="text-sm font-semibold text-white">{node.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {node.status}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm font-semibold text-white">Executive Brain</p>
            <p className="mt-1 text-sm leading-6 text-white/45">
              Receiving signals from valuation, risk, offer, rental, and memory agents before final recommendation.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

