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
    return NextResponse.json(
      { error: "Missing Supabase service variables." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
  }

  const { data } = await supabase
    .from("user_onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return NextResponse.json(data || { step: 0, completed: false });
}

export async function POST(request: Request) {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: "Missing Supabase service variables." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const userId = String(body.user_id || "");
  const step = Number(body.step || 0);

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
  }

  const { error } = await supabase.from("user_onboarding").upsert(
    {
      user_id: userId,
      step,
      completed: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Could not save onboarding step." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, step });
}
