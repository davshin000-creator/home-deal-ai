"use client";

import ProFeatureGate from "@/components/auth/ProFeatureGate";
import CompareWorkspace from "@/components/compare/CompareWorkspace";

export default function ComparePage() {
  return (
    <ProFeatureGate
      featureName="AI Deal Compare"
      title="Compare properties with the Nestrova Pro decision layer."
      description="Rank multiple properties by score, yield, cash flow, forecast, and risk before choosing where to focus."
    >
      <CompareWorkspace />
    </ProFeatureGate>
  );
}

