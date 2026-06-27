"use client";

import { sampleWorkspace } from "../../lib/os/sampleWorkspaceData";

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function PropertyHero() {
  const property = sampleWorkspace.property;

  return (
    <section className="overflow-hidden rounded-[36px] border border-black/10 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 p-8 shadow-sm">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Current Workspace
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em] text-neutral-950 md:text-6xl">
            {property.address}
          </h1>
          <p className="mt-3 text-lg text-neutral-600">
            {property.city}, {property.state} · {property.status}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-black p-5 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">Decision</p>
            <p className="mt-2 text-3xl font-semibold">{property.recommendation}</p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Deal Score</p>
            <p className="mt-2 text-3xl font-semibold">{property.dealScore}</p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Confidence</p>
            <p className="mt-2 text-3xl font-semibold">{property.confidence}%</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-5">
          <p className="text-sm text-neutral-500">AI Fair Value</p>
          <p className="mt-2 text-2xl font-semibold">{money(property.fairValue)}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-5">
          <p className="text-sm text-neutral-500">Suggested Offer</p>
          <p className="mt-2 text-2xl font-semibold">{money(property.suggestedOffer)}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-5">
          <p className="text-sm text-neutral-500">Rental Yield</p>
          <p className="mt-2 text-2xl font-semibold">{property.rentalYield}%</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-5">
          <p className="text-sm text-neutral-500">Appreciation</p>
          <p className="mt-2 text-2xl font-semibold">{property.appreciation}%</p>
        </div>
      </div>
    </section>
  );
}
