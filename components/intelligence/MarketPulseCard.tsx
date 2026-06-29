"use client";

import { intelligenceFeed } from "@/lib/intelligence/intelligenceData";

export default function MarketPulseCard() {
  const pulse = intelligenceFeed.marketPulse;
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Market Pulse</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">{pulse.market}</h3>
          <p className="mt-2 text-sm text-neutral-600">Buyer opportunity remains favorable.</p>
        </div>
        <div className="rounded-3xl bg-black px-5 py-4 text-white">
          <p className="text-xs text-neutral-400">Health</p>
          <p className="text-3xl font-semibold">{pulse.health}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Buyer Power", pulse.buyerPower],
          ["Inventory", pulse.inventory],
          ["Momentum", pulse.momentum],
          ["Negotiation", pulse.negotiationPower],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-neutral-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
