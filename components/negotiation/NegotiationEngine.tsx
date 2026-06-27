"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { calculateNegotiation, formatMoney } from "@/lib/negotiation/negotiationEngine";

function InputRow({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <input className="rounded-xl border bg-white p-4 outline-none" value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export default function NegotiationEngine() {
  const { user } = useUser();
  const [propertyAddress, setPropertyAddress] = useState("123 Main St, Dallas, TX");
  const [listingPrice, setListingPrice] = useState("850000");
  const [recommendedOffer, setRecommendedOffer] = useState("817500");
  const [fairValue, setFairValue] = useState("885000");
  const [daysOnMarket, setDaysOnMarket] = useState("38");
  const [priceReduction, setPriceReduction] = useState("15000");
  const [sellerCounter, setSellerCounter] = useState("842000");
  const [inspectionConcern, setInspectionConcern] = useState("HVAC age and roof condition");
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function generateNegotiation() {
    setMessage("");
    const input = {
      propertyAddress,
      listingPrice: Number(listingPrice || 0),
      recommendedOffer: Number(recommendedOffer || 0),
      fairValue: Number(fairValue || 0),
      daysOnMarket: Number(daysOnMarket || 0),
      priceReduction: Number(priceReduction || 0),
      sellerCounter: Number(sellerCounter || 0),
      inspectionConcern,
    };
    const calculated = calculateNegotiation(input);
    setResult(calculated);

    try {
      const response = await fetch("/api/negotiation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id || null, input, result: calculated }),
      });
      const data = await response.json();
      setMessage(response.ok ? "Negotiation strategy generated and saved." : data.error || "Generated locally, but could not save.");
    } catch {
      setMessage("Generated locally, but save request failed.");
    }
  }

  function copyEmail() {
    if (!result?.emailDraft) return;
    navigator.clipboard.writeText(result.emailDraft);
    setMessage("Email draft copied.");
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[430px_1fr]">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Negotiation Inputs</p>
        <h2 className="mt-1 text-3xl font-bold">Build a negotiation plan</h2>
        <div className="mt-6 grid gap-4">
          <InputRow label="Property Address" value={propertyAddress} setValue={setPropertyAddress} />
          <InputRow label="Listing Price" value={listingPrice} setValue={setListingPrice} />
          <InputRow label="Recommended Offer" value={recommendedOffer} setValue={setRecommendedOffer} />
          <InputRow label="AI Fair Value" value={fairValue} setValue={setFairValue} />
          <InputRow label="Days on Market" value={daysOnMarket} setValue={setDaysOnMarket} />
          <InputRow label="Price Reduction" value={priceReduction} setValue={setPriceReduction} />
          <InputRow label="Seller Counter Offer" value={sellerCounter} setValue={setSellerCounter} />
          <InputRow label="Inspection Concern" value={inspectionConcern} setValue={setInspectionConcern} />
          <button onClick={generateNegotiation} className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800">Generate Negotiation Strategy</button>
          {message && <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700">{message}</div>}
        </div>
      </div>

      <div className="grid gap-6">
        {!result && (
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">No negotiation strategy yet</h2>
            <p className="mt-3 text-gray-600">Generate a seller motivation score, counter offer, strategy, risk summary, and email draft.</p>
          </div>
        )}

        {result && (
          <>
            <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Negotiation Strategy</p>
              <h2 className="mt-2 text-4xl font-bold">{result.leverageLevel} Leverage</h2>
              <p className="mt-3 text-gray-600">{result.strategy}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">Seller Motivation</p><p className="mt-2 text-4xl font-bold">{result.motivationScore}/100</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">Recommended Counter</p><p className="mt-2 text-4xl font-bold">{formatMoney(result.recommendedCounter)}</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-gray-500">Leverage</p><p className="mt-2 text-4xl font-bold">{result.leverageLevel}</p></div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Talking Points</h3><ul className="mt-4 grid gap-3 text-gray-700">{result.talkingPoints.map((item: string) => <li key={item}>✓ {item}</li>)}</ul></div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Concessions to Ask</h3><ul className="mt-4 grid gap-3 text-gray-700">{result.concessionsToAsk.map((item: string) => <li key={item}>• {item}</li>)}</ul></div>
              <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Inspection Focus</h3><ul className="mt-4 grid gap-3 text-gray-700">{result.inspectionFocus.map((item: string) => <li key={item}>• {item}</li>)}</ul></div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold">Agent Email Draft</h3>
                <button onClick={copyEmail} className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800">Copy Email</button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 text-sm text-gray-800">{result.emailDraft}</pre>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Risk Summary</h3><ul className="mt-4 grid gap-3 text-gray-700">{result.riskSummary.map((item: string) => <li key={item}>⚠ {item}</li>)}</ul></div>
          </>
        )}
      </div>
    </section>
  );
}
