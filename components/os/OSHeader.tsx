"use client";

export default function OSHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Nestrova OS
          </p>
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-neutral-950">
            AI Real Estate Workspace
          </h1>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Live
          </span>
          <button className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white">
            New Analysis
          </button>
        </div>
      </div>
    </header>
  );
}
