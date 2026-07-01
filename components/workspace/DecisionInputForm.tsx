"use client";

import { FormEvent, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { DecisionRequest } from "@/lib/ai/client";

function toNumber(value: string) {
  return Number(value.replace(/,/g, "").trim() || 0);
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
    askingPrice: String(initialValue.askingPrice),
    fairValue: String(initialValue.fairValue),
    estimatedRent: String(initialValue.estimatedRent),
    yearBuilt: String(initialValue.yearBuilt || ""),
    daysOnMarket: String(initialValue.daysOnMarket || ""),
    hoaMonthly: String(initialValue.hoaMonthly || ""),
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
      askingPrice: toNumber(form.askingPrice),
      fairValue: toNumber(form.fairValue),
      estimatedRent: toNumber(form.estimatedRent),
      yearBuilt: form.yearBuilt ? toNumber(form.yearBuilt) : undefined,
      daysOnMarket: form.daysOnMarket ? toNumber(form.daysOnMarket) : undefined,
      hoaMonthly: form.hoaMonthly ? toNumber(form.hoaMonthly) : undefined,
    });
  }

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="grid gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Decision Input</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Run a live AI decision</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Change assumptions and Nestrova will recalculate recommendation, scores, risks, and offers.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Input label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
          <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
          <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Asking Price" value={form.askingPrice} onChange={(e) => update("askingPrice", e.target.value)} inputMode="numeric" />
          <Input label="Fair Value" value={form.fairValue} onChange={(e) => update("fairValue", e.target.value)} inputMode="numeric" />
          <Input label="Estimated Rent" value={form.estimatedRent} onChange={(e) => update("estimatedRent", e.target.value)} inputMode="numeric" />
          <Input label="Year Built" value={form.yearBuilt} onChange={(e) => update("yearBuilt", e.target.value)} inputMode="numeric" />
          <Input label="Days on Market" value={form.daysOnMarket} onChange={(e) => update("daysOnMarket", e.target.value)} inputMode="numeric" />
          <Input label="HOA Monthly" value={form.hoaMonthly} onChange={(e) => update("hoaMonthly", e.target.value)} inputMode="numeric" />
        </div>

        <Button type="submit" loading={running}>Run AI Decision</Button>
      </form>
    </Card>
  );
}
