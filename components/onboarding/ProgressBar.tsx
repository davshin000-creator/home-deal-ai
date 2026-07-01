"use client";

export default function ProgressBar({ value = 25 }: { value?: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-black transition-all" style={{ width: `${safeValue}%` }} />
      </div>
      <p className="mt-2 text-xs font-semibold text-neutral-500">{safeValue}% complete</p>
    </div>
  );
}
