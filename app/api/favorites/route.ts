import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function GET() {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ items: [] });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("favorite_properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Could not load favorites." }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(request: Request) {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const body = await request.json();
  const address = String(body.address || "").trim();
  if (!address) return NextResponse.json({ error: "Address is required." }, { status: 400 });

  const admin = createSupabaseAdminClient();

  const { data: existing } = await admin
    .from("favorite_properties")
    .select("id")
    .eq("user_id", user.id)
    .eq("address", address)
    .maybeSingle();

  if (existing) {
    const { error } = await admin.from("favorite_properties").delete().eq("id", existing.id).eq("user_id", user.id);
    if (error) return NextResponse.json({ error: "Could not remove favorite." }, { status: 500 });
    return NextResponse.json({ ok: true, favorited: false });
  }

  const { data, error } = await admin
    .from("favorite_properties")
    .insert({
      user_id: user.id,
      address,
      listing_price: Number(body.listing_price || 0),
      fair_value: Number(body.fair_value || 0),
      estimated_monthly_rent: Number(body.estimated_monthly_rent || 0),
      deal_score: Number(body.deal_score || 0),
      overall_score: Number(body.overall_score || body.deal_score || 0),
      status: body.status || "Analyzed",
      metadata: body.metadata || {},
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Could not save favorite." }, { status: 500 });
  return NextResponse.json({ ok: true, favorited: true, id: data.id });
}

