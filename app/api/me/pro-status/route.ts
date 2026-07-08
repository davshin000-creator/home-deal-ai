import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Supabase server environment variables.");
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId) return NextResponse.json({ ok: true, signed_in: false, is_pro: false, plan: "free" });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("clerk_user_id,email,is_pro,plan,subscription_status,pro_since,paypal_order_id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) return NextResponse.json({ ok: false, error: "Could not load profile." }, { status: 500 });

    if (!data) {
      await supabase.from("profiles").insert({
        clerk_user_id: userId,
        email: user?.emailAddresses?.[0]?.emailAddress || null,
        is_pro: false,
        plan: "free",
        subscription_status: "free",
        updated_at: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, signed_in: true, is_pro: false, plan: "free" });
    }

    return NextResponse.json({
      ok: true,
      signed_in: true,
      is_pro: Boolean(data.is_pro),
      plan: data.plan || "free",
      subscription_status: data.subscription_status || "free",
      pro_since: data.pro_since,
      paypal_order_id: data.paypal_order_id,
    });
  } catch (error) {
    console.error("pro-status failed:", error);
    return NextResponse.json({ ok: false, error: "Could not check Pro status." }, { status: 500 });
  }
}
