"use client";

import ProFeatureGate from "@/components/auth/ProFeatureGate";
import InvestmentMemoWorkspace from "@/components/memo/InvestmentMemoWorkspace";

export default function MemoPage() {
  return (
    <ProFeatureGate
      featureName="Investment Memo"
      title="Create investor-ready memos with Nestrova Pro."
      description="Turn analysis into a structured investment memo for review, partners, or lenders."
    >
      <InvestmentMemoWorkspace />
    </ProFeatureGate>
  );
}

