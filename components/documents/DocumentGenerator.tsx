"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { OfferDocumentInput, createAgentEmail, createPrintableHtml, formatMoney } from "@/lib/documents/documentEngine";

function TextInput({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <input className="rounded-xl border bg-white p-4 outline-none" value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}

export default function DocumentGenerator() {
  const { user } = useUser();
  const [propertyAddress, setPropertyAddress] = useState("123 Main St, Dallas, TX");
  const [listingPrice, setListingPrice] = useState("850000");
  const [fairValue, setFairValue] = useState("885000");
  const [recommendedOffer, setRecommendedOffer] = useState("817500");
  const [maxOffer, setMaxOffer] = useState("841000");
  const [walkAwayPrice, setWalkAwayPrice] = useState("865000");
  const [offerStrength, setOfferStrength] = useState("94");
  const [confidence, setConfidence] = useState("96");
  const [leverage, setLeverage] = useState("Strong");
  const [strategy, setStrategy] = useState("Use a confident but respectful anchor. Lead with data, keep contingencies, and ask for seller concessions.");
  const [documentHtml, setDocumentHtml] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function buildInput(): OfferDocumentInput {
    return {
      propertyAddress,
      listingPrice: Number(listingPrice || 0),
      fairValue: Number(fairValue || 0),
      recommendedOffer: Number(recommendedOffer || 0),
      maxOffer: Number(maxOffer || 0),
      walkAwayPrice: Number(walkAwayPrice || 0),
      offerStrength: Number(offerStrength || 0),
      confidence: Number(confidence || 0),
      leverage,
      strategy,
      talkingPoints: [
        `${formatMoney(Number(recommendedOffer || 0))} recommended offer based on listing price and fair value.`,
        `Estimated fair value reviewed at ${formatMoney(Number(fairValue || 0))}.`,
        "Offer includes room for inspection and due diligence.",
      ],
      concessions: ["Seller credit toward closing costs", "Repair credit after inspection", "Flexible closing timeline"],
      inspectionFocus: ["Roof", "HVAC", "Foundation", "Electrical", "Plumbing", "Insurance-related issues"],
      risks: [
        "Verify comparable sales with a licensed real estate professional.",
        "Confirm financing, inspection, HOA, insurance, and property tax assumptions.",
        "Have offer documents reviewed by qualified professionals.",
      ],
    };
  }

  async function generateDocument() {
    setMessage("");
    const input = buildInput();
    const html = createPrintableHtml(input);
    const emailDraft = createAgentEmail(input);
    setDocumentHtml(html);
    setEmail(emailDraft);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user?.id || null, property_address: propertyAddress, document_type: "offer_strategy", html, email: emailDraft, payload: input }),
      });
      const data = await response.json();
      setMessage(response.ok ? "Document generated and saved." : data.error || "Generated locally, but could not save.");
    } catch {
      setMessage("Generated locally, but save request failed.");
    }
  }

  function downloadHtml() {
    if (!documentHtml) return;
    const blob = new Blob([documentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = "nestrova-offer-strategy.html";
    element.click();
    URL.revokeObjectURL(url);
  }

  function printDocument() {
    if (!documentHtml) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(documentHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function copyEmail() {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setMessage("Email copied.");
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[430px_1fr]">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Document Inputs</p>
        <h2 className="mt-1 text-3xl font-bold">Create an offer document</h2>
        <div className="mt-6 grid gap-4">
          <TextInput label="Property Address" value={propertyAddress} setValue={setPropertyAddress} />
          <TextInput label="Listing Price" value={listingPrice} setValue={setListingPrice} />
          <TextInput label="AI Fair Value" value={fairValue} setValue={setFairValue} />
          <TextInput label="Recommended Offer" value={recommendedOffer} setValue={setRecommendedOffer} />
          <TextInput label="Max Offer" value={maxOffer} setValue={setMaxOffer} />
          <TextInput label="Walk Away Price" value={walkAwayPrice} setValue={setWalkAwayPrice} />
          <TextInput label="Offer Strength" value={offerStrength} setValue={setOfferStrength} />
          <TextInput label="AI Confidence" value={confidence} setValue={setConfidence} />
          <TextInput label="Leverage" value={leverage} setValue={setLeverage} />
          <label className="grid gap-2"><span className="font-semibold text-gray-700">Strategy</span><textarea className="min-h-[120px] rounded-xl border bg-white p-4 outline-none" value={strategy} onChange={(e) => setStrategy(e.target.value)} /></label>
          <button onClick={generateDocument} className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800">Generate Document</button>
          {message && <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-700">{message}</div>}
        </div>
      </div>

      <div className="grid gap-6">
        {!documentHtml && <div className="rounded-3xl border bg-white p-8 shadow-sm"><h2 className="text-3xl font-bold">No document generated yet</h2><p className="mt-3 text-gray-600">Generate a printable offer strategy and agent email draft.</p></div>}
        {documentHtml && (
          <>
            <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Offer Strategy Document</p>
              <h2 className="mt-2 text-4xl font-bold">{formatMoney(Number(recommendedOffer || 0))}</h2>
              <p className="mt-3 text-gray-600">Generated for {propertyAddress}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={downloadHtml} className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800">Download HTML</button>
                <button onClick={printDocument} className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50">Print / Save PDF</button>
                <button onClick={copyEmail} className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50">Copy Email</button>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Agent Email Draft</h3><pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 text-sm text-gray-800">{email}</pre></div>
            <div className="rounded-3xl bg-white p-6 shadow-sm"><h3 className="text-2xl font-bold">Document Preview</h3><iframe className="mt-4 h-[640px] w-full rounded-2xl border bg-white" srcDoc={documentHtml} /></div>
          </>
        )}
      </div>
    </section>
  );
}
