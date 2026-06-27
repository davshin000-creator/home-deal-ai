"use client";

const NAV = ["Overview", "Properties", "Portfolio", "Documents", "Intelligence", "Alerts", "History", "Settings"];

export default function OSSidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-64px)] border-r border-black/10 bg-white/70 p-4 lg:block">
      <nav className="sticky top-20 grid gap-2">
        {NAV.map((item, index) => (
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
