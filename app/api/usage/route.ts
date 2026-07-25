import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  FeatureKey,
  getFeatureLimit,
} from "@/lib/revenue/permissions";

import {
  hasFeature,
  normalizeSubscriptionType,
} from "@/lib/subscriptions/entitlements";

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
  .from("profiles")
  .select(
    `
      plan,
      subscription_type,
      subscription_status,
      entitlements,
      trial_ends_at
    `,
  )
  .eq("auth_user_id", userId)
  .maybeSingle();

if (profileError) {
  console.error("usage_profile_lookup_error", profileError);

  return NextResponse.json(
    {
      error: "Could not load subscription information.",
    },
    {
      status: 500,
    },
  );
}

const subscriptionType = normalizeSubscriptionType(
  profile?.subscription_type ?? profile?.plan,
);

const hasUnlimitedAnalysis =
  feature === "analysis" &&
  hasFeature(profile, "real_estate");

const limit = hasUnlimitedAnalysis
  ? -1
  : getFeatureLimit("free", feature);

    const startOfMonth = new Date();
startOfMonth.setUTCDate(1);
startOfMonth.setUTCHours(0, 0, 0, 0);

const { count, error: usageError } = await supabase
  .from("feature_usage")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("user_id", userId)
  .eq("feature", feature)
  .gte("created_at", startOfMonth.toISOString());

if (usageError) {
  console.error("usage_count_error", usageError);

  return NextResponse.json(
    {
      error: "Could not load feature usage.",
    },
    {
      status: 500,
    },
  );
}

    const used = count ?? 0;

const remaining =
  limit === -1
    ? -1
    : Math.max(0, limit - used);

const allowed =
  limit === -1 || used < limit;

return NextResponse.json({
  subscription_type: subscriptionType,
  feature,
  used,
  limit,
  remaining,
  allowed,
  unlimited: limit === -1,
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

