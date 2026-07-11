import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";
import {
  getPayPalAccessToken,
  PAYPAL_API_BASE,
} from "@/lib/payments/paypal";

const PAYPAL_PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Please sign in before starting a trial." },
        { status: 401 }
      );
    }

    if (!PAYPAL_PLAN_ID) {
      return NextResponse.json(
        { ok: false, error: "Missing PayPal Plan ID." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const subscriptionID = String(body.subscriptionID || "").trim();

    if (!subscriptionID) {
      return NextResponse.json(
        { ok: false, error: "subscriptionID is required." },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${encodeURIComponent(subscriptionID)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const subscription = await response.json();

    if (!response.ok) {
      console.error("paypal_subscription_lookup_error", subscription);

      return NextResponse.json(
        { ok: false, error: "Unable to verify PayPal subscription." },
        { status: 502 }
      );
    }

    if (subscription.plan_id !== PAYPAL_PLAN_ID) {
      return NextResponse.json(
        { ok: false, error: "PayPal subscription plan mismatch." },
        { status: 403 }
      );
    }

    if (!["APPROVAL_PENDING", "APPROVED", "ACTIVE"].includes(subscription.status)) {
      return NextResponse.json(
        {
          ok: false,
          error: `PayPal subscription is not approved. Status: ${subscription.status}`,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const trialEndsAt = new Date(
      now.getTime() + 5 * 24 * 60 * 60 * 1000
    ).toISOString();

    const admin = createSupabaseAdminClient();

    const { data: existingOwner, error: ownerLookupError } = await admin
      .from("profiles")
      .select("auth_user_id")
      .eq("paypal_subscription_id", subscriptionID)
      .maybeSingle();

    if (ownerLookupError) {
      console.error("paypal_subscription_owner_lookup_error", ownerLookupError);

      return NextResponse.json(
        { ok: false, error: "Could not verify subscription ownership." },
        { status: 500 }
      );
    }

    if (
      existingOwner?.auth_user_id &&
      existingOwner.auth_user_id !== user.id
    ) {
      return NextResponse.json(
        { ok: false, error: "Subscription is already linked to another account." },
        { status: 409 }
      );
    }

    const { error } = await admin
      .from("profiles")
      .update({
        is_pro: true,
        plan: "pro",
        subscription_status: "trialing",
        paypal_subscription_id: subscriptionID,
        paypal_plan_id: subscription.plan_id,
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEndsAt,
        subscription_updated_at: now.toISOString(),
        cancel_at_period_end: false,
        updated_at: now.toISOString(),
      })
      .eq("auth_user_id", user.id);

    if (error) {
      console.error("paypal_subscription_profile_update_error", error);

      return NextResponse.json(
        {
          ok: false,
          error: "Subscription approved, but Pro access could not be saved.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      subscription_id: subscriptionID,
      status: subscription.status,
      is_pro: true,
      plan: "pro",
      trial_ends_at: trialEndsAt,
    });
  } catch (error) {
    console.error("paypal_activate_subscription_error", error);

    return NextResponse.json(
      { ok: false, error: "PayPal subscription activation failed." },
      { status: 500 }
    );
  }
}
