"use client";

import { FormEvent, useState } from "react";
import { compareProperties } from "@/lib/compare/compareEngine";
import type {
  CompareProperty,
  CompareRecommendation,
  CompareResult,
} from "@/types/comparison";
import PropertyCompareCard from "@/components/compare/PropertyCompareCard";
import WinnerPanel from "@/components/compare/WinnerPanel";
import ComparisonScoreTable from "@/components/compare/ComparisonScoreTable";
import ComparisonRadarChart from "@/components/compare/ComparisonRadarChart";
import ExecutiveComparisonSummary from "@/components/compare/ExecutiveComparisonSummary";

type PropertyInput = {
  address: string;
  listingPrice: string;
};

type AnalysisResponse = Record<string, unknown>;

const initialProperties: PropertyInput[] = [
  {
    address: "",
    listingPrice: "",
  },
  {
    address: "",
    listingPrice: "",
  },
];

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeRecommendation(
  value: unknown,
  discountPercent: number,
): CompareRecommendation {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  if (normalized.includes("BUY")) {
    return "BUY";
  }

  if (
    normalized.includes("NEGOTIATE") ||
    normalized.includes("OFFER")
  ) {
    return "NEGOTIATE";
  }

  if (
    normalized.includes("SKIP") ||
    normalized.includes("AVOID")
  ) {
    return "SKIP";
  }

  if (normalized.includes("WAIT")) {
    return "WAIT";
  }

  if (discountPercent >= 5) {
    return "BUY";
  }

  if (discountPercent >= 0) {
    return "NEGOTIATE";
  }

  if (discountPercent >= -5) {
    return "WAIT";
  }

  return "SKIP";
}

