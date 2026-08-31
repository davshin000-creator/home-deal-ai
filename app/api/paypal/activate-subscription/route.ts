import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";
import {
  getPayPalAccessToken,
  PAYPAL_API_BASE,
} from "@/lib/payments/paypal";
import {
  getSubscriptionEntitlements,
  type SubscriptionType,
} from "@/lib/subscriptions/entitlements";

type PaidSubscriptionType = Exclude<
  SubscriptionType,
  "free"
>;

type PayPalSubscriptionResponse = {
  id?: string;
  status?: string;
  plan_id?: string;
  custom_id?: string;
  create_time?: string;
  billing_info?: {
    next_billing_time?: string;
  };
};

type ActivateSubscriptionBody = {
  subscriptionID?: unknown;
};

type PlanConfiguration = {
  subscriptionType: PaidSubscriptionType;
  planId: string | undefined;
  displayName: string;
};

const PLAN_CONFIGURATIONS: PlanConfiguration[] = [
  {
    subscriptionType: "real_estate",
    planId:
      process.env.NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID,
    displayName: "Real Estate Pro",
  },
  {
    subscriptionType: "trading",
    planId:
      process.env.NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID,
    displayName: "Radar Pro",
  },
  {
    subscriptionType: "all_access",
    planId:
      process.env.NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID,
    displayName: "Nestrova AI Pro",
  },
];

const APPROVED_PAYPAL_STATUSES = new Set([
  "APPROVED",
  "ACTIVE",
]);

