"use client";

export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-neutral-200/70 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-9 w-56" />
      <div className="mt-6 grid gap-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

export function SkeletonMetricGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Skeleton className="h-28 w-full rounded-[28px]" />
      <Skeleton className="h-28 w-full rounded-[28px]" />
      <Skeleton className="h-28 w-full rounded-[28px]" />
    </div>
  );
}

