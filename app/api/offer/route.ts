import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateOffer } from "@/lib/offer/offerEngine";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
    }
    const body = await request.json();
    const property = body.property || {};
    const userId = body.user_id || null;
    const result = body.result || calculateOffer(property);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase.from("offer_strategies").insert({
      user_id: userId,
      property_address: property.propertyAddress || "",
      listing_price: Number(property.listingPrice || 0),
      fair_value: Number(property.fairValue || 0),
      recommended_offer: result.recommendedOffer,
      max_offer: result.maxOffer,
      walk_away_price: result.walkAwayPrice,
      offer_strength: result.offerStrength,
      confidence: result.confidence,
      leverage: result.leverage,
      payload: { property, result },
      created_at: new Date().toISOString(),
    }).select("id").single();

    if (error) return NextResponse.json({ error: "Could not save offer strategy." }, { status: 500 });
    return NextResponse.json({ id: data.id, result });
  } catch {
    return NextResponse.json({ error: "Unexpected offer server error." }, { status: 500 });
  }
}

