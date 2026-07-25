import { NextResponse } from "next/server";

import {
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

import {
  getPayPalAccessToken,
  PAYPAL_API_BASE,
} from "@/lib/payments/paypal";

import {
  getSubscriptionEntitlements,
  type SubscriptionType,
} from "@/lib/subscriptions/entitlements";

const PAYPAL_WEBHOOK_ID =
  process.env.PAYPAL_WEBHOOK_ID;

type PaidSubscriptionType = Exclude<
  SubscriptionType,
  "free"
>;

type PlanConfiguration = {
  subscriptionType: PaidSubscriptionType;
  planId: string | undefined;
  displayName: string;
};

const PLAN_CONFIGURATIONS: PlanConfiguration[] = [
  {
    subscriptionType: "real_estate",
    planId:
      process.env
        .NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID,
    displayName: "Real Estate Pro",
  },
  {
    subscriptionType: "trading",
    planId:
      process.env.NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID,
    displayName: "Trading Pro",
  },
  {
    subscriptionType: "all_access",
    planId:
      process.env
        .NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID,
    displayName: "Nestrova AI Pro",
  },
];

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  create_time?: string;
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
  create_time?: string;
  update_time?: string;
  custom_id?: string;

  billing_info?: {
    next_billing_time?: string;
    last_payment?: {
      time?: string;
      amount?: {
        currency_code?: string;
        value?: string;
      };
    };
    failed_payments_count?: number;
  };

  subscriber?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
};

type WebhookVerificationResponse = {
  verification_status?: string;
};

function getMissingEnvironmentVariables(): string[] {
  const missing: string[] = [];

  if (!PAYPAL_WEBHOOK_ID) {
    missing.push("PAYPAL_WEBHOOK_ID");
  }

  if (
    !process.env
      .NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID
  ) {
    missing.push(
      "NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID",
    );
  }

  if (
    !process.env.NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID
  ) {
    missing.push(
      "NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID",
    );
  }

  if (
    !process.env
      .NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID
  ) {
    missing.push(
      "NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID",
    );
  }

  return missing;
}

function findPlanConfiguration(
  paypalPlanId: unknown,
): PlanConfiguration | null {
  if (typeof paypalPlanId !== "string") {
    return null;
  }

  const normalizedPlanId = paypalPlanId.trim();

  if (!normalizedPlanId) {
    return null;
  }

  return (
    PLAN_CONFIGURATIONS.find(
      (configuration) =>
        Boolean(configuration.planId) &&
        configuration.planId === normalizedPlanId,
    ) ?? null
  );
}

function getSubscriptionId(
  event: PayPalWebhookEvent,
): string {
  const eventType = String(
    event.event_type ?? "",
  ).trim();

  if (
    eventType.startsWith(
      "BILLING.SUBSCRIPTION.",
    )
  ) {
    return String(event.resource?.id ?? "").trim();
  }

  if (eventType.startsWith("PAYMENT.SALE.")) {
    return String(
      event.resource?.billing_agreement_id ?? "",
    ).trim();
  }

  return "";
}

async function verifyWebhookSignature(
  request: Request,
  webhookEvent: PayPalWebhookEvent,
): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID) {
    throw new Error("Missing PAYPAL_WEBHOOK_ID.");
  }

  const transmissionId = request.headers.get(
    "paypal-transmission-id",
  );

  const transmissionTime = request.headers.get(
    "paypal-transmission-time",
  );

  const transmissionSignature =
    request.headers.get(
      "paypal-transmission-sig",
    );

  const certUrl = request.headers.get(
    "paypal-cert-url",
  );

  const authAlgorithm = request.headers.get(
    "paypal-auth-algo",
  );

  if (
    !transmissionId ||
    !transmissionTime ||
    !transmissionSignature ||
    !certUrl ||
    !authAlgorithm
  ) {
    return false;
  }

  const accessToken =
    await getPayPalAccessToken();

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
    },
  );

  const result =
    (await response.json()) as WebhookVerificationResponse;

  if (!response.ok) {
    console.error(
      "paypal_webhook_verification_api_error",
      result,
    );

    return false;
  }

  return result.verification_status === "SUCCESS";
}

