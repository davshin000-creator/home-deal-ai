"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useUser } from "@/components/auth/ClerkCompat";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getEntitlements,
  hasFeature,
  normalizeSubscriptionStatus,
  normalizeSubscriptionType,
  type FeatureKey,
  type ProfileSubscriptionData,
  type SubscriptionType,
} from "@/lib/subscriptions/entitlements";

export type SubscriptionProfile = ProfileSubscriptionData & {
  plan?: string | null;
  subscription_type?: string | null;
  subscription_status?: string | null;
  entitlements?: unknown;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  paypal_subscription_id?: string | null;
  paypal_plan_id?: string | null;
  cancel_at_period_end?: boolean | null;
};

type UseSubscriptionResult = {
  isLoaded: boolean;
  isSignedIn: boolean;
  isLoading: boolean;
  error: string | null;

  profile: SubscriptionProfile | null;

  subscriptionType: SubscriptionType;
  subscriptionStatus: string;
  entitlements: FeatureKey[];

  hasActiveSubscription: boolean;
  hasRealEstateAccess: boolean;
  hasTradingAccess: boolean;
  hasResearchAccess: boolean;

  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;

  hasAccess: (feature: FeatureKey) => boolean;
  refreshSubscription: () => Promise<void>;
};

function isValidFutureDate(value: unknown): boolean {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() > Date.now();
}

export default function useSubscription(): UseSubscriptionResult {
  const { isLoaded, isSignedIn, user } = useUser();

  const [profile, setProfile] =
    useState<SubscriptionProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user?.id) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();

      const { data, error: subscriptionError } =
        await supabase
          .from("profiles")
          .select(
            `
              plan,
              subscription_type,
              subscription_status,
              entitlements,
              trial_started_at,
              trial_ends_at,
              paypal_subscription_id,
              paypal_plan_id,
              cancel_at_period_end
            `,
          )
          .eq("auth_user_id", user.id)
          .maybeSingle();

      if (subscriptionError) {
        console.error(
          "subscription_profile_load_error",
          subscriptionError,
        );

        setProfile(null);
        setError(
          "Unable to load your subscription information.",
        );
        return;
      }

      setProfile(
        data
          ? (data as SubscriptionProfile)
          : null,
      );
    } catch (unexpectedError) {
      console.error(
        "subscription_profile_unexpected_error",
        unexpectedError,
      );

      setProfile(null);
      setError(
        "Unable to connect to the subscription service.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, user?.id]);

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  const subscriptionType = useMemo(() => {
    return normalizeSubscriptionType(
      profile?.subscription_type ??
        profile?.plan,
    );
  }, [profile?.plan, profile?.subscription_type]);

  const subscriptionStatus = useMemo(() => {
    return (
      normalizeSubscriptionStatus(
        profile?.subscription_status,
      ) || "free"
    );
  }, [profile?.subscription_status]);

  const entitlements = useMemo(() => {
    return getEntitlements(profile);
  }, [profile]);

  const hasActiveSubscription = useMemo(() => {
    const activeStatus =
      subscriptionStatus === "active" ||
      subscriptionStatus === "approved" ||
      subscriptionStatus === "trialing";

    if (!activeStatus) {
      return false;
    }

    if (subscriptionStatus === "trialing") {
      return isValidFutureDate(profile?.trial_ends_at);
    }

    return true;
  }, [
    profile?.trial_ends_at,
    subscriptionStatus,
  ]);

  const hasAccess = useCallback(
    (feature: FeatureKey) => {
      if (!hasActiveSubscription) {
        return false;
      }

      return hasFeature(profile, feature);
    },
    [hasActiveSubscription, profile],
  );

  const hasRealEstateAccess =
    hasAccess("real_estate");

  const hasTradingAccess =
    hasAccess("trading");

  const hasResearchAccess =
    hasAccess("research");

  return {
    isLoaded,
    isSignedIn,
    isLoading,
    error,

    profile,

    subscriptionType,
    subscriptionStatus,
    entitlements,

    hasActiveSubscription,
    hasRealEstateAccess,
    hasTradingAccess,
    hasResearchAccess,

    trialEndsAt:
      typeof profile?.trial_ends_at === "string"
        ? profile.trial_ends_at
        : null,

    cancelAtPeriodEnd:
      profile?.cancel_at_period_end === true,

    hasAccess,
    refreshSubscription: loadSubscription,
  };
}