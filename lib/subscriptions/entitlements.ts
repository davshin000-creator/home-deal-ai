export const SUBSCRIPTION_TYPES = [
  "free",
  "real_estate",
  "trading",
  "all_access",
] as const;

export type SubscriptionType =
  (typeof SUBSCRIPTION_TYPES)[number];

export const FEATURE_KEYS = [
  "real_estate",
  "trading",
  "research",
  "business",
  "startup",
  "relationship",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export type ProfileSubscriptionData = {
  subscription_type?: unknown;
  entitlements?: unknown;
  subscription_status?: unknown;
  trial_ends_at?: unknown;
  current_period_end?: unknown;
  cancel_at_period_end?: unknown;
  is_pro?: unknown;
};

const SUBSCRIPTION_ENTITLEMENTS: Record<
  SubscriptionType,
  FeatureKey[]
> = {
  free: [],
  real_estate: ["real_estate"],
  trading: ["trading"],
  all_access: [
    "real_estate",
    "trading",
    "research",
  ],
};

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "approved",
]);

export function isSubscriptionType(
  value: unknown,
): value is SubscriptionType {
  return (
    typeof value === "string" &&
    SUBSCRIPTION_TYPES.includes(value as SubscriptionType)
  );
}

export function isFeatureKey(
  value: unknown,
): value is FeatureKey {
  return (
    typeof value === "string" &&
    FEATURE_KEYS.includes(value as FeatureKey)
  );
}

export function normalizeSubscriptionType(
  value: unknown,
): SubscriptionType {
  if (!isSubscriptionType(value)) {
    return "free";
  }

  return value;
}

export function normalizeSubscriptionStatus(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function normalizeEntitlements(
  value: unknown,
): FeatureKey[] {
  let rawValues: unknown[] = [];

  if (Array.isArray(value)) {
    rawValues = value;
  } else if (typeof value === "string") {
    try {
      const parsedValue: unknown = JSON.parse(value);

      if (Array.isArray(parsedValue)) {
        rawValues = parsedValue;
      }
    } catch {
      rawValues = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return Array.from(
    new Set(
      rawValues.filter(
        (item): item is FeatureKey => isFeatureKey(item),
      ),
    ),
  );
}

export function getDefaultEntitlements(
  subscriptionType: SubscriptionType,
): FeatureKey[] {
  return [...SUBSCRIPTION_ENTITLEMENTS[subscriptionType]];
}

export function getEntitlements(
  profile: ProfileSubscriptionData | null | undefined,
): FeatureKey[] {
  if (!profile) {
    return [];
  }

  const savedEntitlements = normalizeEntitlements(
    profile.entitlements,
  );

  if (savedEntitlements.length > 0) {
    return savedEntitlements;
  }

  const subscriptionType = normalizeSubscriptionType(
    profile.subscription_type,
  );

  return getDefaultEntitlements(subscriptionType);
}

export function isTrialExpired(
  trialEndsAt: unknown,
  now: Date = new Date(),
): boolean {
  if (
    trialEndsAt === null ||
    trialEndsAt === undefined ||
    trialEndsAt === ""
  ) {
    return false;
  }

  const expirationDate = new Date(String(trialEndsAt));

  if (Number.isNaN(expirationDate.getTime())) {
    return false;
  }

  return expirationDate.getTime() <= now.getTime();
}

export function hasActiveSubscription(
  profile: ProfileSubscriptionData | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!profile) {
    return false;
  }

  const subscriptionType = normalizeSubscriptionType(
    profile.subscription_type,
  );

  if (subscriptionType === "free") {
    return false;
  }

  const status = normalizeSubscriptionStatus(
    profile.subscription_status,
  );

  if (!ACTIVE_SUBSCRIPTION_STATUSES.has(status)) {
    return false;
  }

  if (
    status === "trialing" &&
    isTrialExpired(profile.trial_ends_at, now)
  ) {
    return false;
  }

  if (profile.cancel_at_period_end === true) {
    const periodEndValue =
      profile.current_period_end ??
      profile.trial_ends_at;

    if (
      periodEndValue !== null &&
      periodEndValue !== undefined &&
      periodEndValue !== ""
    ) {
      const periodEnd =
        new Date(String(periodEndValue));

      if (
        !Number.isNaN(periodEnd.getTime()) &&
        periodEnd.getTime() <= now.getTime()
      ) {
        return false;
      }
    }
  }

  return true;
}

export function hasFeature(
  profile: ProfileSubscriptionData | null | undefined,
  feature: FeatureKey,
  now: Date = new Date(),
): boolean {
  if (!hasActiveSubscription(profile, now)) {
    return false;
  }

  return getEntitlements(profile).includes(feature);
}

export function hasAnyFeature(
  profile: ProfileSubscriptionData | null | undefined,
  features: FeatureKey[],
  now: Date = new Date(),
): boolean {
  return features.some((feature) =>
    hasFeature(profile, feature, now),
  );
}

export function hasAllFeatures(
  profile: ProfileSubscriptionData | null | undefined,
  features: FeatureKey[],
  now: Date = new Date(),
): boolean {
  return features.every((feature) =>
    hasFeature(profile, feature, now),
  );
}

export function getSubscriptionEntitlements(
  subscriptionType: SubscriptionType,
): FeatureKey[] {
  return getDefaultEntitlements(subscriptionType);
}

export function getSubscriptionDisplayName(
  subscriptionType: SubscriptionType,
): string {
  const displayNames: Record<SubscriptionType, string> = {
    free: "Free",
    real_estate: "Real Estate Pro",
    trading: "Trading Pro",
    all_access: "Nestrova AI Pro",
  };

  return displayNames[subscriptionType];
}

export function getSubscriptionPrice(
  subscriptionType: SubscriptionType,
): number {
  const prices: Record<SubscriptionType, number> = {
    free: 0,
    real_estate: 9.99,
    trading: 9.99,
    all_access: 17.99,
  };

  return prices[subscriptionType];
}