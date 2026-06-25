"use client";

import { useEffect, useMemo, useState } from "react";

const QUICK_LINKS = [
  { label: "Analyze Property", href: "/", keywords: "analyze property address valuation" },
  { label: "Find Deals", href: "/deals", keywords: "deals finder opportunities" },
  { label: "Portfolio", href: "/portfolio", keywords: "portfolio saved properties" },
  { label: "AI Coach", href: "/coach", keywords: "coach investment strategy budget" },
  { label: "Markets", href: "/markets", keywords: "markets city heat map dallas austin phoenix miami irvine" },
  { label: "Compare", href: "/compare", keywords: "compare properties" },
  { label: "Watchlist", href: "/watchlist", keywords: "watchlist alerts price drop" },
  { label: "Pricing", href: "/pricing", keywords: "pricing pro upgrade" },
  { label: "Admin", href: "/admin", keywords: "admin dashboard operations" },
];

export default function UniversalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return QUICK_LINKS.slice(0, 6);

    const base = QUICK_LINKS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );

    const cityMatches = ["dallas", "austin", "phoenix", "miami", "irvine"].filter((city) =>
      city.includes(q)
    );

    const cityResults = cityMatches.map((city) => ({
      label: `Find deals in ${city[0].toUpperCase() + city.slice(1)}`,
      href: `/deals?city=${encodeURIComponent(city)}`,
      keywords: city,
    }));

    const looksLikeAddress = q.length > 8 && /\d/.test(q);

    const addressResult = looksLikeAddress
      ? [
          {
            label: `Analyze "${query}"`,
            href: `/?address=${encodeURIComponent(query)}`,
            keywords: query,
          },
        ]
      : [];

    return [...addressResult, ...cityResults, ...base].slice(0, 8);
  }, [query]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <div className="rounded-3xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <input
            className="w-full bg-transparent p-2 outline-none"
            placeholder="Search anything... city, address, report, coach, portfolio"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
            Ctrl K
          </span>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[78px] z-40 rounded-3xl border bg-white p-3 shadow-xl">
          <div className="grid gap-2">
            {results.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="rounded-2xl px-4 py-3 font-semibold hover:bg-gray-50"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
