"use client";

export default function OSHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-[0_0_60px_rgba(255,255,255,0.35)]">
            <span className="text-lg font-black tracking-[-0.05em]">N</span>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.9)]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">Nestrova OS</p>
            <h1 className="text-lg font-semibold tracking-[-0.03em] text-white md:text-xl">AI Real Estate Command Center</h1>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/70">Brain Online</div>
          <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_20px_70px_rgba(255,255,255,0.18)] transition hover:bg-neutral-200 active:scale-[0.99]">New Analysis</button>
        </div>
      </div>
    </header>
  );
}

