"use client";

import { Badge, Card, Button } from "@/components/ui";
import type { CompareResult } from "@/types/comparison";

export default function WinnerPanel({ winner }: { winner: CompareResult["winner"] }) {
  return (
    <Card variant="premium" className="relative overflow-hidden p-8">
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative">
        <Badge variant="buy">Winner</Badge>
        <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-white md:text-6xl">{winner.property.address}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/62">Nestrova selected this property as the best overall deal with {winner.confidence}% confidence.</p>
        <div className="mt-7 grid gap-3">
          {winner.reasons.map((reason) => (
            <div key={reason} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white/65">✓ {reason}</div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button variant="premium">Generate Comparison Memo</Button>
          <Button variant="ghost" className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/10 hover:text-white">Save Winner</Button>
        </div>
      </div>
    </Card>
  );
}
