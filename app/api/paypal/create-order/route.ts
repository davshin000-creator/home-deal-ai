import { NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/payments/paypal";

export async function POST() {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Nestrova Pro Monthly Access",
            amount: { currency_code: "USD", value: "19.00" },
          },
        ],
        application_context: {
          brand_name: "Nestrova",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
        },
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Unable to create PayPal order.", details: data }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json({ ok: false, error: "PayPal create-order failed." }, { status: 500 });
  }
}
