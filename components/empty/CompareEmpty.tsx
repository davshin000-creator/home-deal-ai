"use client";
import EmptyLayout from "./EmptyLayout";
export default function CompareEmpty() {
  return (
    <EmptyLayout
      icon="⚖️"
      title="Nothing to Compare Yet"
      description="Save at least two properties, then compare deal scores, yield, cash flow, fair value, and investment quality side by side."
      primaryLabel="Find Deals"
      primaryHref="/deals"
      secondaryLabel="Open Portfolio"
      secondaryHref="/portfolio"
      aiTipBody="The best comparison is not always the cheapest property. Compare risk-adjusted cash flow and market strength."
    />
  );
}
