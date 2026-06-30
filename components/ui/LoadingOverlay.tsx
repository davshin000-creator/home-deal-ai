"use client";

import { cn } from "@/lib/ui/cn";

const DEFAULT_STEPS = [
  "Analyzing valuation...",
  "Reading comparable sales...",
  "Checking market signals...",
  "Preparing recommendation...",
];

export default function LoadingOverlay({
  show,
  title = "Nestrova is thinking",
  steps = DEFAULT_STEPS,
  className,
}: {
  show: boolean;
  title?: string;
  steps?: string[];
  className?: string;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-6 backdrop-blur-xl">
      <div
        className={cn(
          "w-full max-w-lg rounded-[32px] border border-black/10 bg-white p-8 shadow-2xl",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 animate-ping rounded-full bg-black" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              AI Workspace
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
              {title}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                {index + 1}
              </div>
              <p className="text-sm font-semibold text-neutral-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
