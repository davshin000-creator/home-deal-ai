"use client";

export default function AnalysisSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="h-32 animate-pulse rounded-[28px] bg-neutral-200" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-[24px] bg-neutral-200" />
        <div className="h-24 animate-pulse rounded-[24px] bg-neutral-200" />
        <div className="h-24 animate-pulse rounded-[24px] bg-neutral-200" />
      </div>
    </div>
  );
}
