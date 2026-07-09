"use client";

import Card from "./Card";

export default function MetricCard({ label, value, delta, sub }: { label: string; value: string | number; delta?: string; sub?: string }) {
  return (
    <Card className="group relative overflow-hidden p-5">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-black/[0.035] blur-2xl transition group-hover:bg-black/[0.06]" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <p className="text-4xl font-semibold tracking-[-0.04em] text-neutral-950">{value}</p>
        {delta && <p className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">{delta}</p>}
      </div>
      {sub && <p className="relative mt-2 text-sm text-neutral-500">{sub}</p>}
    </Card>
  );
}

