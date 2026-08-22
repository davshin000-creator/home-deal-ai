import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";
import { canUseFeature } from "@/lib/revenue/permissions";
import { getRealEstateCountryConfig } from "@/lib/real-estate/global/country-config";
import {
  getRealEstateDataProvider,
  resolveRealEstateProvider,
} from "@/lib/real-estate/global/provider-router";
import {
  RealEstateProviderError,
} from "@/lib/real-estate/global/provider-types";
import {
  hasFeature,
  normalizeSubscriptionType,
} from "@/lib/subscriptions/entitlements";

// Guests get 1 free analysis per IP per rolling 24h window.
// Change this if you want a different guest allowance.
const GUEST_FREE_LIMIT = 1;
const GUEST_WINDOW_HOURS = 24;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const {
  user,
  profile,
} = await getCurrentUserProfile();
    const admin = createSupabaseAdminClient();

    const body = await request.json();

    const address = String(body.address || "").trim();
    const listingPrice = Number(body.listing_price);
    const requestedCountry = String(
      body.country || "US",
    ).toUpperCase();

    if (
      requestedCountry !== "US" &&
      requestedCountry !== "CA" &&
      requestedCountry !== "KR"
    ) {
      return NextResponse.json(
        {
          code: "INVALID_REAL_ESTATE_COUNTRY",
          detail: "Unsupported real estate country.",
        },
        { status: 400 },
      );
    }

    const countryConfig =
      getRealEstateCountryConfig(
        requestedCountry,
      );

    const providerResolution =
      resolveRealEstateProvider(
        countryConfig.code,
      );

    if (!providerResolution.available) {
      return NextResponse.json(
        {
          code: "COUNTRY_NOT_AVAILABLE",
          detail: `${countryConfig.name} property analysis is not available yet.`,
          country: countryConfig.code,
        },
        { status: 400 },
      );
    }

    const country = countryConfig.code;
    const provider =
      providerResolution.provider;

    const dataProvider =
      getRealEstateDataProvider(country);

    if (!dataProvider) {
      return NextResponse.json(
        {
          code: "COUNTRY_NOT_AVAILABLE",
          detail: `${countryConfig.name} property analysis is not available yet.`,
          country,
        },
        { status: 400 },
      );
    }

    if (!address) {
      return NextResponse.json(
        { detail: "Property address is required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(listingPrice) || listingPrice <= 0) {
      return NextResponse.json(
        { detail: "Listing price must be greater than 0." },
        { status: 400 },
      );
    }

    // ----- GUEST FLOW (no signed-in user) -----
    if (!user) {
      const ip = getClientIp(request);

      const windowStart = new Date(
        Date.now() - GUEST_WINDOW_HOURS * 60 * 60 * 1000,
      );

      const { count: guestCount, error: guestCountError } = await admin
        .from("guest_usage")
        .select("*", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", windowStart.toISOString());

      if (guestCountError) {
        console.error("guest_usage_count_error", guestCountError);
        return NextResponse.json(
          { detail: "Could not verify guest usage." },
          { status: 500 },
        );
      }

      const guestUsed = guestCount || 0;

      if (guestUsed >= GUEST_FREE_LIMIT) {
        return NextResponse.json(
          {
            detail:
              "You've used your free preview analysis. Sign up free to keep analyzing properties.",
            requires_signup: true,
          },
          { status: 429 },
        );
      }

      let data: Record<string, any>;

      try {
        const providerResult =
          await dataProvider.analyze({
            address,
            countryCode: country,
            listingPrice,

            financing: {
              downPaymentPercent:
                Number(
                  body.down_payment_percent || 25,
                ),

              interestRate:
                Number(
                  body.interest_rate || 6.5,
                ),

              loanTermYears:
                Number(
                  body.loan_term_years || 30,
                ),
            },

            requestContext: {
              userId: null,
              isPro: false,
            },
          });

        data =
          (providerResult.raw ?? {}) as Record<
            string,
            any
          >;
      } catch (providerError) {
        if (
          providerError instanceof
          RealEstateProviderError
        ) {
          return NextResponse.json(
            providerError.data,
            {
              status:
                providerError.status,
            },
          );
        }

        throw providerError;
      }
      // Record guest usage for rate limiting (no user_id, so it
      // never touches feature_usage / deal_history / analysis_history).
      const { error: guestInsertError } = await admin
        .from("guest_usage")
        .insert({
          ip,
          address,
          created_at: new Date().toISOString(),
        });

      if (guestInsertError) {
        console.error("guest_usage_insert_error", guestInsertError);
      }

      await admin.from("analytics_events").insert({
        user_id: null,
        event_name: "guest_analyze_completed",
        page_path: "/analyze",
        metadata: { address, ip, country, provider },
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({
        ...data,
        is_guest: true,
        server_verified_pro: false,
        plan: "guest",
        usage: {
          count: guestUsed + 1,
          limit: GUEST_FREE_LIMIT,
          remaining: Math.max(0, GUEST_FREE_LIMIT - (guestUsed + 1)),
          is_pro: false,
        },
      });
    }

    // ----- SIGNED-IN FLOW (unchanged from before) -----
    const subscriptionType =
  normalizeSubscriptionType(
    profile?.subscription_type ??
      profile?.plan,
  );

const hasUnlimitedAnalysis =
  hasFeature(
    profile,
    "real_estate",
  );

    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const { count: usageCount, error: usageCountError } = await admin
      .from("feature_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("feature", "analysis")
      .gte("created_at", startOfMonth.toISOString());

    if (usageCountError) {
      console.error("analysis_usage_count_error", usageCountError);
      return NextResponse.json(
        { detail: "Could not verify analysis usage." },
        { status: 500 },
      );
    }

    const used = usageCount || 0;

    const usage =
  hasUnlimitedAnalysis
    ? {
        allowed: true,
        limit: -1,
        remaining: -1,
      }
    : canUseFeature({
        feature: "analysis",
        plan: "free",
        used,
      });

    if (!usage.allowed) {
  return NextResponse.json(
    {
      success: false,
      code: "PROPERTY_ANALYSIS_LIMIT_REACHED",
      detail:
        "You have used all 5 free property analyses for this month.",
      error:
        "Real Estate Pro or Nestrova AI Pro is required for unlimited property analysis.",
      usage: {
        count: used,
        limit: usage.limit,
        remaining: usage.remaining,
        is_pro: hasUnlimitedAnalysis,
      },
    },
    { status: 429 },
  );
}

    await admin.from("analytics_events").insert({
      user_id: user.id,
      event_name: "analyze_started",
      page_path: "/analyze",
      metadata: {
  address,
  subscription_type: subscriptionType,
  used_before_request: used,
},
      created_at: new Date().toISOString(),
    });

    let data: Record<string, any>;

    try {
      const providerResult =
        await dataProvider.analyze({
          address,
          countryCode: country,
          listingPrice,

          financing: {
            downPaymentPercent:
              Number(
                body.down_payment_percent || 25,
              ),

            interestRate:
              Number(
                body.interest_rate || 6.5,
              ),

            loanTermYears:
              Number(
                body.loan_term_years || 30,
              ),
          },

          requestContext: {
            userId: user.id,
            isPro: hasUnlimitedAnalysis,
          },
        });

      data =
        (providerResult.raw ?? {}) as Record<
          string,
          any
        >;
    } catch (providerError) {
      if (
        providerError instanceof
        RealEstateProviderError
      ) {
        await admin
          .from("analytics_events")
          .insert({
            user_id: user.id,
            event_name: "analyze_failed",
            page_path: "/analyze",
            metadata: {
              address,
              country,
              provider,
              status_code:
                providerError.status,
            },
            created_at:
              new Date().toISOString(),
          });

        return NextResponse.json(
          providerError.data,
          {
            status:
              providerError.status,
          },
        );
      }

      throw providerError;
    }

    const usageInsert = await admin.from("feature_usage").insert({
      user_id: user.id,
      feature: "analysis",
      metadata: {
  address,
  subscription_type: subscriptionType,
},
      created_at: new Date().toISOString(),
    });

    if (usageInsert.error) {
      console.error("analysis_usage_insert_error", usageInsert.error);
      return NextResponse.json(
        { detail: "Analysis completed, but usage could not be recorded." },
        { status: 500 },
      );
    }

    const historyInsert = await admin.from("deal_history").insert({
      user_id: user.id,
      address,
      listing_price: listingPrice,
      fair_value: Number(data.fair_value || 0),
      estimated_monthly_rent: Number(data.estimated_monthly_rent || 0),
      discount_percent: Number(data.discount_percent || 0),
      gross_rent_yield: Number(data.gross_rent_yield || 0),
      deal_score: Number(data.deal_score || data.overall_score || 0),
      status: data.status || "Analyzed",
      estimated_monthly_cash_flow: Number(
        data.estimated_monthly_cash_flow || 0,
      ),
      result_json: {
        ...data,
        country,
      },
      created_at: new Date().toISOString(),
    });

    if (historyInsert.error) {
      console.error("deal_history_insert_error", historyInsert.error);
    }

    const newCount = used + 1;

    const remaining =
      usage.limit === -1 ? -1 : Math.max(0, usage.limit - newCount);

    await admin.from("analytics_events").insert({
      user_id: user.id,
      event_name: "analyze_completed",
      page_path: "/analyze",
      metadata: {
        address,
        score: data.deal_score || data.overall_score || 0,
        status: data.status || "",
        subscription_type: subscriptionType,
        usage_count: newCount,
        usage_remaining: remaining,
      },
      created_at: new Date().toISOString(),
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
      console.error("analysis_history_insert_failed", historyError);
    }

    return NextResponse.json({
      ...data,
      server_verified_pro:
  hasUnlimitedAnalysis,
      subscription_type: subscriptionType,
      usage: {
        count: newCount,
        limit: usage.limit,
        remaining,
        is_pro:
  hasUnlimitedAnalysis,
      },
    });
  } catch (error) {
    console.error("analyze_request_failed", error);
    return NextResponse.json(
      { detail: "Analyze request failed." },
      { status: 500 },
    );
  }
}


