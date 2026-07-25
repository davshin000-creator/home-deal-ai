import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  hasFeature,
} from "@/lib/subscriptions/entitlements";

type AlertCondition =
  | "opportunity_score"
  | "risk_change"
  | "regime_change"
  | "buy_signal";

type AssetType = "crypto" | "stock" | "etf";

type CreateAlertBody = {
  symbol?: unknown;
  asset_type?: unknown;
  condition_type?: unknown;
  opportunity_threshold?: unknown;
  risk_threshold?: unknown;
  regime_threshold?: unknown;
  is_active?: unknown;
};

function normalizeSymbol(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

function normalizeAssetType(value: unknown): AssetType {
  if (typeof value !== "string") {
    return "crypto";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "stock") {
    return "stock";
  }

  if (normalizedValue === "etf") {
    return "etf";
  }

  return "crypto";
}

function normalizeCondition(value: unknown): AlertCondition | null {
  if (
    value === "opportunity_score" ||
    value === "risk_change" ||
    value === "regime_change" ||
    value === "buy_signal"
  ) {
    return value;
  }

  return null;
}

function normalizeScoreThreshold(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  if (
    !Number.isInteger(numericValue) ||
    numericValue < 1 ||
    numericValue > 100
  ) {
    return null;
  }

  return numericValue;
}

function normalizeRiskThreshold(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toUpperCase();

  if (
    normalizedValue === "LOW" ||
    normalizedValue === "MEDIUM" ||
    normalizedValue === "HIGH"
  ) {
    return normalizedValue;
  }

  return null;
}

function normalizeRegimeThreshold(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function getBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in to view alerts.",
        },
        {
          status: 401,
        },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const symbolFilter = normalizeSymbol(searchParams.get("symbol"));

    let query = supabase
      .from("trading_alert_rules")
      .select(
        `
          id,
          user_id,
          watchlist_id,
          symbol,
          asset_type,
          condition_type,
          opportunity_threshold,
          risk_threshold,
          regime_threshold,
          is_active,
          last_triggered_at,
          created_at,
          updated_at
        `,
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (symbolFilter) {
      query = query.eq("symbol", symbolFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Trading alerts GET database error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load trading alerts.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      alerts: data ?? [],
    });
  } catch (error) {
    console.error("Trading alerts GET unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while loading alerts.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in to create an alert.",
        },
        {
          status: 401,
        },
      );
    }

const {
  profile,
} = await getCurrentUserProfile();

const canCreateTradingAlerts = hasFeature(
  profile,
  "trading",
);

if (!canCreateTradingAlerts) {
  return NextResponse.json(
    {
      success: false,
      code: "TRADING_SUBSCRIPTION_REQUIRED",
      error:
        "Trading Pro or Nestrova AI Pro is required to create custom trading alerts.",
    },
    {
      status: 403,
    },
  );
}

    let body: CreateAlertBody;

    try {
      body = (await request.json()) as CreateAlertBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "The request body must contain valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    const symbol = normalizeSymbol(body.symbol);
    const assetType = normalizeAssetType(body.asset_type);
    const conditionType = normalizeCondition(body.condition_type);

    const opportunityThreshold = normalizeScoreThreshold(
      body.opportunity_threshold,
    );

    const riskThreshold = normalizeRiskThreshold(body.risk_threshold);

    const regimeThreshold = normalizeRegimeThreshold(
      body.regime_threshold,
    );

    const isActive = getBoolean(body.is_active, true);

    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid asset symbol is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!conditionType) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid alert condition is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      conditionType === "opportunity_score" &&
      opportunityThreshold === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Opportunity-score alerts require a threshold from 1 to 100.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      conditionType === "risk_change" &&
      riskThreshold === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Risk-change alerts require LOW, MEDIUM, or HIGH.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: watchlistItem, error: watchlistError } =
      await supabase
        .from("trading_watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("symbol", symbol)
        .eq("asset_type", assetType)
        .maybeSingle();

    if (watchlistError) {
      console.error(
        "Trading alert watchlist lookup error:",
        watchlistError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to verify the related watchlist item.",
        },
        {
          status: 500,
        },
      );
    }

    const alertRule = {
      user_id: user.id,
      watchlist_id: watchlistItem?.id ?? null,
      symbol,
      asset_type: assetType,
      condition_type: conditionType,

      opportunity_threshold:
        conditionType === "opportunity_score"
          ? opportunityThreshold
          : null,

      risk_threshold:
        conditionType === "risk_change"
          ? riskThreshold
          : null,

      regime_threshold:
        conditionType === "regime_change"
          ? regimeThreshold
          : null,

      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("trading_alert_rules")
      .upsert(alertRule, {
        onConflict: "user_id,symbol,asset_type,condition_type",
      })
      .select(
        `
          id,
          user_id,
          watchlist_id,
          symbol,
          asset_type,
          condition_type,
          opportunity_threshold,
          risk_threshold,
          regime_threshold,
          is_active,
          last_triggered_at,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      console.error("Trading alerts POST database error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to save this trading alert.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        alert: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Trading alerts POST unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while saving the alert.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in to delete an alert.",
        },
        {
          status: 401,
        },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const alertId = searchParams.get("id")?.trim() ?? "";

    if (!alertId) {
      return NextResponse.json(
        {
          success: false,
          error: "An alert ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const { data, error } = await supabase
      .from("trading_alert_rules")
      .delete()
      .eq("id", alertId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Trading alerts DELETE database error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete this alert.",
        },
        {
          status: 500,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "The requested alert was not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      deleted_id: data.id,
    });
  } catch (error) {
    console.error("Trading alerts DELETE unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while deleting the alert.",
      },
      {
        status: 500,
      },
    );
  }
}
