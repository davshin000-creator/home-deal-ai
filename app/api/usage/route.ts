import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { FeatureKey, getFeatureLimit } from "@/lib/revenue/permissions";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const feature = searchParams.get("feature") as FeatureKey;

    if (!userId || !feature) {
      return NextResponse.json(
        { error: "Missing user_id or feature." },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("is_pro")
      .eq("user_id", userId)
      .maybeSingle();

  const plan = !profileError && profile?.is_pro ? "pro" : "free";
    const limit = getFeatureLimit(plan, feature);

    const { count } = await supabase
      .from("feature_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("feature", feature);

    return NextResponse.json({
      plan,
      feature,
      used: count || 0,
      limit,
      allowed: (count || 0) < limit,
    });
  } catch (error) {
    console.error("usage GET error:", error);
    return NextResponse.json(
      { error: "Unexpected usage server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userId = body.user_id;
    const feature = body.feature;

    if (!userId || !feature) {
      return NextResponse.json(
        { error: "Missing user_id or feature." },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error } = await supabase.from("feature_usage").insert({
      user_id: userId,
      feature,
      metadata: body.metadata || {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Could not record usage." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("usage POST error:", error);
    return NextResponse.json(
      { error: "Unexpected usage record error." },
      { status: 500 }
    );
  }
}
