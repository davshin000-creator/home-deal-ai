"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Favorite = {
  id: string;
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  deal_score: number;
  overall_score: number;
  status: string;
};

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

export default function FavoritesPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [items, setItems] = useState<Favorite[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setSignedIn(Boolean(data.user));
      if (data.user) loadFavorites();
    }
    init();
  }, []);

  async function loadFavorites() {
    const response = await fetch("/api/favorites", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Could not load favorites.");
    setItems(data.items || []);
  }

  async function removeFavorite(item: Favorite) {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Could not remove favorite.");
    setItems((prev) => prev.filter((fav) => fav.id !== item.id));
  }

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-[#050505] p-8 text-white">
        <div className="mx-auto max-w-xl rounded-[40px] border border-white/10 bg-white/[0.07] p-8">
          <h1 className="text-5xl font-semibold tracking-[-0.06em]">Favorites</h1>
          <p className="mt-4 text-white/55">Sign in to view your favorite properties.</p>
          <a href="/login" className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">Sign In</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm font-semibold text-white/50 hover:text-white">??Dashboard</a>
          <a href="/analyze" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Analyze Property</a>
        </div>
        <h1 className="mt-8 text-6xl font-semibold tracking-[-0.07em]">Favorites</h1>
        <p className="mt-4 text-white/55">Your shortlist of properties worth watching closely.</p>
        {message && <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white/70">{message}</div>}
        <section className="mt-8 grid gap-4">
          {items.length === 0 && <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-white/55">No favorites yet.</div>}
          {items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">{item.status || "Favorite"}</p>
              <h2 className="mt-2 text-2xl font-semibold">{item.address}</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-black/25 p-4"><p className="text-xs text-white/35">Price</p><p className="mt-1 font-semibold">{money(item.listing_price)}</p></div>
                <div className="rounded-2xl bg-black/25 p-4"><p className="text-xs text-white/35">Fair Value</p><p className="mt-1 font-semibold">{money(item.fair_value)}</p></div>
                <div className="rounded-2xl bg-black/25 p-4"><p className="text-xs text-white/35">Rent</p><p className="mt-1 font-semibold">{money(item.estimated_monthly_rent)}</p></div>
                <div className="rounded-2xl bg-black/25 p-4"><p className="text-xs text-white/35">Score</p><p className="mt-1 font-semibold">{item.overall_score || item.deal_score}/100</p></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`/analyze?address=${encodeURIComponent(item.address)}&listing_price=${encodeURIComponent(String(item.listing_price))}`} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Analyze Again</a>
                <button onClick={() => removeFavorite(item)} className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65">Remove</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

