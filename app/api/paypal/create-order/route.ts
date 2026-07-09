import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/supabase/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/payments/paypal";

export async function POST() {
  try {
    const { user } = await getCurrentUserProfile();
    if (!user) return NextResponse.json({ ok: false, error: "Please sign in before upgrading." }, { status: 401 });

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ description: "Nestrova Pro Monthly Access", custom_id: user.id, amount: { currency_code: "USD", value: "19.00" } }],
        application_context: { brand_name: "Nestrova", landing_page: "LOGIN", user_action: "PAY_NOW" },
      }),
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ ok: false, error: "Unable to create PayPal order.", details: data }, { status: 500 });

    return NextResponse.json({ ok: true, id: data.id, user_id: user.id, email: user.email || null });
  } catch {
    return NextResponse.json({ ok: false, error: "PayPal create-order failed." }, { status: 500 });
  }
}

