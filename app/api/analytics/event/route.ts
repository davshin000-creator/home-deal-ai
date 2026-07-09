import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();
    const body = await request.json();
    const eventName = String(body.event_name || "").trim();

    if (!eventName) {
      return NextResponse.json({ ok: false, error: "event_name is required." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    const { error } = await admin.from("analytics_events").insert({
      user_id: user?.id || null,
      event_name: eventName,
      page_path: body.page_path || "",
      metadata: body.metadata || {},
      user_agent: request.headers.get("user-agent") || "",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("analytics_event_insert_error", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("analytics_event_unhandled_error", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not record analytics event.",
      },
      { status: 500 },
    );
  }
}