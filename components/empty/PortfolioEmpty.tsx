"use client";
import EmptyLayout from "./EmptyLayout";
export default function PortfolioEmpty() {
  return (
    <EmptyLayout
      icon="📊"
      title="Your Portfolio Starts Here"
      description="Track saved properties, monitor deal scores, review cash flow, and identify your strongest investment opportunities."
      primaryLabel="Analyze First Property"
      primaryHref="/"
      secondaryLabel="Find Deals"
      secondaryHref="/deals"
      aiTipBody="Start by saving 3 properties from different markets. Nestrova can then compare yield, cash flow, and diversification."
    />
  );
}
