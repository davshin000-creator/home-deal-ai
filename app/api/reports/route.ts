import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function GET() {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ reports: [] });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("ai_reports")
    .select("id, property_address, investor_type, is_full_report, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Could not load reports." }, { status: 500 });
  return NextResponse.json({ reports: data || [] });
}

export async function DELETE(request: Request) {
  const { user } = await getCurrentUserProfile();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Report id is required." }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("ai_reports").delete().eq("id", id).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Could not delete report." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

