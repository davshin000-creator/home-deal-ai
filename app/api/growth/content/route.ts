import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function GET() {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ items: [] });
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("growth_content").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load content." }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(request: Request) {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = await request.json();
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("growth_content").insert({
    user_id: user.id, platform: body.platform || "Shorts", title,
    hook: body.hook || "", script: body.script || [], caption: body.caption || "",
    status: body.status || "draft", source_address: body.source_address || "",
    metrics: body.metrics || {}, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not save content." }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PATCH(request: Request) {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = await request.json();
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("growth_content").update({ status: body.status, metrics: body.metrics || {}, updated_at: new Date().toISOString() }).eq("id", body.id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Could not update content." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

