"use client";

import { Card, Badge } from "@/components/ui";

const agents = [
  ["Decision","Running","Analyzing recommendation"],
  ["Valuation","Complete","Fair value calculated"],
  ["Risk","Running","Reviewing inspection & HOA"],
  ["Offer","Thinking","Preparing strategy"],
  ["Forecast","Queued","Waiting for valuation"],
  ["Memory","Complete","Similar deals loaded"],
  ["Negotiation","Thinking","Optimizing offer"],
  ["Executive","Running","Combining all agents"],
];

export default function MultiAgentNetwork() {
  return (
    <Card variant="premium" className="p-8">
      <Badge variant="pro">Multi-Agent Network</Badge>
      <h2 className="mt-4 text-4xl font-semibold">Nestrova Agents</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {agents.map(([name,status,detail]) => (
          <div key={name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{name} Agent</p>
                <p className="text-sm opacity-70">{detail}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                {status}
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded bg-white/10">
              <div className="h-full w-2/3 rounded bg-emerald-400" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
