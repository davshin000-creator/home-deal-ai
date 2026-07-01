"use client";

import Card from "./Card";

export default function MetricCard({
  label,
  value,
  delta,
  sub,
}: {
  label: string;
  value: string | number;
  delta?: string;
  sub?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-neutral-950">{value}</p>
        {delta && <p className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">{delta}</p>}
      </div>
      {sub && <p className="mt-2 text-sm text-neutral-500">{sub}</p>}
    </Card>
  );
}