async function getPayPalSubscription(
  subscriptionId: string,
): Promise<PayPalSubscription> {
  const accessToken =
    await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${encodeURIComponent(
      subscriptionId,
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

  const data =
    (await response.json()) as PayPalSubscription;

  if (!response.ok) {
    console.error(
      "paypal_webhook_subscription_lookup_error",
      data,
    );

    throw new Error(
      "Unable to retrieve PayPal subscription.",
    );
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const missingEnvironmentVariables =
      getMissingEnvironmentVariables();

    if (missingEnvironmentVariables.length > 0) {
      console.error(
        "paypal_webhook_missing_environment_variables",
        missingEnvironmentVariables,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "PayPal webhook configuration is incomplete.",
          missing:
            missingEnvironmentVariables,
        },
        {
          status: 500,
        },
      );
    }

    const rawBody = await request.text();

    let event: PayPalWebhookEvent;

    try {
      event = JSON.parse(
        rawBody,
      ) as PayPalWebhookEvent;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid webhook JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const verified =
      await verifyWebhookSignature(
        request,
        event,
      );

    if (!verified) {
      console.error(
        "paypal_webhook_signature_invalid",
        {
          event_id: event.id,
          event_type: event.event_type,
        },
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid PayPal webhook signature.",
        },
        {
          status: 400,
        },
      );
    }

    const eventType = String(
      event.event_type ?? "",
    ).trim();

    const subscriptionId =
      getSubscriptionId(event);

    if (!subscriptionId) {
      return NextResponse.json({
        ok: true,
        ignored: true,
        reason:
          "No subscription ID was found in the event.",
        event_type: eventType,
      });
    }

    const subscription =
      await getPayPalSubscription(
        subscriptionId,
      );

    if (
      !subscription.id ||
      subscription.id !== subscriptionId
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "PayPal subscription verification mismatch.",
        },
        {
          status: 403,
        },
      );
    }

    const planConfiguration =
      findPlanConfiguration(
        subscription.plan_id,
      );

    if (!planConfiguration) {
      console.warn(
        "paypal_webhook_unknown_plan",
        {
          event_id: event.id,
          event_type: eventType,
          subscription_id: subscriptionId,
          paypal_plan_id: subscription.plan_id,
        },
      );

      return NextResponse.json({
        ok: true,
        ignored: true,
        reason:
          "The subscription belongs to an unknown PayPal plan.",
      });
    }

    const admin =
      createSupabaseAdminClient();

    const {
      data: profile,
      error: profileLookupError,
    } = await admin
      .from("profiles")
      .select(
        `
          auth_user_id,
          trial_ends_at,
          paypal_subscription_id,
          subscription_type,
          subscription_status
        `,
      )
      .eq(
        "paypal_subscription_id",
        subscriptionId,
      )
      .maybeSingle();

    if (profileLookupError) {
      console.error(
        "paypal_webhook_profile_lookup_error",
        profileLookupError,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not locate the subscription profile.",
        },
        {
          status: 500,
        },
      );
    }

    if (!profile) {
      console.warn(
        "paypal_webhook_profile_not_found",
        {
          event_id: event.id,
          event_type: eventType,
          subscription_id: subscriptionId,
        },
      );

      return NextResponse.json({
        ok: true,
        ignored: true,
        reason:
          "No Nestrova profile is linked to this subscription.",
      });
    }

    const now = new Date();

    const existingTrialEnd =
      profile.trial_ends_at
        ? new Date(profile.trial_ends_at)
        : null;

    const trialStillActive =
      existingTrialEnd !== null &&
      !Number.isNaN(
        existingTrialEnd.getTime(),
      ) &&
      existingTrialEnd.getTime() >
        now.getTime();

    const paypalStatus = String(
      subscription.status ?? "",
    )
      .trim()
      .toUpperCase();

    let hasPaidAccess = false;
    let subscriptionStatus = "inactive";
    let cancelAtPeriodEnd = false;

    switch (paypalStatus) {
      case "ACTIVE":
        hasPaidAccess = true;

        subscriptionStatus = trialStillActive
          ? "trialing"
          : "active";
        break;

      case "APPROVED":
        hasPaidAccess = false;
        subscriptionStatus = "approved";
        break;

      case "APPROVAL_PENDING":
        hasPaidAccess = false;
        subscriptionStatus =
          "approval_pending";
        break;

      case "SUSPENDED":
        hasPaidAccess = false;
        subscriptionStatus = "suspended";
        break;

      case "CANCELLED":
        hasPaidAccess = false;
        subscriptionStatus = "cancelled";
        cancelAtPeriodEnd = true;
        break;

      case "EXPIRED":
        hasPaidAccess = false;
        subscriptionStatus = "expired";
        break;

      default:
        hasPaidAccess = false;
        subscriptionStatus =
          paypalStatus.toLowerCase() ||
          "unknown";
    }

    if (
      eventType ===
      "BILLING.SUBSCRIPTION.ACTIVATED"
    ) {
      hasPaidAccess = true;

      subscriptionStatus = trialStillActive
        ? "trialing"
        : "active";

      cancelAtPeriodEnd = false;
    }

    if (
      eventType ===
      "BILLING.SUBSCRIPTION.SUSPENDED"
    ) {
      hasPaidAccess = false;
      subscriptionStatus = "suspended";
    }

    if (
      eventType ===
      "BILLING.SUBSCRIPTION.EXPIRED"
    ) {
      hasPaidAccess = false;
      subscriptionStatus = "expired";
    }

    if (
      eventType ===
      "BILLING.SUBSCRIPTION.CANCELLED"
    ) {
      hasPaidAccess = false;
      subscriptionStatus = "cancelled";
      cancelAtPeriodEnd = true;
    }

    if (
      eventType === "PAYMENT.SALE.COMPLETED"
    ) {
      hasPaidAccess = true;
      subscriptionStatus = "active";
      cancelAtPeriodEnd = false;
    }

    if (
      eventType === "PAYMENT.SALE.DENIED"
    ) {
      hasPaidAccess = false;
      subscriptionStatus =
        "payment_failed";
    }

    if (
      eventType === "PAYMENT.SALE.REFUNDED"
    ) {
      hasPaidAccess = false;
      subscriptionStatus = "refunded";
    }

    if (
      eventType === "PAYMENT.SALE.REVERSED"
    ) {
      hasPaidAccess = false;
      subscriptionStatus = "reversed";
    }

    const savedSubscriptionType:
      | PaidSubscriptionType
      | "free" = hasPaidAccess
      ? planConfiguration.subscriptionType
      : "free";

    const entitlements = hasPaidAccess
      ? getSubscriptionEntitlements(
          planConfiguration.subscriptionType,
        )
      : [];

    const updatedAt = now.toISOString();

    const {
      error: updateError,
    } = await admin
      .from("profiles")
      .update({
        is_pro: hasPaidAccess,

        // 기존 코드와의 호환성을 위해 유지
        plan: savedSubscriptionType,

        subscription_type:
          savedSubscriptionType,

        entitlements,

        subscription_status:
          subscriptionStatus,

        paypal_subscription_id:
          subscriptionId,

        paypal_plan_id:
          subscription.plan_id ??
          planConfiguration.planId,

        paypal_payer_id:
          subscription.subscriber?.payer_id ??
          null,

        current_period_end:
          subscription.billing_info
            ?.next_billing_time ?? null,

        cancel_at_period_end:
          cancelAtPeriodEnd,

        subscription_updated_at:
          updatedAt,

        updated_at: updatedAt,
      })
      .eq(
        "auth_user_id",
        profile.auth_user_id,
      );

    if (updateError) {
      console.error(
        "paypal_webhook_profile_update_error",
        updateError,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not update the subscription profile.",
        },
        {
          status: 500,
        },
      );
    }

    console.log(
      "paypal_webhook_processed",
      {
        event_id: event.id,
        event_type: eventType,
        subscription_id: subscriptionId,
        paypal_plan_id:
          subscription.plan_id,
        paypal_status: paypalStatus,
        subscription_type:
          savedSubscriptionType,
        subscription_status:
          subscriptionStatus,
        entitlements,
        has_paid_access: hasPaidAccess,
      },
    );

    return NextResponse.json({
      ok: true,
      event_id: event.id ?? null,
      event_type: eventType,
      subscription_id: subscriptionId,
      paypal_plan_id:
        subscription.plan_id ?? null,
      subscription_type:
        savedSubscriptionType,
      subscription_status:
        subscriptionStatus,
      entitlements,
      is_pro: hasPaidAccess,
    });
  } catch (error) {
    console.error(
      "paypal_webhook_unhandled_error",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "PayPal webhook processing failed.",
      },
      {
        status: 500,
      },
    );
  }
}