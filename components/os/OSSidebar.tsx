const navItems = [
  ["Dashboard", "/dashboard"],
  ["Analyze", "/analyze"],
  ["Decision", "/intelligence"],
  ["Portfolio", "/portfolio"],
  ["Watchlist", "/watchlist"],
  ["Reports", "/reports"],
  ["Settings", "/pro"],
];

export default function OSSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-white/10 bg-[#050505] p-5 text-white lg:block">
      <a href="/" className="text-xl font-bold">Nestrova</a>

      <nav className="mt-8 grid gap-2">
        {navItems.map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/55 hover:bg-white/10 hover:text-white"
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
