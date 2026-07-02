"use client";

const insights = [
  ["Analyze", "Run a fresh AI decision on the current property."],
  ["Risk", "Review inspection, rental, and carrying-cost risks."],
  ["Offer", "Generate an offer range before negotiating."],
];

export default function AISidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-80px)] border-l border-white/10 bg-[#050505] p-4 xl:block">
      <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_42%,rgba(255,255,255,0.02))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Nestrova Brain</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Next actions</h2>
          </div>
          <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_26px_rgba(52,211,153,0.95)]" />
        </div>
        <div className="mt-6 grid gap-3">
          {insights.map(([label, text]) => (
            <div key={label} className="rounded-[22px] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{label}</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
