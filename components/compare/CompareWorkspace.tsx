"use client";

import { mockCompareProperties } from "@/lib/compare/mockCompareData";
import { compareProperties } from "@/lib/compare/compareEngine";
import PropertyCompareCard from "@/components/compare/PropertyCompareCard";
import WinnerPanel from "@/components/compare/WinnerPanel";
import ComparisonScoreTable from "@/components/compare/ComparisonScoreTable";
import ComparisonRadarChart from "@/components/compare/ComparisonRadarChart";
import ExecutiveComparisonSummary from "@/components/compare/ExecutiveComparisonSummary";

export default function CompareWorkspace() {
  const result = compareProperties(mockCompareProperties);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] p-4 text-white md:p-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-white/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute right-[-220px] top-20 h-[720px] w-[720px] rounded-full bg-indigo-500/20 blur-3xl" />
      <section className="relative mx-auto grid max-w-[1680px] gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">AI Deal Comparison</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl">Compare deals like an investment desk.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">Nestrova compares valuation, rent, risk, negotiation, forecast, cashflow, and ROI to select the best deal.</p>
        </div>
        <WinnerPanel winner={result.winner} />
        <div className="grid gap-6 xl:grid-cols-3">
          {result.properties.map((property)=><PropertyCompareCard key={property.id} property={property} />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
          <ComparisonScoreTable properties={result.properties} />
          <ComparisonRadarChart properties={result.properties} />
        </div>
        <ExecutiveComparisonSummary result={result} />
      </section>
    </main>
  );
}
