export type PlanType = "free" | "pro";

export type FeatureKey =
  | "analysis"
  | "ai_report"
  | "ai_coach"
  | "offer_generator"
  | "negotiation"
  | "documents"
  | "simulator"
  | "intelligence"
  | "weekly_report";

export const FREE_LIMITS: Record<FeatureKey, number> = {
  analysis: 5,
  ai_report: 1,
  ai_coach: 1,
  offer_generator: 1,
  negotiation: 1,
  documents: 1,
  simulator: 999,
  intelligence: 999,
  weekly_report: 0,
};

export const PRO_LIMITS: Record<FeatureKey, number> = {
  analysis: 9999,
  ai_report: 9999,
  ai_coach: 9999,
  offer_generator: 9999,
  negotiation: 9999,
  documents: 9999,
  simulator: 9999,
  intelligence: 9999,
  weekly_report: 9999,
};

export function getFeatureLimit(plan: PlanType, feature: FeatureKey) {
  return plan === "pro" ? PRO_LIMITS[feature] : FREE_LIMITS[feature];
}

export function canUseFeature({
  plan,
  feature,
  used,
}: {
  plan: PlanType;
  feature: FeatureKey;
  used: number;
}) {
  const limit = getFeatureLimit(plan, feature);
  return used < limit;
}

export function getUpgradeReason(feature: FeatureKey) {
  const reasons: Record<FeatureKey, string> = {
    analysis: "Unlock unlimited property analysis.",
    ai_report: "Generate unlimited AI investment reports.",
    ai_coach: "Build unlimited AI investment strategies.",
    offer_generator: "Unlock full AI offer strategy generation.",
    negotiation: "Unlock negotiation strategy and counter offer tools.",
    documents: "Export branded offer documents and email drafts.",
    simulator: "Simulator is available on the free plan.",
    intelligence: "Intelligence dashboard is available on the free plan.",
    weekly_report: "Unlock weekly AI intelligence reports.",
  };

  return reasons[feature];
}
