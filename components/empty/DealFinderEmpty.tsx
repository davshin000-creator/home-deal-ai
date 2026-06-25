"use client";
import EmptyLayout from "./EmptyLayout";
export default function DealFinderEmpty() {
  return (
    <EmptyLayout
      icon="🔍"
      title="Find Your First Deal"
      description="Search a market, rank properties by investment quality, and save the strongest opportunities to your portfolio."
      primaryLabel="Start Deal Finder"
      primaryHref="/deals"
      secondaryLabel="View Markets"
      secondaryHref="/markets"
      aiTipBody="Start with one city and one budget range. Too many filters can hide good opportunities early in your search."
    />
  );
}
