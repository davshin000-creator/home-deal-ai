"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { calculateOffer, formatMoney, OfferInput, OfferResult } from "@/lib/offer/offerEngine";

function InputRow({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <input className="rounded-xl border bg-white p-4 outline-none" value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export default function OfferGenerator() {
  const { user } = useUser();
  const [propertyAddress, setPropertyAddress] = useState("123 Main St, Dallas, TX");
  const [listingPrice, setListingPrice] = useState("850000");
  const [fairValue, setFairValue] = useState("885000");
  const [estimatedRent, setEstimatedRent] = useState("4800");
  const [dealScore, setDealScore] = useState("92");
  const [daysOnMarket, setDaysOnMarket] = useState("38");
  const [priceReduction, setPriceReduction] = useState("15000");
  const [repairCredit, setRepairCredit] = useState("5000");
  const [result, setResult] = useState<OfferResult | null>(null);
  const [message, setMessage] = useState("");

  function buildInput(): OfferInput {
    return {
      propertyAddress,
      listingPrice: Number(listingPrice || 0),
      fairValue: Number(fairValue || 0),
      estimatedRent: Number(estimatedRent || 0),
      dealScore: Number(dealScore || 0),
      daysOnMarket: Number(daysOnMarket || 0),
      priceReduction: Number(priceReduction || 0),
      repairCredit: Number(repairCredit || 0),
    };
  }

  async function generateOffer() {
    setMessage("");
    const input = buildInput();
    const calculated = calculateOffer(input);
    setResult(calculated);
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id || null, property: input, result: calculated }),
      });
      const data = await response.json();
      setMessage(response.ok ? "Offer strategy generated and saved." : data.error || "Offer generated locally, but could not be saved.");
    } catch {
      setMessage("Offer generated locally, but save request failed.");
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[430px_1fr]">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Offer Inputs</p>
        <h2 className="mt-1 text-3xl font-bold">Build an offer strategy</h2>
        <div className="mt-6 grid gap-4">
          <InputRow label="Property Address" value={propertyAddress} setValue={setPropertyAddress} />
          <InputRow label="Listing Price" value={listingPrice} setValue={setListingPrice} />
          <InputRow label="AI Fair Value" value={fairValue} setValue={setFairValue} />
          <InputRow label="Estimated Monthly Rent" value={estimatedRent} setValue={setEstimatedRent} />
          <InputRow label="Deal Score" value={dealScore} setValue={setDealScore} />
          <InputRow label="Days on Market" value={daysOnMarket} setValue={setDaysOnMarket} />
          <InputRow label="Price Reduction" value={priceReduction} setValue={setPriceReduction} />
          <InputRow label="Repair Credit" value={repairCredit} setValue={setRepairCredit} />
          <button onClick={generateOffer} className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800">Generate Offer Strategy</button>
          {message && <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700">{message}</div>}
        </div>
      </div>

      <div className="grid gap-6">
        {!result && (
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">No offer generated yet</h2>
            <p className="mt-3 text-gray-600">Enter property assumptions and generate an AI-assisted offer strategy.</p>
          </div>
        )}
        {result && (
          <>
            <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Recommended Offer</p>
              <h2 className="mt-2 text-6xl font-bold">{formatMoney(result.recommendedOffer)}</h2>
              <p className="mt-3 text-gray-600">Max offer: <strong>{formatMoney(result.maxOffer)}</strong> · Walk-away: <strong>{formatMoney(result.walkAwayPrice)}</strong></p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">Offer Strength</p><p className="mt-2 text-4xl font-bold">{result.offerStrength}/100</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">AI Confidence</p><p className="mt-2 text-4xl font-bold">{result.confidence}%</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">Leverage</p><p className="mt-2 text-4xl font-bold">{result.leverage}</p></div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Why this offer?</h3><ul className="mt-4 grid gap-3 text-gray-700">{result.why.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
            <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Risk reminders</h3><ul className="mt-4 grid gap-3 text-gray-700">{result.risks.map((item) => <li key={item}>⚠ {item}</li>)}</ul></div>
          </>
        )}
      </div>
    </section>
  );
}
