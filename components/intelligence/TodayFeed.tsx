"use client";

import { intelligenceFeed } from "@/lib/intelligence/intelligenceData";

export default function TodayFeed() {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Today's Feed</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">Nestrova found new signals</h3>
      <div className="mt-5 grid gap-3">
        {intelligenceFeed.opportunities.map((item, index) => (
          <div key={item} className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-xs font-semibold text-neutral-500">Signal {index + 1}</p>
            <p className="mt-1 text-sm font-medium text-neutral-800">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
