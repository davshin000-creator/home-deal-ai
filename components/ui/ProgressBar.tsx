"use client";

export default function ProgressBar({
  value = 0,
  label,
}: {
  value?: number;
  label?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div>
      <div className="flex items-center justify-between">
        {label && <p className="text-sm font-semibold text-neutral-700">{label}</p>}
        <p className="text-sm font-semibold text-neutral-500">{safeValue}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-black transition-all" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

