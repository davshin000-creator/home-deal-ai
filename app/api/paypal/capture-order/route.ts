import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/payments/paypal";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase server environment variables.");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const { orderID } = await request.json();

    if (!userId) return NextResponse.json({ ok: false, error: "Please sign in before upgrading." }, { status: 401 });
    if (!orderID) return NextResponse.json({ ok: false, error: "orderID is required." }, { status: 400 });

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Unable to capture PayPal order.", details: data }, { status: 500 });
    }

    const purchaseUnit = data.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const amount = capture?.amount;

    if (data.status !== "COMPLETED" || capture?.status !== "COMPLETED") {
      return NextResponse.json({ ok: false, error: "PayPal payment was not completed.", details: data }, { status: 400 });
    }
    if (amount?.currency_code !== "USD" || amount?.value !== "19.00") {
      return NextResponse.json({ ok: false, error: "PayPal payment amount mismatch.", details: data }, { status: 400 });
    }
    if (purchaseUnit?.custom_id && purchaseUnit.custom_id !== userId) {
      return NextResponse.json({ ok: false, error: "PayPal order does not match the signed-in user." }, { status: 403 });
    }

    const email = user?.emailAddresses?.[0]?.emailAddress || data.payer?.email_address || null;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("profiles").upsert({
      clerk_user_id: userId,
      email,
      is_pro: true,
      plan: "pro",
      subscription_status: "active",
      paypal_order_id: orderID,
      paypal_payer_id: data.payer?.payer_id || null,
      pro_since: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "clerk_user_id" });

    if (error) {
      console.error("Could not update Pro profile:", error);
      return NextResponse.json({ ok: false, error: "Payment captured, but Pro access could not be saved." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status: data.status, is_pro: true, plan: "pro", order: data });
  } catch (error) {
    console.error("PayPal capture-order failed:", error);
    return NextResponse.json({ ok: false, error: "PayPal capture-order failed." }, { status: 500 });
  }
}
