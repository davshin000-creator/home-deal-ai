"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type SavedDeal = {
  id: string;
  user_id: string;
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
  created_at: string;
};

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function getInvestmentGrade(score: number) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  return "D";
}

export default function PortfolioPage() {
  const { isSignedIn, user } = useUser();
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadPortfolio();
    } else {
      setDeals([]);
    }
  }, [isSignedIn, user?.id]);

  async function loadPortfolio() {
    if (!user?.id) return;
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("saved_deals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load your portfolio.");
      setLoading(false);
      return;
    }

    setDeals((data || []) as SavedDeal[]);
    setLoading(false);
  }

  async function removeDeal(dealId: string) {
    if (!user?.id) return;

    const { error } = await supabase
      .from("saved_deals")
      .delete()
      .eq("id", dealId)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Could not remove this property.");
      return;
    }

    setMessage("Property removed from portfolio.");
    await loadPortfolio();
  }

  const stats = useMemo(() => {
    if (deals.length === 0) {
      return {
        count: 0,
        avgScore: 0,
        avgYield: 0,
        avgCashFlow: 0,
        totalListingValue: 0,
        bestDeal: null as SavedDeal | null,
      };
    }

    const avgScore = Math.round(
      deals.reduce((sum, deal) => sum + Number(deal.deal_score || 0), 0) /
        deals.length
    );

    const avgYield =
      deals.reduce((sum, deal) => sum + Number(deal.gross_rent_yield || 0), 0) /
      deals.length;

    const avgCashFlow = Math.round(
      deals.reduce(
        (sum, deal) => sum + Number(deal.estimated_monthly_cash_flow || 0),
        0
      ) / deals.length
    );

    const totalListingValue = deals.reduce(
      (sum, deal) => sum + Number(deal.listing_price || 0),
      0
    );

    const bestDeal = deals.reduce((best, current) =>
      Number(current.deal_score || 0) > Number(best.deal_score || 0)
        ? current
        : best
    );

    return {
      count: deals.length,
      avgScore,
      avgYield,
      avgCashFlow,
      totalListingValue,
      bestDeal,
    };
  }, [deals]);

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
            Portfolio
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
            My Saved Property Portfolio
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Track saved investment properties, compare scores, review cash flow,
            and quickly identify your strongest opportunities.
          </p>
        </section>

        {!isSignedIn && (
          <div className="rounded-2xl bg-yellow-50 p-6 text-yellow-900">
            Please sign in to view your portfolio.
          </div>
        )}

        {isSignedIn && (
          <>
            {message && (
              <div className="mb-6 rounded-2xl bg-gray-100 p-4 text-gray-800">
                {message}
              </div>
            )}

            {loading && (
              <div className="rounded-2xl bg-white p-6 shadow">
                Loading portfolio...
              </div>
            )}

            {!loading && (
              <>
                <div className="mb-8 grid gap-4 md:grid-cols-5">
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Saved Properties</p>
                    <p className="mt-2 text-3xl font-bold">{stats.count}</p>
                  </div>
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Average Score</p>
                    <p className="mt-2 text-3xl font-bold">{stats.avgScore}/100</p>
                  </div>
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Average Yield</p>
                    <p className="mt-2 text-3xl font-bold">{stats.avgYield.toFixed(2)}%</p>
                  </div>
                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Average Cash Flow</p>
                    <p className="mt-2 text-3xl font-bold">{money(stats.avgCashFlow)}/mo</p>
                  </div>
                  <div className="rounded-2xl border-2 border-black bg-black p-5 text-white shadow-sm">
                    <p className="text-sm font-semibold text-gray-300">Portfolio Value</p>
                    <p className="mt-2 text-3xl font-bold">{money(stats.totalListingValue)}</p>
                  </div>
                </div>

                {stats.bestDeal && (
                  <div className="mb-8 rounded-2xl border-2 border-black bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">BEST SAVED OPPORTUNITY</p>
                    <h2 className="mt-2 text-2xl font-bold">{stats.bestDeal.address}</h2>
                    <p className="mt-2 text-gray-600">
                      Score {stats.bestDeal.deal_score}/100 · Grade {getInvestmentGrade(Number(stats.bestDeal.deal_score || 0))} · Yield {stats.bestDeal.gross_rent_yield}% · Cash Flow {money(stats.bestDeal.estimated_monthly_cash_flow)}/mo
                    </p>
                  </div>
                )}

                {deals.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center shadow">
                    <h2 className="text-2xl font-bold">No saved properties yet</h2>
                    <p className="mt-2 text-gray-600">
                      Analyze or find properties, then save your favorite deals to build your portfolio.
                    </p>
                    <a href="/" className="mt-5 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white">
                      Analyze Properties
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-6 shadow">
                    <div className="mb-5">
                      <h2 className="text-3xl font-bold">Saved Properties</h2>
                      <p className="mt-1 text-gray-600">
                        Review your saved properties and remove anything you no longer want to track.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                          <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                            <th className="p-4">Property</th>
                            <th className="p-4">Grade</th>
                            <th className="p-4">Score</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Fair Value</th>
                            <th className="p-4">Yield</th>
                            <th className="p-4">Cash Flow</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deals.map((deal) => (
                            <tr key={deal.id} className="border-b">
                              <td className="p-4 font-semibold">{deal.address}</td>
                              <td className="p-4">
                                <span className="rounded-full bg-black px-3 py-1 text-sm font-bold text-white">
                                  {getInvestmentGrade(Number(deal.deal_score || 0))}
                                </span>
                              </td>
                              <td className="p-4">{deal.deal_score}/100</td>
                              <td className="p-4">{money(deal.listing_price)}</td>
                              <td className="p-4">{money(deal.fair_value)}</td>
                              <td className="p-4">{deal.gross_rent_yield}%</td>
                              <td className="p-4">{money(deal.estimated_monthly_cash_flow)}/mo</td>
                              <td className="p-4">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                                  {deal.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => removeDeal(deal.id)}
                                  className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
