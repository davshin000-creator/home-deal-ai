"use client";

import { useState } from "react";

export default function GrowthPage() {
  const [address, setAddress] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [dealScore, setDealScore] = useState("");
  const [status, setStatus] = useState("");
  const [ideas, setIdeas] = useState<any[]>([]);

  async function generateIdeas() {
    const response = await fetch("/api/content-ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, listing_price: Number(listingPrice || 0), deal_score: Number(dealScore || 0), status }),
    });

    const data = await response.json();
    setIdeas(data.ideas || []);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-semibold text-white/50 hover:text-white">??Back</a>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Growth Engine</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em]">Turn property analysis into launch content.</h1>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          <input className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" placeholder="Listing price" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} />
          <input className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" placeholder="Deal score" value={dealScore} onChange={(e) => setDealScore(e.target.value)} />
          <input className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>

        <button onClick={generateIdeas} className="mt-4 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black">Generate Content Ideas</button>

        <div className="mt-8 grid gap-5">
          {ideas.map((idea, i) => (
            <div key={i} className="rounded-[34px] border border-white/10 bg-white/[0.06] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">{idea.platform}</p>
              <h2 className="mt-2 text-3xl font-semibold">{idea.title}</h2>
              <p className="mt-3 text-white/60">{idea.hook}</p>
              <div className="mt-5 grid gap-2">
                {(idea.script || []).map((line: string, idx: number) => (
                  <p key={idx} className="rounded-2xl bg-black/25 p-3 text-sm text-white/65">{idx + 1}. {line}</p>
                ))}
              </div>
              <p className="mt-5 text-sm text-white/45">{idea.caption}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

