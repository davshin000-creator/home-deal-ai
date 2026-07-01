"use client";

import { useState } from "react";

export default function ScenarioSimulator() {
  const [price, setPrice] = useState(817500);
  const [rent, setRent] = useState(4200);

  const annualRent = rent * 12;
  const grossYield = price > 0 ? (annualRent / price) * 100 : 0;

  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Scenario Simulator
      </p>

      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">
        Test property assumptions
      </h1>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Adjust price and rent to preview estimated gross rental yield.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-neutral-800">Purchase Price</span>
          <input
            value={price}
            onChange={(e) => setPrice(Number(e.target.value || 0))}
            className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:ring-4 focus:ring-black/5"
            inputMode="numeric"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-neutral-800">Monthly Rent</span>
          <input
            value={rent}
            onChange={(e) => setRent(Number(e.target.value || 0))}
            className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:ring-4 focus:ring-black/5"
            inputMode="numeric"
          />
        </label>
      </div>

      <div className="mt-6 rounded-[24px] bg-neutral-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Gross Yield
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-neutral-950">
          {grossYield.toFixed(2)}%
        </p>
      </div>
    </section>
  );
}
