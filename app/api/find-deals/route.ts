import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const HOME_DEAL_API_URL = process.env.HOME_DEAL_API_URL || "https://home-deal-api.onrender.com";
const INTERNAL_API_KEY = process.env.NESTROVA_INTERNAL_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Supabase server env.");
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

async function getIsPro(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("is_pro,plan,subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) throw new Error("Could not load profile.");

  if (!data) {
    await supabase.from("profiles").insert({
      clerk_user_id: userId,
      is_pro: false,
      plan: "free",
      subscription_status: "free",
      updated_at: new Date().toISOString(),
    });
    return false;
  }

  return Boolean(data.is_pro) || data.plan === "pro" || data.subscription_status === "active";
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ detail: "Please sign in to find deals." }, { status: 401 });
    }

    const body = await request.json();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim().toUpperCase();
    const maxPrice = Number(body.max_price);

    if (!city) return NextResponse.json({ detail: "City is required." }, { status: 400 });
    if (!state) return NextResponse.json({ detail: "State is required." }, { status: 400 });
    if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
      return NextResponse.json({ detail: "Please enter a valid max price." }, { status: 400 });
    }

    const isPro = await getIsPro(userId);

    const response = await fetch(`${HOME_DEAL_API_URL}/find-deals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(INTERNAL_API_KEY ? { "X-Nestrova-Internal-Key": INTERNAL_API_KEY } : {}),
      },
      body: JSON.stringify({
        city,
        state,
        max_price: maxPrice,
        limit: Number(body.limit || 20),
        user_id: userId,
        is_pro: isPro,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json(data, { status: response.status });

    return NextResponse.json({ ...data, server_verified_pro: isPro, plan: isPro ? "pro" : "free" });
  } catch (error) {
    console.error("secure find-deals proxy failed:", error);
    return NextResponse.json({ detail: "Find deals request failed." }, { status: 500 });
  }
}
