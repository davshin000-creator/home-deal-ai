"use client";

import { useState } from "react";

type AnalyzeResult = {
  address: string;
  listing_price: number;
  fair_value: number;
  gross_rent_yield: number;
  status: string;
  deal_score: number;
  summary: string;
  estimated_monthly_cash_flow: number;
};

type Deal = {
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
};

type FindDealsResult = {
  city: string;
  state: string;
  max_price: number;
  plan: string;
  result_limit: number;
  total_analyzed: number;
  deals: Deal[];
};

const API_URL = "https://home-deal-api.onrender.com";
const isPro = false;

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function Home() {
  const [address, setAddress] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("25");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");

  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");

  const [city, setCity] = useState("Irvine");
  const [state, setState] = useState("CA");
  const [maxPrice, setMaxPrice] = useState("1500000");

  const [findDealsResult, setFindDealsResult] = useState<FindDealsResult | null>(null);
  const [findDealsLoading, setFindDealsLoading] = useState(false);
  const [findDealsError, setFindDealsError] = useState("");

  async function analyzeProperty(customAddress?: string, customPrice?: number) {
    setAnalyzeError("");
    setAnalyzeResult(null);

    const finalAddress = customAddress || address;
    const finalPrice = customPrice || Number(listingPrice);

    if (!finalAddress.trim()) {
      setAnalyzeError("Please enter a property address.");
      return;
    }

    if (!finalPrice || finalPrice <= 0) {
      setAnalyzeError("Please enter a valid listing price.");
      return;
    }

    setAnalyzeLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: finalAddress,
          listing_price: finalPrice,
          down_payment_percent: Number(downPaymentPercent),
          interest_rate: Number(interestRate),
          loan_term_years: Number(loanTermYears),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAnalyzeError(errorData.detail || "Could not analyze this property.");
        setAnalyzeLoading(false);
        return;
      }

      const data = await response.json();
      setAnalyzeResult(data);
    } catch {
      setAnalyzeError("Server connection failed.");
    }

    setAnalyzeLoading(false);
  }

  async function findDeals() {
    setFindDealsError("");
    setFindDealsResult(null);

    if (!city.trim()) {
      setFindDealsError("Please enter a city.");
      return;
    }

    if (!state.trim()) {
      setFindDealsError("Please enter a state.");
      return;
    }

    if (!maxPrice.trim() || Number(maxPrice) <= 0) {
      setFindDealsError("Please enter a valid max price.");
      return;
    }

    setFindDealsLoading(true);

    try {
      const response = await fetch(`${API_URL}/find-deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          state,
          max_price: Number(maxPrice),
          limit: isPro ? 50 : 5,
          is_pro: isPro,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFindDealsError(errorData.detail || "Could not find deals.");
        setFindDealsLoading(false);
        return;
      }

      const data = await response.json();
      setFindDealsResult(data);
    } catch {
      setFindDealsError("Server connection failed.");
    }

    setFindDealsLoading(false);
  }

  function analyzeFullProperty(deal: Deal) {
    setAddress(deal.address);
    setListingPrice(String(deal.listing_price));
    analyzeProperty(deal.address, deal.listing_price);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900">Home Deal AI</h1>
          <p className="mt-3 text-gray-600">
            Analyze properties and find undervalued real estate deals.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-black bg-white p-5 shadow">
            <p className="text-sm font-semibold text-gray-500">CURRENT PLAN</p>
            <h2 className="mt-1 text-2xl font-bold">Free Plan</h2>
            <p className="mt-2 text-gray-600">5 deals per search</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow opacity-70">
            <p className="text-sm font-semibold text-gray-500">COMING SOON</p>
            <h2 className="mt-1 text-2xl font-bold">Pro Plan</h2>
            <p className="mt-2 text-gray-600">Up to 50 deals per search</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Analyze Property</h2>
            <p className="mt-2 text-gray-600">Analyze a specific property by address.</p>

            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border p-4" placeholder="Property Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="Listing Price" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} />

              <div className="grid gap-4 md:grid-cols-3">
                <input className="rounded-lg border p-4" placeholder="Down Payment %" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)} />
                <input className="rounded-lg border p-4" placeholder="Interest Rate %" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                <input className="rounded-lg border p-4" placeholder="Loan Term" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} />
              </div>

              {analyzeError && <div className="rounded-lg bg-red-50 p-4 text-red-700">{analyzeError}</div>}

              <button className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400" onClick={() => analyzeProperty()} disabled={analyzeLoading}>
                {analyzeLoading ? "Analyzing..." : "Analyze Property"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Find Best Deals</h2>
            <p className="mt-2 text-gray-600">Free users can view the top 5 deals per search.</p>

            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border p-4" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

              {findDealsError && <div className="rounded-lg bg-red-50 p-4 text-red-700">{findDealsError}</div>}

              <button className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400" onClick={findDeals} disabled={findDealsLoading}>
                {findDealsLoading ? "Finding Deals..." : "Find Deals"}
              </button>
            </div>
          </div>
        </div>

        {analyzeResult && (
          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Deal Score</p>
              <h2 className="mt-2 text-6xl font-bold">{analyzeResult.deal_score}/100</h2>
              <p className="mt-3 text-xl font-semibold">{analyzeResult.status}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Listing Price</p>
                <p className="mt-2 text-2xl font-bold">{money(analyzeResult.listing_price)}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">AI Fair Value</p>
                <p className="mt-2 text-2xl font-bold">{money(analyzeResult.fair_value)}</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Rent Yield</p>
                <p className="mt-2 text-2xl font-bold">{analyzeResult.gross_rent_yield}%</p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Cash Flow</p>
                <p className="mt-2 text-2xl font-bold">{money(analyzeResult.estimated_monthly_cash_flow)} / mo</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-bold">AI Summary</h3>
              <p className="mt-3 text-gray-700">{analyzeResult.summary}</p>
            </div>
          </div>
        )}

        {findDealsResult && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-gray-500">🏆 TOP DEALS</p>
            <h2 className="text-3xl font-bold">
              Best Deals in {findDealsResult.city}, {findDealsResult.state}
            </h2>
            <p className="mt-2 text-gray-600">
              Free plan shows {findDealsResult.result_limit} deals. Total analyzed: {findDealsResult.total_analyzed}.
            </p>

            <div className="mt-6 grid gap-5">
              {findDealsResult.deals.map((deal, index) => (
                <div key={index} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">#{index + 1} Deal</p>
                      <h3 className="mt-1 text-2xl font-bold text-gray-900">{deal.address}</h3>
                      <p className="mt-2 text-sm font-semibold text-gray-700">{deal.status}</p>
                    </div>

                    <div className="rounded-2xl bg-gray-100 p-5 text-center">
                      <p className="text-sm text-gray-500">Deal Score</p>
                      <p className="text-4xl font-bold">{deal.deal_score}</p>
                      <p className="text-sm text-gray-500">/100</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-5">
                    <div><p className="text-sm text-gray-500">Price</p><p className="text-lg font-bold">{money(deal.listing_price)}</p></div>
                    <div><p className="text-sm text-gray-500">Fair Value</p><p className="text-lg font-bold">{money(deal.fair_value)}</p></div>
                    <div><p className="text-sm text-gray-500">Discount</p><p className="text-lg font-bold">{deal.discount_percent}%</p></div>
                    <div><p className="text-sm text-gray-500">Rent Yield</p><p className="text-lg font-bold">{deal.gross_rent_yield}%</p></div>
                    <div><p className="text-sm text-gray-500">Cash Flow</p><p className="text-lg font-bold">{money(deal.estimated_monthly_cash_flow)}/mo</p></div>
                  </div>

                  <button className="mt-5 w-full rounded-lg bg-black p-3 font-semibold text-white hover:bg-gray-800" onClick={() => analyzeFullProperty(deal)}>
                    Analyze Full Property
                  </button>
                </div>
              ))}
            </div>

            {!isPro && (
              <div className="mt-6 rounded-2xl bg-gray-100 p-6 text-center">
                <h3 className="text-2xl font-bold">Unlock 50 deals per search</h3>
                <p className="mt-2 text-gray-600">Pro plan coming soon.</p>
                <button className="mt-4 rounded-lg bg-black px-6 py-3 font-semibold text-white">
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        )}

        <p className="mt-10 text-sm text-gray-500">
          This analysis is for informational purposes only and is not financial advice.
        </p>
      </div>
    </main>
  );
}