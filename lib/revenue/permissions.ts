export type FeatureKey =
  | "analysis"
  | "ai_analysis"
  | "offer"
  | "report"
  | "portfolio"
  | "watchlist"
  | "compare"
  | "daily_brief"
  | "team"
  | "export_pdf";

export type PlanKey = "free" | "pro" | "team" | "enterprise";

export const PLAN_LIMITS: Record<PlanKey, Record<FeatureKey, number>> = {
  free: {
    analysis: 3,
    ai_analysis: 3,
    offer: 1,
    report: 0,
    portfolio: 1,
    watchlist: 3,
    compare: 3,
    daily_brief: 0,
    team: 0,
    export_pdf: 0,
  },
  pro: {
    analysis: 100,
    ai_analysis: 100,
    offer: 25,
    report: 25,
    portfolio: 25,
    watchlist: 100,
    compare: 100,
    daily_brief: 30,
    team: 0,
    export_pdf: 25,
  },
  team: {
    analysis: 500,
    ai_analysis: 500,
    offer: 150,
    report: 150,
    portfolio: 100,
    watchlist: 500,
    compare: 500,
    daily_brief: 30,
    team: 10,
    export_pdf: 150,
  },
  enterprise: {
    analysis: -1,
    ai_analysis: -1,
    offer: -1,
    report: -1,
    portfolio: -1,
    watchlist: -1,
    compare: -1,
    daily_brief: -1,
    team: -1,
    export_pdf: -1,
  },
};

export function getFeatureLimit(
  feature: FeatureKey,
  plan: PlanKey = "free"
): number {
  return PLAN_LIMITS[plan]?.[feature] ?? PLAN_LIMITS.free[feature] ?? 0;
}

export function canUseFeature({
  feature,
  plan = "free",
  used = 0,
}: {
  feature: FeatureKey;
  plan?: PlanKey;
  used?: number;
}) {
  const limit = getFeatureLimit(feature, plan);

  if (limit === -1) {
    return {
      allowed: true,
      limit,
      remaining: -1,
      reason: "Unlimited usage is available on this plan.",
    };
  }

  const remaining = Math.max(0, limit - used);

  return {
    allowed: used < limit,
    limit,
    remaining,
    reason:
      used < limit
        ? "Feature usage is available."
        : "Feature usage limit reached.",
  };
}

export function getPlanFromSubscription(subscription?: string | null): PlanKey {
  if (!subscription) return "free";
  if (subscription === "pro") return "pro";
  if (subscription === "team") return "team";
  if (subscription === "enterprise") return "enterprise";
  return "free";
}