function normalizeSubscriptionId(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function findPlanConfiguration(
  paypalPlanId: unknown,
): PlanConfiguration | null {
  if (typeof paypalPlanId !== "string") {
    return null;
  }

  return (
    PLAN_CONFIGURATIONS.find(
      (configuration) =>
        Boolean(configuration.planId) &&
        configuration.planId === paypalPlanId,
    ) ?? null
  );
}

function getMissingPlanEnvironmentVariables(): string[] {
  const missingVariables: string[] = [];

  if (
    !process.env.NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID
  ) {
    missingVariables.push(
      "NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID",
    );
  }

  if (!process.env.NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID) {
    missingVariables.push(
      "NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID",
    );
  }

  if (
    !process.env.NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID
  ) {
    missingVariables.push(
      "NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID",
    );
  }

  return missingVariables;
}

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please sign in before starting a subscription.",
        },
        {
          status: 401,
        },
      );
    }

    const missingPlanVariables =
      getMissingPlanEnvironmentVariables();

    if (missingPlanVariables.length > 0) {
      console.error(
        "paypal_missing_plan_environment_variables",
        missingPlanVariables,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "One or more PayPal subscription plans are not configured.",
        },
        {
          status: 500,
        },
      );
    }

    let body: ActivateSubscriptionBody;

    try {
      body =
        (await request.json()) as ActivateSubscriptionBody;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "The request body must contain valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const subscriptionID = normalizeSubscriptionId(
      body.subscriptionID,
    );

    if (!subscriptionID) {
      return NextResponse.json(
        {
          ok: false,
          error: "subscriptionID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const accessToken = await getPayPalAccessToken();

    const paypalResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${encodeURIComponent(
        subscriptionID,
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const subscription =
      (await paypalResponse.json()) as PayPalSubscriptionResponse;

    if (!paypalResponse.ok) {
      console.error(
        "paypal_subscription_lookup_error",
        subscription,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Unable to verify the PayPal subscription.",
        },
        {
          status: 502,
        },
      );
    }

    if (
      !subscription.id ||
      subscription.id !== subscriptionID
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The PayPal subscription response did not match the requested subscription.",
        },
        {
          status: 403,
        },
      );
    }

    const planConfiguration = findPlanConfiguration(
      subscription.plan_id,
    );

    if (!planConfiguration) {
      console.error(
        "paypal_subscription_plan_mismatch",
        {
          subscriptionID,
          paypalPlanId: subscription.plan_id,
        },
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "The PayPal subscription is not connected to a valid Nestrova plan.",
        },
        {
          status: 403,
        },
      );
    }

    const subscriptionStatus = String(
      subscription.status ?? "",
    )
      .trim()
      .toUpperCase();

    if (
      !APPROVED_PAYPAL_STATUSES.has(subscriptionStatus)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: `PayPal subscription is not approved. Status: ${
            subscriptionStatus || "UNKNOWN"
          }`,
        },
        {
          status: 400,
        },
      );
    }

    if (
      subscription.custom_id &&
      subscription.custom_id !==
        planConfiguration.subscriptionType
    ) {
      console.error(
        "paypal_subscription_custom_id_mismatch",
        {
          subscriptionID,
          customId: subscription.custom_id,
          expected:
            planConfiguration.subscriptionType,
        },
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "The selected Nestrova plan does not match the PayPal subscription.",
        },
        {
          status: 403,
        },
      );
    }

    const now = new Date();

    const fallbackTrialEndsAt = new Date(
      now.getTime() + 5 * 24 * 60 * 60 * 1000,
    );

    const paypalNextBillingTime =
      subscription.billing_info?.next_billing_time;

    const parsedNextBillingTime = paypalNextBillingTime
      ? new Date(paypalNextBillingTime)
      : null;

    const hasValidPayPalBillingTime =
      parsedNextBillingTime !== null &&
      !Number.isNaN(parsedNextBillingTime.getTime()) &&
      parsedNextBillingTime.getTime() > now.getTime();

    const trialEndsAt = hasValidPayPalBillingTime
      ? parsedNextBillingTime.toISOString()
      : fallbackTrialEndsAt.toISOString();

    const admin = createSupabaseAdminClient();

    const {
      data: existingOwner,
      error: ownerLookupError,
    } = await admin
      .from("profiles")
      .select("auth_user_id")
      .eq("paypal_subscription_id", subscriptionID)
      .maybeSingle();

    if (ownerLookupError) {
      console.error(
        "paypal_subscription_owner_lookup_error",
        ownerLookupError,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not verify subscription ownership.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      existingOwner?.auth_user_id &&
      existingOwner.auth_user_id !== user.id
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This subscription is already linked to another account.",
        },
        {
          status: 409,
        },
      );
    }

    const entitlements =
      getSubscriptionEntitlements(
        planConfiguration.subscriptionType,
      );

    const {
      data: updatedProfile,
      error: profileUpdateError,
    } = await admin
      .from("profiles")
      .update({
        is_pro: true,

        // 기존 코드와의 호환성을 위해 유지
        plan: planConfiguration.subscriptionType,

        // 새로운 Nestrova 구독 구조
        subscription_type:
          planConfiguration.subscriptionType,
        entitlements,

        subscription_status: "trialing",
        paypal_subscription_id: subscriptionID,
        paypal_plan_id: subscription.plan_id,
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEndsAt,
        current_period_end: trialEndsAt,
        subscription_updated_at: now.toISOString(),
        cancel_at_period_end: false,
        updated_at: now.toISOString(),
      })
      .eq("auth_user_id", user.id)
      .select(
        `
          auth_user_id,
          is_pro,
          plan,
          subscription_type,
          entitlements,
          subscription_status,
          paypal_subscription_id,
          paypal_plan_id,
          trial_started_at,
          trial_ends_at
        `,
      )
      .maybeSingle();

    if (profileUpdateError) {
      console.error(
        "paypal_subscription_profile_update_error",
        profileUpdateError,
      );

      return NextResponse.json(
        {
          ok: false,
          error: `${planConfiguration.displayName} was approved, but access could not be saved.`,
        },
        {
          status: 500,
        },
      );
    }

    if (!updatedProfile) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The subscription was approved, but the user profile could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      subscription_id: subscriptionID,
      paypal_status: subscriptionStatus,
      subscription_status: "trialing",
      subscription_type:
        planConfiguration.subscriptionType,
      display_name: planConfiguration.displayName,
      entitlements,
      is_pro: true,
      trial_ends_at: trialEndsAt,
    });
  } catch (error) {
    console.error(
      "paypal_activate_subscription_error",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "PayPal subscription activation failed.",
      },
      {
        status: 500,
      },
    );
  }
}