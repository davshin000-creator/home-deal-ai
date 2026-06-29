"use client";

import { intelligenceFeed } from "@/lib/intelligence/intelligenceData";

export default function AIMemoryCard() {
  const memory = intelligenceFeed.memory;
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">AI Memory</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">Personalized investor profile</h3>
      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Style</p><p className="font-semibold">{memory.style}</p></div>
        <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Budget</p><p className="font-semibold">{memory.budget}</p></div>
        <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Preferred Markets</p><p className="font-semibold">{memory.preferredMarkets.join(", ")}</p></div>
        <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Goal</p><p className="font-semibold">{memory.goal}</p></div>
      </div>
    </section>
  );
}
