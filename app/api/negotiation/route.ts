import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateNegotiation } from "@/lib/negotiation/negotiationEngine";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
    }

    const body = await request.json();
    const input = body.input || {};
    const userId = body.user_id || null;
    const result = body.result || calculateNegotiation(input);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase.from("negotiation_strategies").insert({
      user_id: userId,
      property_address: input.propertyAddress || "",
      listing_price: Number(input.listingPrice || 0),
      recommended_offer: Number(input.recommendedOffer || 0),
      fair_value: Number(input.fairValue || 0),
      seller_counter: Number(input.sellerCounter || 0),
      motivation_score: result.motivationScore,
      leverage_level: result.leverageLevel,
      recommended_counter: result.recommendedCounter,
      payload: { input, result },
      created_at: new Date().toISOString(),
    }).select("id").single();

    if (error) return NextResponse.json({ error: "Could not save negotiation strategy." }, { status: 500 });
    return NextResponse.json({ id: data.id, result });
  } catch {
    return NextResponse.json({ error: "Unexpected negotiation server error." }, { status: 500 });
  }
}

