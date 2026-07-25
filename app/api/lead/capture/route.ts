import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

// POST /api/lead/capture
// Called when a guest enters their email to unlock the full
// (blurred) analysis result on the client.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const address = String(body.address || "").trim();
    const listingPrice = Number(body.listing_price || 0);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();

    const { error } = await admin.from("guest_leads").insert({
      email,
      address: address || null,
      listing_price: listingPrice || null,
      source: "guest_analysis_unlock",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("guest_lead_insert_error", error);
      return NextResponse.json(
        { error: "Could not save your email." },
        { status: 500 },
      );
    }

    await admin.from("analytics_events").insert({
      user_id: null,
      event_name: "guest_lead_captured",
      page_path: "/analyze",
      metadata: { email, address },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("lead_capture_failed", error);
    return NextResponse.json(
      { error: "Lead capture request failed." },
      { status: 500 },
    );
  }
}
