"use client";

import { useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

const PAYPAL_PLAN_ID = "P-5UG806013F244370KNJI57RY";

function PayPalSubscriptionInner() {
  const router = useRouter();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  const [errorMessage, setErrorMessage] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  if (isPending) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
        Loading PayPal subscription...
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
        }}
        createSubscription={async (_data, actions) => {
          setErrorMessage("");

          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID,
            custom_id: "nestrova-pro",
          });
        }}
        onApprove={async (data) => {
          setErrorMessage("");
          setIsActivating(true);

          try {
            if (!data.subscriptionID) {
              throw new Error("Missing PayPal subscription ID.");
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
              }
            );

            const result = await response.json();

            if (response.status === 401) {
              router.push("/login");
              throw new Error("Please sign in before upgrading.");
            }

            if (!response.ok || !result.ok) {
              throw new Error(
                result.error || "Unable to activate Nestrova Pro."
              );
            }

            router.push("/checkout/success");
            router.refresh();
          } catch (error) {
            setErrorMessage(
              error instanceof Error
                ? error.message
                : "Unable to activate Nestrova Pro."
            );
          } finally {
            setIsActivating(false);
          }
        }}
        onCancel={() => {
          router.push("/checkout/cancel");
        }}
        onError={(error) => {
          console.error("PayPal subscription error:", error);

          setErrorMessage(
            "PayPal subscription checkout failed. Please try again."
          );
        }}
      />

      {isActivating && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
          Activating Nestrova Pro...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function PayPalSubscriptionButton() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

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
      <PayPalSubscriptionInner />
    </PayPalScriptProvider>
  );
}