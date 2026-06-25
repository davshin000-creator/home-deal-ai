"use client";

import { useState } from "react";

type PropertyReportData = {
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
  expected_appreciation?: number;
  confidence_score?: number;
  forecast_score?: number;
  neighborhood_score?: number;
  neighborhood_grade?: string;
  summary?: string;
};

type ReportGeneratorProps = {
  property: PropertyReportData;
  userId: string;
  isSignedIn: boolean;
  isPro: boolean;
};

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

export default function ReportGenerator({
  property,
  userId,
  isSignedIn,
  isPro,
}: ReportGeneratorProps) {
  const [investorType, setInvestorType] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState("");
  const [reportId, setReportId] = useState("");
  const [error, setError] = useState("");

  async function generateReport() {
    setError("");
    setReportHtml("");
    setReportId("");

    if (!isSignedIn || !userId) {
      setError("Please sign in to generate an AI investment report.");
      return;
    }

    if (!property?.address) {
      setError("Please analyze a property first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          property,
          investor_type: investorType,
          is_pro: isPro,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not generate report.");
        setLoading(false);
        return;
      }

      setReportHtml(data.report_html || "");
      setReportId(data.report_id || "");
    } catch {
      setError("Report server connection failed.");
    }

    setLoading(false);
  }

  function printReport() {
    if (!reportHtml) return;

    const win = window.open("", "_blank");

    if (!win) {
      alert("Popup blocked. Please allow popups and try again.");
      return;
    }

    win.document.open();
    win.document.write(reportHtml);
    win.document.close();
    win.focus();

    setTimeout(() => {
      win.print();
    }, 500);
  }

  return (
    <section className="rounded-2xl border-2 border-black bg-white p-6 shadow">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            AI OFFER GENERATOR PDF
          </p>
          <h3 className="mt-1 text-2xl font-bold">
            Generate a full AI investment report
          </h3>
          <p className="mt-2 max-w-3xl text-gray-600">
            Create a branded Nestrova report with fair value, cash flow, forecast,
            negotiation strategy, risk analysis, and final recommendation.
          </p>
        </div>

        <div className="rounded-2xl bg-black px-5 py-4 text-white">
          <p className="text-sm text-gray-300">Report Access</p>
          <p className="text-xl font-bold">
            {isPro ? "Full PDF" : "Preview Mode"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">Property</p>
          <p className="mt-1 font-bold">{property.address}</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">Deal Score</p>
          <p className="mt-1 text-2xl font-bold">{property.deal_score}/100</p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">Cash Flow</p>
          <p className="mt-1 text-2xl font-bold">
            {money(property.estimated_monthly_cash_flow)}/mo
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-500">Yield</p>
          <p className="mt-1 text-2xl font-bold">{property.gross_rent_yield}%</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <select
          className="rounded-lg border p-4"
          value={investorType}
          onChange={(e) => setInvestorType(e.target.value)}
        >
          <option>Beginner</option>
          <option>Cash Flow Investor</option>
          <option>Appreciation Investor</option>
          <option>Flipper</option>
          <option>Long-Term Buy and Hold</option>
        </select>

        <button
          onClick={generateReport}
          disabled={loading}
          className="rounded-lg bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate AI Report"}
        </button>

        <button
          onClick={printReport}
          disabled={!reportHtml}
          className="rounded-lg border px-6 py-4 font-semibold hover:bg-gray-50 disabled:opacity-40"
        >
          Download PDF
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {reportHtml && (
        <div className="mt-6 rounded-2xl bg-gray-50 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold">AI report generated.</p>
              <p className="text-sm text-gray-600">
                {isPro
                  ? "Full report is ready to download."
                  : "Preview generated. Upgrade to Pro for the full report."}
              </p>
            </div>

            {reportId && (
              <a
                href={`/report/${reportId}`}
                className="rounded-lg border bg-white px-5 py-3 text-center font-semibold hover:bg-gray-50"
              >
                Open Report Page
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
