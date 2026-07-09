"use client";

import { FormEvent, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { DecisionRequest } from "@/lib/ai/client";

function toOptionalNumber(value: string) {
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return undefined;
  return Number(cleaned || 0);
}

export default function DecisionInputForm({
  initialValue,
  running,
  onSubmit,
}: {
  initialValue: DecisionRequest;
  running?: boolean;
  onSubmit: (input: DecisionRequest) => void;
}) {
  const [form, setForm] = useState({
    address: initialValue.address,
    city: initialValue.city || "",
    state: initialValue.state || "",
    askingPrice: initialValue.askingPrice ? String(initialValue.askingPrice) : "",
    fairValue: initialValue.fairValue ? String(initialValue.fairValue) : "",
    estimatedRent: initialValue.estimatedRent ? String(initialValue.estimatedRent) : "",
    yearBuilt: initialValue.yearBuilt ? String(initialValue.yearBuilt) : "",
    daysOnMarket: initialValue.daysOnMarket ? String(initialValue.daysOnMarket) : "",
    hoaMonthly: initialValue.hoaMonthly ? String(initialValue.hoaMonthly) : "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    onSubmit({
      address: form.address || "Unknown Property",
      city: form.city,
      state: form.state,
      askingPrice: toOptionalNumber(form.askingPrice),
      fairValue: toOptionalNumber(form.fairValue),
      estimatedRent: toOptionalNumber(form.estimatedRent),
      yearBuilt: toOptionalNumber(form.yearBuilt),
      daysOnMarket: toOptionalNumber(form.daysOnMarket),
      hoaMonthly: toOptionalNumber(form.hoaMonthly),
    });
  }

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="grid gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Analyze + Decision
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
            Run a live property decision
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Enter an address. Optional numbers can override the analysis result.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Input label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
          <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
          <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Asking Price Override" value={form.askingPrice} onChange={(e) => update("askingPrice", e.target.value)} inputMode="numeric" />
          <Input label="Fair Value Override" value={form.fairValue} onChange={(e) => update("fairValue", e.target.value)} inputMode="numeric" />
          <Input label="Estimated Rent Override" value={form.estimatedRent} onChange={(e) => update("estimatedRent", e.target.value)} inputMode="numeric" />
          <Input label="Year Built" value={form.yearBuilt} onChange={(e) => update("yearBuilt", e.target.value)} inputMode="numeric" />
          <Input label="Days on Market" value={form.daysOnMarket} onChange={(e) => update("daysOnMarket", e.target.value)} inputMode="numeric" />
          <Input label="HOA Monthly" value={form.hoaMonthly} onChange={(e) => update("hoaMonthly", e.target.value)} inputMode="numeric" />
        </div>

        <Button type="submit" loading={running}>Analyze Property</Button>
      </form>
    </Card>
  );
}

