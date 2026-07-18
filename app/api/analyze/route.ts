import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";
import { canUseFeature } from "@/lib/revenue/permissions";

const HOME_DEAL_API_URL =
  process.env.HOME_DEAL_API_URL ||
  "https://home-deal-api.onrender.com";

const INTERNAL_API_KEY =
  process.env.NESTROVA_INTERNAL_API_KEY;

export async function POST(request: Request) {
  try {
    const { user, isPro } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          detail:
            "Please sign in to analyze properties.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const address = String(
      body.address || "",
    ).trim();

    const listingPrice = Number(
      body.listing_price,
    );

    if (!address) {
      return NextResponse.json(
        {
          detail:
            "Property address is required.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(listingPrice) ||
      listingPrice <= 0
    ) {
      return NextResponse.json(
        {
          detail:
            "Listing price must be greater than 0.",
        },
        { status: 400 },
      );
    }

    const admin =
      createSupabaseAdminClient();

    const plan = isPro ? "pro" : "free";

    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const {
      count: usageCount,
      error: usageCountError,
    } = await admin
      .from("feature_usage")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("feature", "analysis")
      .gte(
        "created_at",
        startOfMonth.toISOString(),
      );

    if (usageCountError) {
      console.error(
        "analysis_usage_count_error",
        usageCountError,
      );

      return NextResponse.json(
        {
          detail:
            "Could not verify analysis usage.",
        },
        { status: 500 },
      );
    }

    const used = usageCount || 0;

    const usage = canUseFeature({
      feature: "analysis",
      plan,
      used,
    });

    if (!usage.allowed) {
      return NextResponse.json(
        {
          detail:
            "You have reached your monthly analysis limit. Upgrade to Pro for more analyses.",
          usage: {
            count: used,
            limit: usage.limit,
            remaining: usage.remaining,
            is_pro: isPro,
          },
        },
        { status: 429 },
      );
    }

    await admin
      .from("analytics_events")
      .insert({
        user_id: user.id,
        event_name: "analyze_started",
        page_path: "/analyze",
        metadata: {
          address,
          plan,
          used_before_request: used,
        },
        created_at:
          new Date().toISOString(),
      });

    const response = await fetch(
      `${HOME_DEAL_API_URL}/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          ...(INTERNAL_API_KEY
            ? {
                "X-Nestrova-Internal-Key":
                  INTERNAL_API_KEY,
              }
            : {}),
        },
        body: JSON.stringify({
          address,
          listing_price:
            listingPrice,
          down_payment_percent:
            Number(
              body.down_payment_percent ||
                25,
            ),
          interest_rate:
            Number(
              body.interest_rate ||
                6.5,
            ),
          loan_term_years:
            Number(
              body.loan_term_years ||
                30,
            ),
          user_id: user.id,
          is_pro: isPro,
        }),
        cache: "no-store",
      },
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      await admin
        .from("analytics_events")
        .insert({
          user_id: user.id,
          event_name:
            "analyze_failed",
          page_path: "/analyze",
          metadata: {
            address,
            status_code:
              response.status,
          },
          created_at:
            new Date().toISOString(),
        });

      return NextResponse.json(
        data,
        {
          status: response.status,
        },
      );
    }

    const usageInsert =
      await admin
        .from("feature_usage")
        .insert({
          user_id: user.id,
          feature: "analysis",
          metadata: {
            address,
            plan,
          },
          created_at:
            new Date().toISOString(),
        });

    if (usageInsert.error) {
      console.error(
        "analysis_usage_insert_error",
        usageInsert.error,
      );

      return NextResponse.json(
        {
          detail:
            "Analysis completed, but usage could not be recorded.",
        },
        { status: 500 },
      );
    }

    const historyInsert =
      await admin
        .from("deal_history")
        .insert({
          user_id: user.id,
          address,
          listing_price:
            listingPrice,
          fair_value: Number(
            data.fair_value || 0,
          ),
          estimated_monthly_rent:
            Number(
              data.estimated_monthly_rent ||
                0,
            ),
          discount_percent:
            Number(
              data.discount_percent ||
                0,
            ),
          gross_rent_yield:
            Number(
              data.gross_rent_yield ||
                0,
            ),
          deal_score:
            Number(
              data.deal_score ||
                data.overall_score ||
                0,
            ),
          status:
            data.status ||
            "Analyzed",
          estimated_monthly_cash_flow:
            Number(
              data.estimated_monthly_cash_flow ||
                0,
            ),
          result_json: data,
          created_at:
            new Date().toISOString(),
        });

    if (historyInsert.error) {
      console.error(
        "deal_history_insert_error",
        historyInsert.error,
      );
    }

    const newCount = used + 1;

    const remaining =
      usage.limit === -1
        ? -1
        : Math.max(
            0,
            usage.limit - newCount,
          );

    await admin
      .from("analytics_events")
      .insert({
        user_id: user.id,
        event_name:
          "analyze_completed",
        page_path: "/analyze",
        metadata: {
          address,
          score:
            data.deal_score ||
            data.overall_score ||
            0,
          status:
            data.status || "",
          plan,
          usage_count: newCount,
          usage_remaining:
            remaining,
        },
        created_at:
          new Date().toISOString(),
      });

    const historyPayload = {
  user_id: user.id,
  address: data.address,
  listing_price: data.listing_price,
  fair_value: data.fair_value,
  estimated_monthly_rent: data.estimated_monthly_rent,
  discount_percent: data.discount_percent,
  gross_rent_yield: data.gross_rent_yield,
  deal_score: data.deal_score,
  overall_score: data.overall_score ?? data.deal_score ?? null,
  status: data.status,
  summary: data.summary,
  analysis: data,
};

const { error: historyError } = await admin
  .from("analysis_history")
  .insert(historyPayload);

if (historyError) {
  console.error(
    "analysis_history_insert_failed",
    historyError,
  );
}

    return NextResponse.json({
      ...data,
      server_verified_pro: isPro,
      plan,
      usage: {
        count: newCount,
        limit: usage.limit,
        remaining,
        is_pro: isPro,
      },
    });
  } catch (error) {
    console.error(
      "analyze_request_failed",
      error,
    );

    return NextResponse.json(
      {
        detail:
          "Analyze request failed.",
      },
      { status: 500 },
    );
  }
}