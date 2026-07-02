"use client";

const navItems = [
  ["Dashboard", "⌘"], ["Analyze", "◇"], ["Decision", "✦"], ["Portfolio", "▧"],
  ["Watchlist", "◎"], ["Reports", "▣"], ["Settings", "⚙"],
];

export default function OSSidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-80px)] border-r border-white/10 bg-[#050505] p-4 lg:block">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <nav className="grid gap-1.5">
          {navItems.map(([item, icon], index) => (
            <a key={item} href="#" className={["group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition", index === 0 ? "bg-white text-black shadow-[0_20px_60px_rgba(255,255,255,0.12)]" : "text-white/55 hover:bg-white/[0.07] hover:text-white"].join(" ")}>
              <span className={index === 0 ? "text-black" : "text-white/35 group-hover:text-white/80"}>{icon}</span>{item}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-4 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">System</p>
        <p className="mt-3 text-sm leading-6 text-white/60">Decision engine, risk engine, offer engine, and explanation layer are active.</p>
      </div>
    </aside>
  );
}
