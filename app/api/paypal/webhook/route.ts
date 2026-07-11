import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  getPayPalAccessToken,
  PAYPAL_API_BASE,
} from "@/lib/payments/paypal";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    billing_agreement_id?: string;
    plan_id?: string;
    status?: string;
  };
};

type PayPalSubscription = {
  id?: string;
  plan_id?: string;
  status?: string;
  start_time?: string;
  billing_info?: {
    next_billing_time?: string;
  };
  subscriber?: {
    payer_id?: string;
    email_address?: string;
  };
};

function getSubscriptionId(event: PayPalWebhookEvent) {
  const eventType = String(event.event_type || "");

  if (eventType.startsWith("BILLING.SUBSCRIPTION.")) {
    return String(event.resource?.id || "").trim();
  }

  if (eventType.startsWith("PAYMENT.SALE.")) {
    return String(event.resource?.billing_agreement_id || "").trim();
  }

  return "";
}

async function verifyWebhookSignature(
  request: Request,
  webhookEvent: PayPalWebhookEvent
) {
  if (!PAYPAL_WEBHOOK_ID) {
    throw new Error("Missing PAYPAL_WEBHOOK_ID.");
  }

  const transmissionId = request.headers.get("paypal-transmission-id");
  const transmissionTime = request.headers.get("paypal-transmission-time");
  const transmissionSignature = request.headers.get(
    "paypal-transmission-sig"
  );
  const certUrl = request.headers.get("paypal-cert-url");
  const authAlgorithm = request.headers.get("paypal-auth-algo");

  if (
    !transmissionId ||
    !transmissionTime ||
    !transmissionSignature ||
    !certUrl ||
    !authAlgorithm
  ) {
    return false;
  }

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgorithm,
        transmission_sig: transmissionSignature,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: webhookEvent,
      }),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("paypal_webhook_verification_api_error", result);
    return false;
  }

  return result.verification_status === "SUCCESS";
}

