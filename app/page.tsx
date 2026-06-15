"use client";

import { useState } from "react";

type Result = {
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

export default function Home() {
  const [address, setAddress] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("25");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeProperty() {
    setError("");
    setResult(null);

    if (!address.trim()) {
      setError("Please enter a property address.");
      return;
    }

    if (!listingPrice.trim()) {
      setError("Please enter a listing price.");
      return;
    }

    if (Number(listingPrice) <= 0) {
      setError("Listing price must be greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://home-deal-api.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          listing_price: Number(listingPrice),
          down_payment_percent: Number(downPaymentPercent),
          interest_rate: Number(interestRate),
          loan_term_years: Number(loanTermYears),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        setError(
          errorData.detail ||
            "Could not analyze this property. Please check the address."
        );

        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setError("Server connection failed. Please make sure FastAPI is running.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900">
            Home Deal AI
          </h1>

          <p className="mt-3 text-gray-600">
            Analyze fair value, rental yield, and estimated monthly cash flow.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-4">
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
                placeholder="Loan Term Years"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={analyzeProperty}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Property"}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Deal Score</p>

              <h2 className="mt-2 text-6xl font-bold">
                {result.deal_score}/100
              </h2>

              <p className="mt-3 text-xl font-semibold">
                {result.status}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Listing Price</p>
                <p className="mt-2 text-2xl font-bold">
                  ${result.listing_price.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">AI Fair Value</p>
                <p className="mt-2 text-2xl font-bold">
                  ${result.fair_value.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Estimated Rent</p>
                <p className="mt-2 text-2xl font-bold">
                  ${result.estimated_monthly_rent.toLocaleString()} / mo
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Gross Rent Yield</p>
                <p className="mt-2 text-2xl font-bold">
                  {result.gross_rent_yield}%
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-bold">Cash Flow Estimate</h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <p>Down Payment: ${result.down_payment.toLocaleString()}</p>
                <p>Loan Amount: ${result.loan_amount.toLocaleString()}</p>
                <p>Monthly Mortgage: ${result.monthly_mortgage.toLocaleString()}</p>
                <p>Monthly Property Tax: ${result.monthly_property_tax.toLocaleString()}</p>
                <p>Monthly Insurance: ${result.monthly_insurance.toLocaleString()}</p>
                <p>Monthly Maintenance: ${result.monthly_maintenance.toLocaleString()}</p>
              </div>

              <div className="mt-6 rounded-xl border p-4">
                <p className="text-sm text-gray-500">Estimated Monthly Cash Flow</p>
                <p className="mt-2 text-3xl font-bold">
                  ${result.estimated_monthly_cash_flow.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-bold">Analysis</h3>

              <p className="mt-3">
                Fair Value Range: ${result.fair_value_low.toLocaleString()} ~ $
                {result.fair_value_high.toLocaleString()}
              </p>

              <p className="mt-2">
                Discount / Premium: {result.discount_percent}%
              </p>

              <h4 className="mt-5 font-semibold">AI Summary</h4>
              <p className="mt-2 text-gray-700">{result.summary}</p>

              <h4 className="mt-5 font-semibold">Reasons</h4>
              <ul className="mt-2 list-disc pl-5">
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-gray-500">
                This analysis is for informational purposes only and is not
                financial advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}