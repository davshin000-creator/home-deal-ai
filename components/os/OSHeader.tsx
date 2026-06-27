"use client";

export default function OSHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
            N
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-950">Nestrova OS</p>
            <p className="text-xs text-neutral-500">AI Investment Workspace</p>
          </div>
        </div>
        <button className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100">
          Ctrl K
        </button>
      </div>
    </header>
  );
}
