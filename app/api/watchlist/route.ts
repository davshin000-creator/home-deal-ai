import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET(request: Request) {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load watchlist." }, { status: 500 });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request: Request) {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
  }

  const body = await request.json();
  const userId = String(body.user_id || "");
  const address = String(body.address || "").trim();

  if (!userId || !address) {
    return NextResponse.json({ error: "Missing user_id or address." }, { status: 400 });
  }

  const { error } = await supabase.from("watchlist_items").insert({
    user_id: userId,
    email: body.email || "",
    address,
    target_price: Number(body.target_price || 0),
    note: body.note || "",
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: "Could not save watchlist item." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
