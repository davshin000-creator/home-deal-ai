import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();
    const body = await request.json();

    const feedback = String(body.feedback || "").trim();
    const email = String(body.email || user?.email || "").trim();

    if (!feedback) {
      return NextResponse.json({ error: "Feedback is required." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    await admin.from("beta_feedback").insert({
      user_id: user?.id || null,
      email,
      source: body.source || "beta_page",
      feedback,
      rating: Number(body.rating || 0),
      metadata: body.metadata || {},
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }
}

