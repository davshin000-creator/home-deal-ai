"use client";

export default function ScoreCounter({
  value = 0,
  label = "Score",
}: {
  value?: number;
  label?: string;
}) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="mt-2 text-5xl font-semibold tracking-[-0.04em] text-neutral-950">{value}</p>
    </div>
  );
}
