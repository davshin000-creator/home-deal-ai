"use client";

import { useState } from "react";

export default function UniversalSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-4 shadow-sm">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search address, market, report..."
        className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none focus:ring-4 focus:ring-black/5"
      />
    </div>
  );
}