function parseLocation(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const stateAndZip = parts.at(-1) || "";
  const stateMatch = stateAndZip.match(/\b[A-Z]{2}\b/i);

  return {
    city: parts.length >= 2 ? parts.at(-2) || "" : "",
    state: stateMatch?.[0]?.toUpperCase() || "",
  };
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function mapAnalysisToCompareProperty(
  data: AnalysisResponse,
  input: PropertyInput,
  index: number,
): CompareProperty {
  const listingPrice = toNumber(
    data.listing_price,
    toNumber(input.listingPrice),
  );

  const fairValue = toNumber(
    data.fair_value,
    listingPrice,
  );

  const estimatedRent = toNumber(
    data.estimated_monthly_rent,
  );

  const discountPercent = toNumber(
    data.discount_percent,
    listingPrice > 0
      ? ((fairValue - listingPrice) / listingPrice) * 100
      : 0,
  );

  const grossRentYield = toNumber(
    data.gross_rent_yield,
    listingPrice > 0
      ? ((estimatedRent * 12) / listingPrice) * 100
      : 0,
  );

  const monthlyCashFlow = toNumber(
    data.estimated_monthly_cash_flow,
  );

  const overallScore = clampScore(
    toNumber(
      data.overall_score,
      toNumber(data.deal_score, 50),
    ),
  );

  const forecastScore = clampScore(
    toNumber(
      data.forecast_score,
      toNumber(data.appreciation_score, overallScore),
    ),
  );

  const riskScore = clampScore(
    toNumber(
      data.risk_score,
      toNumber(
        data.neighborhood_score,
        100 - Math.max(0, Math.abs(discountPercent) * 2),
      ),
    ),
  );

  const rentalScore = clampScore(
    toNumber(
      data.rental_score,
      grossRentYield * 18,
    ),
  );

  const negotiationData =
    data.negotiation &&
    typeof data.negotiation === "object"
      ? (data.negotiation as Record<string, unknown>)
      : {};

  const estimatedSavings = toNumber(
    negotiationData.estimated_savings,
  );

  const negotiationScore = clampScore(
    toNumber(
      data.negotiation_score,
      discountPercent > 0
        ? 65 + discountPercent * 3
        : 55 + Math.min(20, estimatedSavings / 5000),
    ),
  );

  const cashflowScore = clampScore(
    toNumber(
      data.cashflow_score,
      50 + monthlyCashFlow / 25,
    ),
  );

  const roiScore = clampScore(
    toNumber(
      data.roi_score,
      rentalScore * 0.55 + forecastScore * 0.45,
    ),
  );

  const location = parseLocation(
    String(data.address || input.address),
  );

  const reasons = stringArray(data.reasons);
  const backendStrengths = stringArray(data.strengths);
  const backendRisks = stringArray(data.risks);

  const strengths =
    backendStrengths.length > 0
      ? backendStrengths
      : reasons.length > 0
        ? reasons.slice(0, 3)
        : [
            discountPercent > 0
              ? `${discountPercent.toFixed(1)}% below estimated fair value`
              : "AI valuation completed",
            `Estimated rent: $${estimatedRent.toLocaleString()}/month`,
            `Overall score: ${overallScore}/100`,
          ];

  const risks =
    backendRisks.length > 0
      ? backendRisks
      : [
          grossRentYield < 3
            ? "Rental yield is below 3%"
            : "Verify achievable market rent",
          monthlyCashFlow < 0
            ? "Estimated monthly cash flow is negative"
            : "Confirm taxes, insurance, and HOA costs",
          "Complete inspection and local market review",
        ];

  return {
    id: `comparison-property-${index + 1}`,
    address: String(
      data.address || input.address,
    ),
    city: location.city,
    state: location.state,
    price: listingPrice,
    fairValue,
    estimatedRent,
    brainScore: overallScore,
    riskScore,
    rentalScore,
    negotiationScore,
    forecastScore,
    cashflowScore,
    roiScore,
    recommendation: normalizeRecommendation(
      data.status || data.recommendation,
      discountPercent,
    ),
    summary: String(
      data.summary ||
        "Nestrova completed valuation, rental, risk, forecast, and financing analysis for this property.",
    ),
    strengths,
    risks,
  };
}

export default function CompareWorkspace() {
  const [properties, setProperties] =
    useState<PropertyInput[]>(initialProperties);

  const [result, setResult] =
    useState<CompareResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function updateProperty(
    index: number,
    field: keyof PropertyInput,
    value: string,
  ) {
    setProperties((current) =>
      current.map((property, propertyIndex) =>
        propertyIndex === index
          ? {
              ...property,
              [field]: value,
            }
          : property,
      ),
    );
  }

  async function handleCompare(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setResult(null);

    const invalidProperty = properties.find(
      (property) =>
        !property.address.trim() ||
        !Number.isFinite(Number(property.listingPrice)) ||
        Number(property.listingPrice) <= 0,
    );

    if (invalidProperty) {
      setError(
        "Enter a complete address and valid listing price for both properties.",
      );
      return;
    }

    setLoading(true);

    try {
      const responses = await Promise.all(
        properties.map(async (property) => {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: property.address.trim(),
              listing_price: Number(
                property.listingPrice,
              ),
              down_payment_percent: 25,
              interest_rate: 6.5,
              loan_term_years: 30,
              analysis_goal: "comparison",
            }),
          });

          const data = (await response
            .json()
            .catch(() => ({}))) as AnalysisResponse;

          if (!response.ok) {
            throw new Error(
              String(
                data.detail ||
                  "One of the properties could not be analyzed.",
              ),
            );
          }

          return data;
        }),
      );

      const mappedProperties = responses.map(
        (analysis, index) =>
          mapAnalysisToCompareProperty(
            analysis,
            properties[index],
            index,
          ),
      );

      setResult(
        compareProperties(mappedProperties),
      );
    } catch (comparisonError) {
      setError(
        comparisonError instanceof Error
          ? comparisonError.message
          : "Property comparison failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] p-4 text-white md:p-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-white/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute right-[-220px] top-20 h-[720px] w-[720px] rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="relative mx-auto grid max-w-[1680px] gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
            AI Deal Comparison
          </p>

          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl">
            Compare deals like an investment desk.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">
            Enter two properties. Nestrova will analyze
            valuation, rent, risk, negotiation, forecast,
            cash flow, and ROI to identify the stronger deal.
          </p>
        </div>

        <form
          onSubmit={handleCompare}
          className="rounded-[32px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl md:p-8"
        >
          <div className="grid gap-5 xl:grid-cols-2">
            {properties.map((property, index) => (
              <div
                key={index}
                className="rounded-[26px] border border-white/10 bg-black/30 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  Property {index === 0 ? "A" : "B"}
                </p>

                <label className="mt-5 block text-sm text-white/65">
                  Full property address
                </label>

                <input
                  type="text"
                  value={property.address}
                  onChange={(event) =>
                    updateProperty(
                      index,
                      "address",
                      event.target.value,
                    )
                  }
                  placeholder="157 Damsel, Irvine, CA 92620"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/70"
                />

                <label className="mt-5 block text-sm text-white/65">
                  Listing price
                </label>

                <input
                  type="number"
                  min="1"
                  step="1000"
                  value={property.listingPrice}
                  onChange={(event) =>
                    updateProperty(
                      index,
                      "listingPrice",
                      event.target.value,
                    )
                  }
                  placeholder="1490000"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/70"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing both properties..."
              : "Compare Properties"}
          </button>

          <p className="mt-3 text-xs text-white/35">
            Each property uses one analysis from your monthly
            allowance.
          </p>
        </form>

        {result && (
          <>
            <WinnerPanel
              winner={result.winner}
              result={result}
            />  

            <div className="grid gap-6 xl:grid-cols-2">
              {result.properties.map((property) => (
                <PropertyCompareCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
              <ComparisonScoreTable
                properties={result.properties}
              />

              <ComparisonRadarChart
                properties={result.properties}
              />
            </div>

            <ExecutiveComparisonSummary
              result={result}
            />
          </>
        )}
      </section>
    </main>
  );
}