"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type SavedDeal = {
  id: string;
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
};

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function grade(score: number) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  return "C";
}

export default function ComparePage() {
  const { isSignedIn, user } = useUser();
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [selected, setSelected] = useState<SavedDeal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn && user?.id) loadDeals();
  }, [isSignedIn, user?.id]);

  async function loadDeals() {
    if (!user?.id) return;
    setLoading(true);

    const { data } = await supabase
      .from("saved_deals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setDeals((data || []) as SavedDeal[]);
    setLoading(false);
  }

  function toggle(deal: SavedDeal) {
    const exists = selected.some((item) => item.id === deal.id);
    if (exists) {
      setSelected(selected.filter((item) => item.id !== deal.id));
      return;
    }

    if (selected.length >= 3) return;
    setSelected([...selected, deal]);
  }

  const winner = useMemo(() => {
    if (selected.length < 2) return null;
    return [...selected].sort(
      (a, b) =>
        Number(b.deal_score || 0) - Number(a.deal_score || 0) ||
        Number(b.estimated_monthly_cash_flow || 0) -
          Number(a.estimated_monthly_cash_flow || 0)
    )[0];
  }, [selected]);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ← Back to Nestrova
          </a>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        <section className="mb-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            AI Compare
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Compare Saved Properties
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Select up to three saved properties and compare investment quality side by side.
          </p>
        </section>

        {!isSignedIn && (
          <div className="rounded-2xl bg-yellow-50 p-6 text-yellow-900">
            Please sign in to compare your saved properties.
          </div>
        )}

        {isSignedIn && (
          <>
            {winner && (
              <div className="mb-8 rounded-2xl border-2 border-black bg-white p-6 shadow">
                <p className="text-sm font-semibold text-gray-500">AI RECOMMENDED PICK</p>
                <h2 className="mt-2 text-2xl font-bold">{winner.address}</h2>
                <p className="mt-2 text-gray-700">
                  This property currently leads based on deal score and projected cash flow.
                  Verify inspections, financing, HOA, taxes, and local comparables before making decisions.
                </p>
              </div>
            )}

            <section className="mb-8 rounded-2xl bg-white p-6 shadow">
              <h2 className="text-2xl font-bold">Choose Properties</h2>
              {loading && <p className="mt-4 text-gray-600">Loading...</p>}
              <div className="mt-5 grid gap-3">
                {deals.map((deal) => {
                  const active = selected.some((item) => item.id === deal.id);
                  return (
                    <button
                      key={deal.id}
                      onClick={() => toggle(deal)}
                      className={`rounded-2xl border p-4 text-left font-semibold ${
                        active ? "border-black bg-gray-100" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {deal.address} · Score {deal.deal_score}/100 · Yield{" "}
                      {deal.gross_rent_yield}%
                    </button>
                  );
                })}
              </div>
            </section>

            {selected.length > 0 && (
              <section className="rounded-2xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Comparison</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                        <th className="p-4">Metric</th>
                        {selected.map((deal) => (
                          <th key={deal.id} className="p-4">{deal.address}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Grade", (d: SavedDeal) => grade(Number(d.deal_score || 0))],
                        ["Deal Score", (d: SavedDeal) => `${d.deal_score}/100`],
                        ["Listing Price", (d: SavedDeal) => money(d.listing_price)],
                        ["Fair Value", (d: SavedDeal) => money(d.fair_value)],
                        ["Rent Yield", (d: SavedDeal) => `${d.gross_rent_yield}%`],
                        ["Cash Flow", (d: SavedDeal) => `${money(d.estimated_monthly_cash_flow)}/mo`],
                        ["Status", (d: SavedDeal) => d.status],
                      ].map(([label, getter]) => (
                        <tr key={String(label)} className="border-b">
                          <td className="p-4 font-bold">{String(label)}</td>
                          {selected.map((deal) => (
                            <td key={deal.id} className="p-4">
                              {(getter as (d: SavedDeal) => string)(deal)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
