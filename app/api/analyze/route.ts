import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

const HOME_DEAL_API_URL = process.env.HOME_DEAL_API_URL || "https://home-deal-api.onrender.com";
const INTERNAL_API_KEY = process.env.NESTROVA_INTERNAL_API_KEY;

export async function POST(request: Request) {
  try {
    const { user, isPro } = await getCurrentUserProfile();
    if (!user) return NextResponse.json({ detail: "Please sign in to analyze properties." }, { status: 401 });

    const body = await request.json();
    const address = String(body.address || "").trim();
    const listingPrice = Number(body.listing_price);

    if (!address) return NextResponse.json({ detail: "Property address is required." }, { status: 400 });
    if (!Number.isFinite(listingPrice) || listingPrice <= 0) return NextResponse.json({ detail: "Listing price must be greater than 0." }, { status: 400 });

    const admin = createSupabaseAdminClient();
    await admin.from("analytics_events").insert({ user_id: user.id, event_name: "analyze_started", page_path: "/analyze", metadata: { address }, created_at: new Date().toISOString() });

    const response = await fetch(`${HOME_DEAL_API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(INTERNAL_API_KEY ? { "X-Nestrova-Internal-Key": INTERNAL_API_KEY } : {}) },
      body: JSON.stringify({
        address,
        listing_price: listingPrice,
        down_payment_percent: Number(body.down_payment_percent || 25),
        interest_rate: Number(body.interest_rate || 6.5),
        loan_term_years: Number(body.loan_term_years || 30),
        user_id: user.id,
        is_pro: isPro,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json(data, { status: response.status });

    await admin.from("deal_history").insert({
      user_id: user.id,
      address,
      listing_price: listingPrice,
      fair_value: Number(data.fair_value || 0),
      estimated_monthly_rent: Number(data.estimated_monthly_rent || 0),
      discount_percent: Number(data.discount_percent || 0),
      gross_rent_yield: Number(data.gross_rent_yield || 0),
      deal_score: Number(data.deal_score || data.overall_score || 0),
      status: data.status || "Analyzed",
      estimated_monthly_cash_flow: Number(data.estimated_monthly_cash_flow || 0),
      result_json: data,
      created_at: new Date().toISOString(),
    });

    await admin.from("analytics_events").insert({ user_id: user.id, event_name: "analyze_completed", page_path: "/analyze", metadata: { address, score: data.deal_score || data.overall_score || 0, status: data.status || "" }, created_at: new Date().toISOString() });

    return NextResponse.json({ ...data, server_verified_pro: isPro, plan: isPro ? "pro" : "free" });
  } catch {
    return NextResponse.json({ detail: "Analyze request failed." }, { status: 500 });
  }
}

