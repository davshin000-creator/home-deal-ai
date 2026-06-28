"use client";

export default function NestrovaProgress({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {label}
          </p>
          {sub && <p className="mt-1 text-sm text-neutral-500">{sub}</p>}
        </div>
        <p className="text-2xl font-semibold tracking-tight">{safeValue}%</p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-black transition-all duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
