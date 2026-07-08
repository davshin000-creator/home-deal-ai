import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const HOME_DEAL_API_URL =
  process.env.HOME_DEAL_API_URL || "https://home-deal-api.onrender.com";

const INTERNAL_API_KEY = process.env.NESTROVA_INTERNAL_API_KEY;

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

async function getProfile(userId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("clerk_user_id,is_pro,plan,subscription_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load profile.");
  }

  if (!data) {
    await supabase.from("profiles").insert({
      clerk_user_id: userId,
      is_pro: false,
      plan: "free",
      subscription_status: "free",
      updated_at: new Date().toISOString(),
    });

    return {
      is_pro: false,
      plan: "free",
      subscription_status: "free",
    };
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { detail: "Please sign in to analyze properties." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const address = String(body.address || "").trim();
    const listingPrice = Number(body.listing_price);

    if (!address) {
      return NextResponse.json(
        { detail: "Property address is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(listingPrice) || listingPrice <= 0) {
      return NextResponse.json(
        { detail: "Listing price must be greater than 0." },
        { status: 400 }
      );
    }

    const profile = await getProfile(userId);
    const isPro =
      Boolean(profile.is_pro) ||
      profile.plan === "pro" ||
      profile.subscription_status === "active";

    const response = await fetch(`${HOME_DEAL_API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(INTERNAL_API_KEY ? { "X-Nestrova-Internal-Key": INTERNAL_API_KEY } : {}),
      },
      body: JSON.stringify({
        address,
        listing_price: listingPrice,
        down_payment_percent: Number(body.down_payment_percent || 25),
        interest_rate: Number(body.interest_rate || 6.5),
        loan_term_years: Number(body.loan_term_years || 30),
        user_id: userId,
        is_pro: isPro,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      ...data,
      server_verified_pro: isPro,
      plan: isPro ? "pro" : "free",
    });
  } catch (error) {
    console.error("secure analyze proxy failed:", error);
    return NextResponse.json(
      { detail: "Analyze request failed." },
      { status: 500 }
    );
  }
}
