"use client";

import MarketPulseCard from "@/components/intelligence/MarketPulseCard";
import TodayFeed from "@/components/intelligence/TodayFeed";
import AIMemoryCard from "@/components/intelligence/AIMemoryCard";

export default function IntelligencePanel() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[36px] border border-black/10 bg-black p-8 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Nestrova Intelligence</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em]">AI found your next best action.</h2>
        <p className="mt-4 max-w-3xl text-neutral-300">
          The current market signal, valuation spread, and negotiation leverage support generating an offer strategy now.
        </p>
        <a href="/offer" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black">Generate Offer</a>
      </section>
      <div className="grid gap-6 xl:grid-cols-3">
        <MarketPulseCard />
        <TodayFeed />
        <AIMemoryCard />
      </div>
    </div>
  );
}
