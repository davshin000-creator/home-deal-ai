"use client";

export default function NestrovaMetric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-neutral-500">{sub}</p>}
    </div>
  );
}
