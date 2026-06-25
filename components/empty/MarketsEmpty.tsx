"use client";
import EmptyLayout from "./EmptyLayout";
export default function MarketsEmpty() {
  return (
    <EmptyLayout
      icon="🌎"
      title="Explore Investment Markets"
      description="Browse markets like Dallas, Austin, Phoenix, Miami, and Irvine to find where your next opportunity may come from."
      primaryLabel="Browse Markets"
      primaryHref="/markets"
      secondaryLabel="Find Deals"
      secondaryHref="/deals"
      aiTipBody="Cash-flow investors may prefer higher-yield markets, while appreciation investors may prefer stronger supply-constrained markets."
    />
  );
}
