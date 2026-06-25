"use client";

export default function AnalysisSkeleton() {
  return (
    <div className="grid gap-5">
      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-6 shadow">
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-10 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="mt-5 grid gap-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
