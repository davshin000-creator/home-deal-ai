"use client";
import EmptyLayout from "./EmptyLayout";
export default function WeeklyReportEmpty() {
  return (
    <EmptyLayout
      icon="📈"
      title="No Weekly Reports Yet"
      description="Once you save properties and build a watchlist, Nestrova can create weekly AI summaries of your portfolio and opportunities."
      primaryLabel="Build Portfolio"
      primaryHref="/portfolio"
      secondaryLabel="Add Watchlist"
      secondaryHref="/watchlist"
      aiTipBody="Weekly reports are most useful after you save properties, add target prices, and generate at least one AI report."
    />
  );
}
