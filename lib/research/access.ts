import {
  hasFeature,
  type ProfileSubscriptionData,
} from "@/lib/subscriptions/entitlements";

export function hasResearchAccess(
  profile:
    | ProfileSubscriptionData
    | null
    | undefined,
) {
  return hasFeature(
    profile,
    "research",
  );
}
