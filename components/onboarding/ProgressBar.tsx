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
    <div className="mb-8">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all duration-300"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
          Setup progress
        </p>

        <p className="text-xs font-semibold text-white/45">
          {Math.max(0, Math.min(100, progress))}% complete
        </p>
      </div>
    </div>
  );
}
