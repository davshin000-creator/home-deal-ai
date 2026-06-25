"use client";

export default function ProgressBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const percent = Math.round((step / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600">
          Step {step} of {totalSteps}
        </p>
        <p className="text-sm font-semibold text-gray-600">{percent}%</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-black transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
