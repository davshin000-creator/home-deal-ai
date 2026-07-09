"use client";

import { useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

function PayPalCheckoutInner() {
  const router = useRouter();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [errorMessage, setErrorMessage] = useState("");

  if (isPending) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/60">
        Loading PayPal checkout...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
        PayPal checkout failed to load. Check the PayPal Client ID and browser console.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <PayPalButtons
        fundingSource="paypal"
        forceReRender={["USD", "capture"]}
        style={{
          layout: "vertical",
          shape: "pill",
          label: "pay",
        }}
        createOrder={async () => {
          setErrorMessage("");

          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            credentials: "include",
          });

          const data = await response.json();

          if (response.status === 401) {
            setErrorMessage("Please sign in before upgrading.");
            router.push("/login");
            throw new Error("Please sign in before upgrading.");
          }

          if (!response.ok || !data.ok || !data.id) {
            const message =
              data.error || "Unable to create PayPal order.";

            setErrorMessage(message);
            throw new Error(message);
          }

          return data.id;
        }}
        onApprove={async (data) => {
          setErrorMessage("");

          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderID: data.orderID,
            }),
          });

          const result = await response.json();

          if (!response.ok || !result.ok) {
            setErrorMessage(
              result.error || "Unable to complete PayPal payment."
            );
            return;
          }

          router.push("/checkout/success");
          router.refresh();
        }}
        onCancel={() => {
          router.push("/checkout/cancel");
        }}
        onError={(error) => {
          console.error("PayPal checkout error:", error);
          setErrorMessage(
            "PayPal checkout failed. Open the browser console for details."
          );
        }}
      />

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function PayPalCheckoutButton() {
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
  intent: "capture",
  components: "buttons",
  disableFunding: "card,credit,paylater",
}}
    >
      <PayPalCheckoutInner />
    </PayPalScriptProvider>
  );
}