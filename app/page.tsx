"use client";

import { useState } from "react";

type AnalyzeResult = {
  address: string;
  listing_price: number;
  fair_value: number;
  fair_value_low: number;
  fair_value_high: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  status: string;
  deal_score: number;
  reasons: string[];
  summary: string;
  down_payment: number;
  loan_amount: number;
  monthly_mortgage: number;
  monthly_property_tax: number;
  monthly_insurance: number;
  monthly_maintenance: number;
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
  count: number;
  deals: Deal[];
};

const API_URL = "https://home-deal-api.onrender.com";

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
  const [limit, setLimit] = useState("5");

  const [findDealsResult, setFindDealsResult] = useState<FindDealsResult | null>(null);
  const [findDealsLoading, setFindDealsLoading] = useState(false);
  const [findDealsError, setFindDealsError] = useState("");

  async function analyzeProperty() {
    setAnalyzeError("");
    setAnalyzeResult(null);

    if (!address.trim()) {
      setAnalyzeError("Please enter a property address.");
      return;
    }

    if (!listingPrice.trim() || Number(listingPrice) <= 0) {
      setAnalyzeError("Please enter a valid listing price.");
      return;
    }

    setAnalyzeLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          listing_price: Number(listingPrice),
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          state,
          max_price: Number(maxPrice),
          limit: Number(limit),
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

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900">Home Deal AI</h1>
          <p className="mt-3 text-gray-600">
            Analyze properties and find undervalued real estate deals.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Analyze Property</h2>
            <p className="mt-2 text-gray-600">
              Analyze a specific property by address.
            </p>

            <div className="mt-5 grid gap-4">
              <input
                className="rounded-lg border p-4"
                placeholder="Property Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Listing Price"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <input
                  className="rounded-lg border p-4"
                  placeholder="Down Payment %"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(e.target.value)}
                />

                <input
                  className="rounded-lg border p-4"
                  placeholder="Interest Rate %"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />

                <input
                  className="rounded-lg border p-4"
                  placeholder="Loan Term"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value)}
                />
              </div>

              {analyzeError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  {analyzeError}
                </div>
              )}

              <button
                className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
                onClick={analyzeProperty}
                disabled={analyzeLoading}
              >
                {analyzeLoading ? "Analyzing..." : "Analyze Property"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Find Best Deals</h2>
            <p className="mt-2 text-gray-600">
              Search a city and find the highest scoring deals.
            </p>

            <div className="mt-5 grid gap-4">
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
                onChange={(e) => setState(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />

              {findDealsError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  {findDealsError}
                </div>
              )}

              <button
                className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
                onClick={findDeals}
                disabled={findDealsLoading}
              >
                {findDealsLoading ? "Finding Deals..." : "Find Deals"}
              </button>
            </div>
          </div>
        </div>

        {analyzeResult && (
          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Deal Score</p>
              <h2 className="mt-2 text-6xl font-bold">
                {analyzeResult.deal_score}/100
              </h2>
              <p className="mt-3 text-xl font-semibold">
                {analyzeResult.status}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Listing Price</p>
                <p className="mt-2 text-2xl font-bold">
                  ${analyzeResult.listing_price.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">AI Fair Value</p>
                <p className="mt-2 text-2xl font-bold">
                  ${analyzeResult.fair_value.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Estimated Rent</p>
                <p className="mt-2 text-2xl font-bold">
                  ${analyzeResult.estimated_monthly_rent.toLocaleString()} / mo
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Cash Flow</p>
                <p className="mt-2 text-2xl font-bold">
                  ${analyzeResult.estimated_monthly_cash_flow.toLocaleString()} / mo
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-bold">AI Summary</h3>
              <p className="mt-3 text-gray-700">{analyzeResult.summary}</p>

              <h4 className="mt-5 font-semibold">Reasons</h4>
              <ul className="mt-2 list-disc pl-5">
                {analyzeResult.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {findDealsResult && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">
              Top Deals in {findDealsResult.city}, {findDealsResult.state}
            </h2>

            <p className="mt-2 text-gray-600">
              Found {findDealsResult.count} deals under $
              {findDealsResult.max_price.toLocaleString()}.
            </p>

            <div className="mt-6 grid gap-4">
              {findDealsResult.deals.map((deal, index) => (
                <div
                  key={index}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                      <h3 className="text-xl font-bold">{deal.address}</h3>
                      <p className="mt-1 text-gray-600">{deal.status}</p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500">Deal Score</p>
                      <p className="text-3xl font-bold">{deal.deal_score}/100</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-gray-500">Listing Price</p>
                      <p className="font-semibold">
                        ${deal.listing_price.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Fair Value</p>
                      <p className="font-semibold">
                        ${deal.fair_value.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="font-semibold">{deal.discount_percent}%</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Rent Yield</p>
                      <p className="font-semibold">{deal.gross_rent_yield}%</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Estimated Monthly Cash Flow
                    </p>
                    <p className="text-xl font-bold">
                      ${deal.estimated_monthly_cash_flow.toLocaleString()} / mo
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {findDealsResult.deals.length === 0 && (
              <p className="mt-6 text-gray-600">
                No deals found. Try increasing the max price or searching another city.
              </p>
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