"use client";

import { useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export type PaidSubscriptionType =
  | "real_estate"
  | "trading"
  | "all_access";

type PayPalSubscriptionButtonProps = {
  subscriptionType: PaidSubscriptionType;
};

type SubscriptionPlanConfig = {
  displayName: string;
  planId: string | undefined;
};

function getPlanConfig(
  subscriptionType: PaidSubscriptionType,
): SubscriptionPlanConfig {
  const planConfigs: Record<
    PaidSubscriptionType,
    SubscriptionPlanConfig
  > = {
    real_estate: {
      displayName: "Real Estate Pro",
      planId:
        process.env.NEXT_PUBLIC_PAYPAL_REAL_ESTATE_PLAN_ID,
    },
    trading: {
      displayName: "Trading Pro",
      planId:
        process.env.NEXT_PUBLIC_PAYPAL_TRADING_PLAN_ID,
    },
    all_access: {
      displayName: "Nestrova AI Pro",
      planId:
        process.env.NEXT_PUBLIC_PAYPAL_ALL_ACCESS_PLAN_ID,
    },
  };

  return planConfigs[subscriptionType];
}

function PayPalSubscriptionInner({
  subscriptionType,
}: PayPalSubscriptionButtonProps) {
  const router = useRouter();
  const [{ isPending, isRejected }] =
    usePayPalScriptReducer();

  const { displayName, planId } =
    getPlanConfig(subscriptionType);

  const [errorMessage, setErrorMessage] = useState("");
  const [isActivating, setIsActivating] =
    useState(false);

  if (!planId) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
        Missing PayPal Plan ID for {displayName}.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
        Loading {displayName} checkout...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
        PayPal subscription checkout failed to load.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <PayPalButtons
        fundingSource="paypal"
        style={{
          layout: "vertical",
          shape: "pill",
          label: "subscribe",
          height: 48,
        }}
        forceReRender={[planId, subscriptionType]}
        createSubscription={async (_data, actions) => {
          setErrorMessage("");

          return actions.subscription.create({
            plan_id: planId,
            custom_id: subscriptionType,
            application_context: {
              brand_name: "Nestrova",
              shipping_preference: "NO_SHIPPING",
              user_action: "SUBSCRIBE_NOW",
              return_url: `${window.location.origin}/checkout/success`,
              cancel_url: `${window.location.origin}/checkout/cancel`,
            },
          });
        }}
        onApprove={async (data) => {
          setErrorMessage("");
          setIsActivating(true);

          try {
            if (!data.subscriptionID) {
              throw new Error(
                "Missing PayPal subscription ID.",
              );
            }

            const response = await fetch(
              "/api/paypal/activate-subscription",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  subscriptionID: data.subscriptionID,
                }),
              },
            );

            const result = (await response.json()) as {
              ok?: boolean;
              error?: string;
              subscription_type?: string;
            };

            if (response.status === 401) {
              router.push("/login");

              throw new Error(
                "Please sign in before upgrading.",
              );
            }

            if (!response.ok || !result.ok) {
              throw new Error(
                result.error ||
                  `Unable to activate ${displayName}.`,
              );
            }

            router.push(
              `/checkout/success?plan=${encodeURIComponent(
                result.subscription_type ??
                  subscriptionType,
              )}`,
            );

            router.refresh();
          } catch (error) {
            setErrorMessage(
              error instanceof Error
                ? error.message
                : `Unable to activate ${displayName}.`,
            );
          } finally {
            setIsActivating(false);
          }
        }}
        onCancel={() => {
          router.push(
            `/checkout/cancel?plan=${encodeURIComponent(
              subscriptionType,
            )}`,
          );
        }}
        onError={(error) => {
          console.error(
            "PayPal subscription error:",
            error,
          );

          setErrorMessage(
            "PayPal subscription checkout failed. Please try again.",
          );
        }}
        disabled={isActivating}
      />

      {isActivating && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
          Activating {displayName}...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      <p className="text-center text-xs leading-5 text-white/40">
        Secure subscription powered by PayPal. Cancel
        anytime from your account.
      </p>
    </div>
  );
}

export default function PayPalSubscriptionButton({
  subscriptionType,
}: PayPalSubscriptionButtonProps) {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const { displayName } =
    getPlanConfig(subscriptionType);

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
        Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        vault: true,
        intent: "subscription",
        components: "buttons",
        disableFunding: "card,credit,paylater",
      }}
    >
      <div aria-label={`${displayName} PayPal checkout`}>
        <PayPalSubscriptionInner
          subscriptionType={subscriptionType}
        />
      </div>
    </PayPalScriptProvider>
  );
}