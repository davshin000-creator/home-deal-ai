import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

// V9F7A: Read a previous analysis without consuming analysis usage.
export async function GET(request: Request) {
  try {
    const { user } = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in." },
        { status: 401, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const url = new URL(request.url);
    const address = (url.searchParams.get("address") ?? "").trim();

    if (!address || address.length > 500) {
      return NextResponse.json(
        { error: "A valid address is required." },
        { status: 400, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    const admin = createSupabaseAdminClient();

    // Only the current user's previous reports may be read.
    const history = await admin
      .from("analysis_history")
      .select("analysis, created_at")
      .eq("user_id", user.id)
      .eq("address", address)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const saved = history.data?.analysis;

    if (
      saved &&
      typeof saved === "object" &&
      !Array.isArray(saved) &&
      typeof saved.address === "string" &&
      typeof saved.fair_value === "number"
    ) {
      return NextResponse.json(
        {
          analysis: saved,
          source: "analysis_history",
          saved_at: history.data?.created_at ?? null,
        },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    // Older analyses may have been written to deal_history instead.
    const deal = await admin
      .from("deal_history")
      .select("result_json, created_at")
      .eq("user_id", user.id)
      .eq("address", address)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const older = deal.data?.result_json;

    if (
      older &&
      typeof older === "object" &&
      !Array.isArray(older) &&
      typeof older.address === "string" &&
      typeof older.fair_value === "number"
    ) {
      return NextResponse.json(
        {
          analysis: older,
          source: "deal_history",
          saved_at: deal.data?.created_at ?? null,
        },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    return NextResponse.json(
      {
        code: "NO_SAVED_ANALYSIS",
        error: "No previous detailed analysis was found for this address.",
      },
      { status: 404, headers: { "Cache-Control": "private, no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Saved analysis could not be loaded." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}