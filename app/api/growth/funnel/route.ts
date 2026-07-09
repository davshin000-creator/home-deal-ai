import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function GET() {
  const { isPro } = await getCurrentUserProfile();
  if (!isPro) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const admin = createSupabaseAdminClient();
  const events = ["landing_viewed","signup_started","login_completed","analyze_started","analyze_completed","report_generated","portfolio_saved","pricing_viewed","checkout_started","checkout_completed"];
  const { data, error } = await admin.from("analytics_events").select("event_name,created_at,metadata").in("event_name", events).order("created_at", { ascending: false }).limit(5000);
  if (error) return NextResponse.json({ error: "Could not load funnel." }, { status: 500 });

  const first = (data || []).filter((x) => x.event_name === events[0]).length || 0;
  const funnel = events.map((event_name) => {
    const count = (data || []).filter((x) => x.event_name === event_name).length;
    return { event_name, count, conversion_from_landing: first ? Number(((count / first) * 100).toFixed(1)) : 0 };
  });

  return NextResponse.json({ funnel, recent_events: data || [] });
}

