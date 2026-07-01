"use client";

const navItems = ["Dashboard", "Analyze", "Decision", "Portfolio", "Watchlist", "Reports", "Settings"];

export default function OSSidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-73px)] border-r border-black/10 bg-white p-4 lg:block">
      <nav className="grid gap-2">
        {navItems.map((item, index) => (
          <a
            key={item}
            href="#"
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              index === 0
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}
