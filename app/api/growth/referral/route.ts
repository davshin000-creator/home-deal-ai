import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { user } = await getCurrentUserProfile();
  const body = await request.json();
  const admin = createSupabaseAdminClient();

  await admin.from("acquisition_events").insert({
    user_id: user?.id || null,
    source: body.source || body.utm_source || "direct",
    campaign: body.campaign || body.utm_campaign || "",
    referral_code: body.referral_code || "",
    landing_path: body.landing_path || "",
    metadata: body.metadata || {},
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const { isPro } = await getCurrentUserProfile();
  if (!isPro) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("acquisition_events").select("source,campaign,referral_code,created_at").order("created_at", { ascending: false }).limit(2000);
  if (error) return NextResponse.json({ error: "Could not load acquisition events." }, { status: 500 });

  const counts: Record<string, number> = {};
  for (const row of data || []) counts[row.source || "direct"] = (counts[row.source || "direct"] || 0) + 1;

  return NextResponse.json({ events: data || [], top_sources: Object.entries(counts).map(([source,count]) => ({ source, count })).sort((a,b) => b.count - a.count) });
}

