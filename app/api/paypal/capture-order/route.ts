import { NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/payments/paypal";

export async function POST(request: Request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({ ok: false, error: "orderID is required." }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Unable to capture PayPal order.", details: data }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status: data.status, order: data });
  } catch {
    return NextResponse.json({ ok: false, error: "PayPal capture-order failed." }, { status: 500 });
  }
}
