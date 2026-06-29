"use client";

import { useEffect, useMemo, useState } from "react";
import { commandItems } from "@/lib/intelligence/intelligenceData";

export default function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commandItems;
    return commandItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-6 backdrop-blur-sm">
      <div className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-2xl">
        <div className="border-b border-black/10 p-5">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search property, offer, documents, portfolio..."
            className="w-full bg-transparent text-lg outline-none"
          />
        </div>
        <div className="max-h-[420px] overflow-auto p-3">
          {results.map((item) => (
            <a key={item.label} href={item.href} className="block rounded-2xl px-4 py-3 font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-black">
              {item.label}
            </a>
          ))}
        </div>
        <div className="border-t border-black/10 px-5 py-3 text-xs text-neutral-500">Press Esc to close</div>
      </div>
    </div>
  );
}
