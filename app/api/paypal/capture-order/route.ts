import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/payments/paypal";

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();
    const { orderID } = await request.json();

    if (!user) return NextResponse.json({ ok: false, error: "Please sign in before upgrading." }, { status: 401 });
    if (!orderID) return NextResponse.json({ ok: false, error: "orderID is required." }, { status: 400 });

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    const purchaseUnit = data.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const amount = capture?.amount;

    if (!response.ok) return NextResponse.json({ ok: false, error: "Unable to capture PayPal order.", details: data }, { status: 500 });
    if (data.status !== "COMPLETED" || capture?.status !== "COMPLETED") return NextResponse.json({ ok: false, error: "PayPal payment was not completed.", details: data }, { status: 400 });
    if (amount?.currency_code !== "USD" || amount?.value !== "19.00") return NextResponse.json({ ok: false, error: "PayPal payment amount mismatch.", details: data }, { status: 400 });
    if (purchaseUnit?.custom_id && purchaseUnit.custom_id !== user.id) return NextResponse.json({ ok: false, error: "PayPal order does not match the signed-in user." }, { status: 403 });

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("profiles").upsert({
      auth_user_id: user.id,
      email: user.email || data.payer?.email_address || null,
      is_pro: true,
      plan: "pro",
      subscription_status: "active",
      paypal_order_id: orderID,
      paypal_payer_id: data.payer?.payer_id || null,
      pro_since: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "auth_user_id" });

    if (error) return NextResponse.json({ ok: false, error: "Payment captured, but Pro access could not be saved." }, { status: 500 });

    return NextResponse.json({ ok: true, status: data.status, is_pro: true, plan: "pro", order: data });
  } catch {
    return NextResponse.json({ ok: false, error: "PayPal capture-order failed." }, { status: 500 });
  }
}

