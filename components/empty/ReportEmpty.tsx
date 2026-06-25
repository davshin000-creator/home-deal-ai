"use client";
import EmptyLayout from "./EmptyLayout";
export default function ReportEmpty() {
  return (
    <EmptyLayout
      icon="📝"
      title="No AI Reports Yet"
      description="Generate your first AI investment report with fair value, cash flow, forecast, risks, and negotiation strategy."
      primaryLabel="Analyze Property"
      primaryHref="/"
      secondaryLabel="View Pricing"
      secondaryHref="/pricing"
      aiTipBody="AI reports work best after you analyze a property and choose an investor type."
    />
  );
}
