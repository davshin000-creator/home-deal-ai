import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();
    const body = await request.json();
    const eventName = String(body.event_name || "").trim();

    if (!eventName) {
      return NextResponse.json({ error: "event_name is required." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    await admin.from("analytics_events").insert({
      user_id: user?.id || null,
      event_name: eventName,
      page_path: body.page_path || "",
      metadata: body.metadata || {},
      user_agent: request.headers.get("user-agent") || "",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not record analytics event." }, { status: 500 });
  }
}

