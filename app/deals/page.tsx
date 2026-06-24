"use client";

import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type Deal = {
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  overall_score?: number;
  forecast_score?: number;
  forecast_outlook?: string;
  neighborhood_score?: number;
  neighborhood_grade?: string;
  expected_appreciation?: number;
  confidence_score?: number;
  status: string;
  estimated_monthly_cash_flow: number;
};

type FindDealsResult = {
  city: string;
  state: string;
  max_price: number;
  plan?: string;
  result_limit?: number;
  total_analyzed?: number;
  count?: number;
  deals: Deal[];
};

const API_URL = "https://home-deal-api.onrender.com";

const STARTER_MARKETS = [
  { city: "Irvine", state: "CA", maxPrice: "1500000" },
  { city: "Austin", state: "TX", maxPrice: "750000" },
  { city: "Miami", state: "FL", maxPrice: "700000" },
  { city: "Phoenix", state: "AZ", maxPrice: "650000" },
  { city: "Dallas", state: "TX", maxPrice: "650000" },
];

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function getDealOverallScore(deal: Deal) {
  if (deal.overall_score !== undefined && deal.overall_score !== null) {
    return Number(deal.overall_score);
  }

  const dealScore = Number(deal.deal_score || 0);
  const forecastScore = Number(deal.forecast_score || 50);
  const neighborhoodScore = Number(deal.neighborhood_score || 50);

  return Math.round(
    dealScore * 0.4 + forecastScore * 0.35 + neighborhoodScore * 0.25
  );
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

export default function DealsPage() {
  const { isSignedIn, user } = useUser();

  const [city, setCity] = useState("Irvine");
  const [state, setState] = useState("CA");
  const [maxPrice, setMaxPrice] = useState("1500000");
  const [sortBy, setSortBy] = useState("overall");

  const [result, setResult] = useState<FindDealsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function findDeals(customCity?: string, customState?: string, customMaxPrice?: string) {
    const finalCity = customCity || city;
    const finalState = customState || state;
    const finalMaxPrice = customMaxPrice || maxPrice;

    setMessage("");
    setLoading(true);
    setResult(null);

    if (!finalCity.trim()) {
      setMessage("City is required.");
      setLoading(false);
      return;
    }

    if (!finalState.trim()) {
      setMessage("State is required.");
      setLoading(false);
      return;
    }

    if (!finalMaxPrice || Number(finalMaxPrice) <= 0) {
      setMessage("Please enter a valid max price.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/find-deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          city: finalCity,
          state: finalState,
          max_price: Number(finalMaxPrice),
          limit: 20,
          is_pro: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.detail || "Could not find deals.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setMessage("Server connection failed.");
    }

    setLoading(false);
  }

  async function saveDeal(deal: Deal) {
    setMessage("");

    if (!isSignedIn || !user?.id) {
      setMessage("Please sign in to save deals.");
      return;
    }

    const { data: existingDeal } = await supabase
      .from("saved_deals")
      .select("id")
      .eq("user_id", user.id)
      .eq("address", deal.address)
      .maybeSingle();

    if (existingDeal) {
      setMessage("This property is already in your portfolio.");
      return;
    }

    const { error } = await supabase.from("saved_deals").insert({
      user_id: user.id,
      address: deal.address,
      listing_price: deal.listing_price,
      fair_value: deal.fair_value,
      estimated_monthly_rent: deal.estimated_monthly_rent,
      discount_percent: deal.discount_percent,
      gross_rent_yield: deal.gross_rent_yield,
      deal_score: deal.deal_score,
      status: deal.status,
      estimated_monthly_cash_flow: deal.estimated_monthly_cash_flow,
    });

    if (error) {
      setMessage("Could not save this deal.");
      return;
    }

    setMessage("Deal saved to your portfolio.");
  }

  function useStarterMarket(market: { city: string; state: string; maxPrice: string }) {
    setCity(market.city);
    setState(market.state);
    setMaxPrice(market.maxPrice);
    findDeals(market.city, market.state, market.maxPrice);
  }

  const sortedDeals = [...(result?.deals || [])].sort((a, b) => {
    if (sortBy === "yield") {
      return Number(b.gross_rent_yield || 0) - Number(a.gross_rent_yield || 0);
    }

    if (sortBy === "cashflow") {
      return (
        Number(b.estimated_monthly_cash_flow || 0) -
        Number(a.estimated_monthly_cash_flow || 0)
      );
    }

    if (sortBy === "discount") {
      return Number(b.discount_percent || 0) - Number(a.discount_percent || 0);
    }

    return getDealOverallScore(b) - getDealOverallScore(a);
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ← Back to Nestrova
          </a>

          <div className="flex items-center gap-4">
            <a href="/portfolio" className="text-sm font-semibold text-gray-600 hover:text-black">
              Portfolio
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
        </div>

        <section className="mb-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Deal Finder
          </p>

          <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
            Find High-Potential Real Estate Deals
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Search a market, rank properties by investment quality, and save the
            strongest opportunities to your portfolio.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {STARTER_MARKETS.map((market) => (
              <button
                key={`${market.city}-${market.state}`}
                onClick={() => useStarterMarket(market)}
                className="rounded-full border bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {market.city}, {market.state}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-5">
            <input
              className="rounded-lg border p-4"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              className="rounded-lg border p-4"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
            />

            <input
              className="rounded-lg border p-4"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <select
              className="rounded-lg border p-4"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="overall">Sort: Overall Score</option>
              <option value="yield">Sort: Rent Yield</option>
              <option value="cashflow">Sort: Cash Flow</option>
              <option value="discount">Sort: Discount</option>
            </select>

            <button
              onClick={() => findDeals()}
              disabled={loading}
              className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Searching..." : "Find Deals"}
            </button>
          </div>

          {message && (
            <div className="mt-4 rounded-lg bg-gray-100 p-4 text-gray-800">
              {message}
            </div>
          )}
        </section>

        {result && (
          <section className="rounded-2xl bg-white p-6 shadow">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  {sortedDeals.length} RESULTS
                </p>
                <h2 className="text-3xl font-bold">
                  Best Deals in {result.city}, {result.state}
                </h2>
                <p className="mt-2 text-gray-600">
                  Total analyzed:{" "}
                  {result.total_analyzed || result.count || sortedDeals.length}
                </p>
              </div>

              <a
                href="/portfolio"
                className="rounded-lg border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                View Portfolio
              </a>
            </div>

            <div className="grid gap-5">
              {sortedDeals.map((deal, index) => {
                const overallScore = getDealOverallScore(deal);
                const grade = getInvestmentGrade(overallScore);

                return (
                  <div key={`${deal.address}-${index}`} className="rounded-2xl border p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          #{index + 1} Investment Match
                        </p>

                        <h3 className="mt-1 text-2xl font-bold">{deal.address}</h3>

                        <p className="mt-2 font-semibold text-gray-700">
                          {deal.status}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
                            Yield {deal.gross_rent_yield}%
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
                            Discount {Number(deal.discount_percent || 0).toFixed(2)}%
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
                            Cash Flow {money(deal.estimated_monthly_cash_flow)}/mo
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border-2 border-black p-5 text-center">
                        <p className="text-sm text-gray-500">Overall Score</p>
                        <p className="text-5xl font-bold">{grade}</p>
                        <p className="mt-1 text-2xl font-semibold">
                          {overallScore}/100
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-5">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-bold">{money(deal.listing_price)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Fair Value</p>
                        <p className="text-lg font-bold">{money(deal.fair_value)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p className="text-lg font-bold">
                          {money(deal.estimated_monthly_rent)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Deal Score</p>
                        <p className="text-lg font-bold">{deal.deal_score}/100</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Cash Flow</p>
                        <p className="text-lg font-bold">
                          {money(deal.estimated_monthly_cash_flow)}/mo
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => saveDeal(deal)}
                        className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                      >
                        Save to Portfolio
                      </button>

                      <a
                        href={`/?address=${encodeURIComponent(deal.address)}`}
                        className="rounded-lg border px-5 py-3 text-center font-semibold hover:bg-gray-50"
                      >
                        Analyze Property
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
