"use client";

export default function ProgressBar({
  value,
  step,
  totalSteps,
}: {
  value?: number;
  step?: number;
  totalSteps?: number;
}) {
  const progress =
    value ??
    (step !== undefined && totalSteps
      ? Math.round((step / totalSteps) * 100)
      : 0);

  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-black transition-all"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-neutral-500">
        {Math.max(0, Math.min(100, progress))}% complete
      </p>
    </div>
  );
}