async function getPayPalSubscription(subscriptionId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${encodeURIComponent(
      subscriptionId
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const data = (await response.json()) as PayPalSubscription;

  if (!response.ok) {
    console.error("paypal_webhook_subscription_lookup_error", data);
    throw new Error("Unable to retrieve PayPal subscription.");
  }

  return data;
}

export async function POST(request: Request) {
  try {
    if (!PAYPAL_WEBHOOK_ID) {
      return NextResponse.json(
        { ok: false, error: "Missing PAYPAL_WEBHOOK_ID." },
        { status: 500 }
      );
    }

    if (!PAYPAL_PLAN_ID) {
      return NextResponse.json(
        { ok: false, error: "Missing PayPal Plan ID." },
        { status: 500 }
      );
    }

    const rawBody = await request.text();

    let event: PayPalWebhookEvent;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid webhook JSON." },
        { status: 400 }
      );
    }

    const verified = await verifyWebhookSignature(request, event);

    if (!verified) {
      console.error("paypal_webhook_signature_invalid", {
        event_id: event.id,
        event_type: event.event_type,
      });

      return NextResponse.json(
        { ok: false, error: "Invalid PayPal webhook signature." },
        { status: 400 }
      );
    }

    const eventType = String(event.event_type || "");
    const subscriptionId = getSubscriptionId(event);

    if (!subscriptionId) {
      return NextResponse.json({
        ok: true,
        ignored: true,
        reason: "No subscription ID found.",
        event_type: eventType,
      });
    }

    const subscription = await getPayPalSubscription(subscriptionId);

    if (subscription.plan_id !== PAYPAL_PLAN_ID) {
      return NextResponse.json({
        ok: true,
        ignored: true,
        reason: "Subscription belongs to another plan.",
      });
    }

    const admin = createSupabaseAdminClient();

    const { data: profile, error: profileLookupError } = await admin
      .from("profiles")
      .select(
        "auth_user_id, trial_ends_at, paypal_subscription_id"
      )
      .eq("paypal_subscription_id", subscriptionId)
      .maybeSingle();

    if (profileLookupError) {
      console.error(
        "paypal_webhook_profile_lookup_error",
        profileLookupError
      );

      return NextResponse.json(
        { ok: false, error: "Could not locate subscription profile." },
        { status: 500 }
      );
    }

    if (!profile) {
      console.warn("paypal_webhook_profile_not_found", {
        event_id: event.id,
        event_type: eventType,
        subscription_id: subscriptionId,
      });

      return NextResponse.json({
        ok: true,
        ignored: true,
        reason: "No Nestrova profile is linked to this subscription.",
      });
    }

    const now = new Date();
    const existingTrialEnd = profile.trial_ends_at
      ? new Date(profile.trial_ends_at)
      : null;

    const trialStillActive =
      existingTrialEnd &&
      Number.isFinite(existingTrialEnd.getTime()) &&
      existingTrialEnd.getTime() > now.getTime();

    let isPro = false;
    let subscriptionStatus = "inactive";
    let cancelAtPeriodEnd = false;

    switch (subscription.status) {
      case "ACTIVE":
        isPro = true;
        subscriptionStatus = trialStillActive ? "trialing" : "active";
        break;

      case "SUSPENDED":
        isPro = false;
        subscriptionStatus = "suspended";
        break;

      case "CANCELLED":
        isPro = false;
        subscriptionStatus = "cancelled";
        break;

      case "EXPIRED":
        isPro = false;
        subscriptionStatus = "expired";
        break;

      case "APPROVAL_PENDING":
      case "APPROVED":
        isPro = false;
        subscriptionStatus = "pending";
        break;

      default:
        isPro = false;
        subscriptionStatus = String(
          subscription.status || "unknown"
        ).toLowerCase();
    }

    /*
     * The first successful paid renewal means the free trial has ended.
     */
    if (eventType === "PAYMENT.SALE.COMPLETED") {
      isPro = true;
      subscriptionStatus = "active";
    }

    /*
     * Failed or refunded subscription payments revoke Pro access until
     * the merchant resolves the subscription state.
     */
    if (eventType === "PAYMENT.SALE.DENIED") {
      isPro = false;
      subscriptionStatus = "payment_failed";
    }

    if (eventType === "PAYMENT.SALE.REFUNDED") {
      isPro = false;
      subscriptionStatus = "refunded";
    }

    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      isPro = false;
      subscriptionStatus = "cancelled";
      cancelAtPeriodEnd = true;
    }

    const updatedAt = now.toISOString();

    const { error: updateError } = await admin
      .from("profiles")
      .update({
        is_pro: isPro,
        plan: isPro ? "pro" : "free",
        subscription_status: subscriptionStatus,
        paypal_plan_id: subscription.plan_id || PAYPAL_PLAN_ID,
        paypal_payer_id:
          subscription.subscriber?.payer_id || null,
        current_period_end:
          subscription.billing_info?.next_billing_time || null,
        cancel_at_period_end: cancelAtPeriodEnd,
        subscription_updated_at: updatedAt,
        updated_at: updatedAt,
      })
      .eq("auth_user_id", profile.auth_user_id);

    if (updateError) {
      console.error("paypal_webhook_profile_update_error", updateError);

      return NextResponse.json(
        { ok: false, error: "Could not update subscription profile." },
        { status: 500 }
      );
    }

    console.log("paypal_webhook_processed", {
      event_id: event.id,
      event_type: eventType,
      subscription_id: subscriptionId,
      paypal_status: subscription.status,
      nestrova_status: subscriptionStatus,
      is_pro: isPro,
    });

    return NextResponse.json({
      ok: true,
      event_id: event.id || null,
      event_type: eventType,
      subscription_id: subscriptionId,
      subscription_status: subscriptionStatus,
      is_pro: isPro,
    });
  } catch (error) {
    console.error("paypal_webhook_unhandled_error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "PayPal webhook processing failed.",
      },
      { status: 500 }
    );
  }
}
