"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

export default function PayPalCheckoutButton() {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID.</div>;
  }

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD", intent: "capture" }}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", label: "pay" }}
        createOrder={async () => {
          const response = await fetch("/api/paypal/create-order", { method: "POST" });
          const data = await response.json();
          if (response.status === 401) {
            router.push("/login");
            throw new Error("Please sign in before upgrading.");
          }
          if (!data.ok || !data.id) throw new Error(data.error || "Unable to create PayPal order.");
          return data.id;
        }}
        onApprove={async (data) => {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const result = await response.json();
          if (result.ok) router.push("/checkout/success");
          else router.push("/checkout/cancel");
        }}
        onCancel={() => router.push("/checkout/cancel")}
      />
    </PayPalScriptProvider>
  );
}
