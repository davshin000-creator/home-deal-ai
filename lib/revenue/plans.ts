import { FeatureKey, PlanKey, getFeatureLimit } from "./permissions";

export type PricingPlan = {
  key: PlanKey;
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    key: "free",
    name: "Free",
    priceMonthly: 0,
    description: "Start analyzing investment properties.",
    features: ["3 analyses", "Basic scoring", "Limited watchlist"],
  },
  {
    key: "pro",
    name: "Pro",
    priceMonthly: 29,
    description: "For serious individual investors.",
    features: ["100 analyses", "AI offers", "Reports", "Watchlist"],
  },
  {
    key: "team",
    name: "Team",
    priceMonthly: 99,
    description: "For teams and operators.",
    features: ["Team workspace", "More reports", "More analyses"],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    priceMonthly: 0,
    description: "Custom scale and integrations.",
    features: ["Unlimited usage", "Custom support", "API access"],
  },
];

export function getPlanLimitLabel(plan: PlanKey, feature: FeatureKey) {
  const limit = getFeatureLimit(feature, plan);
  return limit === -1 ? "Unlimited" : String(limit);
}
