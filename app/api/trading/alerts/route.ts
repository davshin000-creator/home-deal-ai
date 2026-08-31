import { createServerClient } from "@supabase/ssr";
import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createSupabaseAdminClient,
} from "@/lib/supabase/server";
import {
  hasFeature,
} from "@/lib/subscriptions/entitlements";

export const dynamic = "force-dynamic";

type AlertCondition =
  | "opportunity_score"
  | "risk_change"
  | "regime_change"
  | "buy_signal";

type AssetType =
  | "crypto"
  | "stock"
  | "etf";

type CreateAlertBody = {
  symbol?: unknown;
  asset_type?: unknown;
  condition_type?: unknown;
  opportunity_threshold?: unknown;
  risk_threshold?: unknown;
  regime_threshold?: unknown;
  is_active?: unknown;
};

type AuthenticatedContext = {
  supabase: SupabaseClient<any, any, any>;
  user: User;
};

type ApiErrorBody = {
  success: false;
  error: string;
  code?: string;
};

const ALERT_RULE_SELECT = `
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
`;

function getSupabaseEnvironment() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL
      ?.trim();

  const supabaseAnonKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY
      ?.trim();

  if (
    !supabaseUrl ||
    !supabaseAnonKey
  ) {
    throw new Error(
      "Missing public Supabase environment variables.",
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

async function createCookieClient() {
  const cookieStore =
    await cookies();

  const {
    supabaseUrl,
    supabaseAnonKey,
  } = getSupabaseEnvironment();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            /*
             * Some server contexts do not
             * permit cookie writes.
             */
          }
        },
      },
    },
  );
}

function getBearerToken(
  request: NextRequest,
) {
  const authorization =
    request.headers
      .get("authorization")
      ?.trim();

  if (!authorization) {
    return "";
  }

  const match =
    authorization.match(
      /^Bearer\s+(.+)$/i,
    );

  return match?.[1]?.trim() ?? "";
}

async function getAuthenticatedContext(
  request: NextRequest,
): Promise<AuthenticatedContext | null> {
  const accessToken =
    getBearerToken(request);

  /*
   * Mobile authentication.
   */
  if (accessToken) {
    const {
      supabaseUrl,
      supabaseAnonKey,
    } = getSupabaseEnvironment();

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },

        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    );

    const {
      data: { user },
      error,
    } =
      await supabase.auth.getUser(
        accessToken,
      );

    if (error || !user) {
      console.error(
        "trading_alert_mobile_auth_error",
        error,
      );

      return null;
    }

    return {
      supabase:
        supabase as SupabaseClient<
          any,
          any,
          any
        >,
      user,
    };
  }

  /*
   * Web cookie authentication.
   */
  const supabase =
    await createCookieClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    supabase:
      supabase as SupabaseClient<
        any,
        any,
        any
      >,
    user,
  };
}

function jsonError(
  error: string,
  status: number,
  code?: string,
) {
  const body: ApiErrorBody = {
    success: false,
    error,
    ...(code ? { code } : {}),
  };

  return NextResponse.json(
    body,
    { status },
  );
}

function normalizeSymbol(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .toUpperCase();
}

function normalizeAssetType(
  value: unknown,
): AssetType {
  if (
    typeof value !== "string"
  ) {
    return "crypto";
  }

  const normalizedValue =
    value.trim().toLowerCase();

  if (
    normalizedValue === "stock"
  ) {
    return "stock";
  }

  if (
    normalizedValue === "etf"
  ) {
    return "etf";
  }

  return "crypto";
}

function normalizeCondition(
  value: unknown,
): AlertCondition | null {
  if (
    value ===
      "opportunity_score" ||
    value === "risk_change" ||
    value === "regime_change" ||
    value === "buy_signal"
  ) {
    return value;
  }

  return null;
}

function normalizeScoreThreshold(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numericValue =
    Number(value);

  if (
    !Number.isInteger(
      numericValue,
    ) ||
    numericValue < 1 ||
    numericValue > 100
  ) {
    return null;
  }

  return numericValue;
}

function normalizeRiskThreshold(
  value: unknown,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalizedValue =
    value.trim().toUpperCase();

  if (
    normalizedValue === "LOW" ||
    normalizedValue === "MEDIUM" ||
    normalizedValue === "HIGH"
  ) {
    return normalizedValue;
  }

  return null;
}

function normalizeRegimeThreshold(
  value: unknown,
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalizedValue =
    value.trim();

  return normalizedValue.length > 0
    ? normalizedValue
    : null;
}

function getBoolean(
  value: unknown,
  fallback: boolean,
): boolean {
  return typeof value === "boolean"
    ? value
    : fallback;
}

async function getUserProfile(
  userId: string,
) {
  const admin =
    createSupabaseAdminClient();

  const {
    data,
    error,
  } = await admin
    .from("profiles")
    .select(
      `
        auth_user_id,
        is_pro,
        plan,
        subscription_type,
        subscription_status,
        entitlements,
        trial_ends_at
      `,
    )
    .eq(
      "auth_user_id",
      userId,
    )
    .maybeSingle();

  if (error) {
    console.error(
      "trading_alert_profile_lookup_error",
      error,
    );

    throw new Error(
      "Unable to load the subscription profile.",
    );
  }

  return data;
}

/**
 * GET /api/trading/alerts
 *
 * Optional query:
 * ?symbol=BTC
 *
 * Supports:
 * - Web Supabase cookies
 * - Mobile Bearer access token
 */
export async function GET(
  request: NextRequest,
) {
  try {
    const authentication =
      await getAuthenticatedContext(
        request,
      );

    if (!authentication) {
      return jsonError(
        "You must be signed in to view alerts.",
        401,
      );
    }

    const {
      supabase,
      user,
    } = authentication;

    const symbolFilter =
      normalizeSymbol(
        request.nextUrl
          .searchParams
          .get("symbol"),
      );

    let query = supabase
      .from(
        "trading_alert_rules",
      )
      .select(
        ALERT_RULE_SELECT,
      )
      .eq(
        "user_id",
        user.id,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

    if (symbolFilter) {
      query = query.eq(
        "symbol",
        symbolFilter,
      );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      console.error(
        "trading_alerts_get_database_error",
        error,
      );

      return jsonError(
        "Unable to load trading alerts.",
        500,
      );
    }

    return NextResponse.json(
      {
        success: true,
        alerts: data ?? [],
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "trading_alerts_get_unexpected_error",
      error,
    );

    return jsonError(
      "An unexpected error occurred while loading alerts.",
      500,
    );
  }
}
/**
 * POST /api/trading/alerts
 *
 * Creates or updates one trading alert rule.
 *
 * Supports:
 * - Web Supabase cookies
 * - Mobile Bearer access token
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const authentication =
      await getAuthenticatedContext(
        request,
      );

    if (!authentication) {
      return jsonError(
        "You must be signed in to create an alert.",
        401,
      );
    }

    const {
      supabase,
      user,
    } = authentication;

    const profile =
      await getUserProfile(
        user.id,
      );

    const canCreateTradingAlerts =
      hasFeature(
        profile,
        "trading",
      );

    if (
      !canCreateTradingAlerts
    ) {
      return jsonError(
        "Radar Pro or Nestrova AI Pro is required to create custom trading alerts.",
        403,
        "TRADING_SUBSCRIPTION_REQUIRED",
      );
    }

    let body: CreateAlertBody;

    try {
      body =
        (await request.json()) as CreateAlertBody;
    } catch {
      return jsonError(
        "The request body must contain valid JSON.",
        400,
      );
    }

    const symbol =
      normalizeSymbol(
        body.symbol,
      );

    const assetType =
      normalizeAssetType(
        body.asset_type,
      );

    const conditionType =
      normalizeCondition(
        body.condition_type,
      );

    const opportunityThreshold =
      normalizeScoreThreshold(
        body.opportunity_threshold,
      );

    const riskThreshold =
      normalizeRiskThreshold(
        body.risk_threshold,
      );

    const regimeThreshold =
      normalizeRegimeThreshold(
        body.regime_threshold,
      );

    const isActive =
      getBoolean(
        body.is_active,
        true,
      );

    if (!symbol) {
      return jsonError(
        "A valid asset symbol is required.",
        400,
      );
    }

    if (!conditionType) {
      return jsonError(
        "A valid alert condition is required.",
        400,
      );
    }

    if (
      conditionType ===
        "opportunity_score" &&
      opportunityThreshold === null
    ) {
      return jsonError(
        "Opportunity-score alerts require a threshold from 1 to 100.",
        400,
      );
    }

    if (
      conditionType ===
        "risk_change" &&
      riskThreshold === null
    ) {
      return jsonError(
        "Risk-change alerts require LOW, MEDIUM, or HIGH.",
        400,
      );
    }

    if (
      conditionType ===
        "regime_change" &&
      regimeThreshold === null
    ) {
      return jsonError(
        "Regime-change alerts require a target market regime.",
        400,
      );
    }

    const {
      data: watchlistItem,
      error: watchlistError,
    } = await supabase
      .from(
        "trading_watchlist",
      )
      .select("id")
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "symbol",
        symbol,
      )
      .eq(
        "asset_type",
        assetType,
      )
      .maybeSingle();

    if (watchlistError) {
      console.error(
        "trading_alert_watchlist_lookup_error",
        watchlistError,
      );

      return jsonError(
        "Unable to verify the related Watchlist item.",
        500,
      );
    }

    const alertRule = {
      user_id: user.id,
      watchlist_id:
        watchlistItem?.id ?? null,
      symbol,
      asset_type: assetType,
      condition_type:
        conditionType,

      opportunity_threshold:
        conditionType ===
        "opportunity_score"
          ? opportunityThreshold
          : null,

      risk_threshold:
        conditionType ===
        "risk_change"
          ? riskThreshold
          : null,

      regime_threshold:
        conditionType ===
        "regime_change"
          ? regimeThreshold
          : null,

      is_active: isActive,
      updated_at:
        new Date().toISOString(),
    };

    const {
      data,
      error,
    } = await supabase
      .from(
        "trading_alert_rules",
      )
      .upsert(
        alertRule,
        {
          onConflict:
            "user_id,symbol,asset_type,condition_type",
        },
      )
      .select(
        ALERT_RULE_SELECT,
      )
      .single();

    if (error) {
      console.error(
        "trading_alerts_post_database_error",
        error,
      );

      return jsonError(
        "Unable to save this trading alert.",
        500,
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
    console.error(
      "trading_alerts_post_unexpected_error",
      error,
    );

    return jsonError(
      "An unexpected error occurred while saving the alert.",
      500,
    );
  }
}

/**
 * DELETE /api/trading/alerts?id=<alert-id>
 *
 * Deletes one alert rule owned by the signed-in user.
 *
 * Supports:
 * - Web Supabase cookies
 * - Mobile Bearer access token
 */
export async function DELETE(
  request: NextRequest,
) {
  try {
    const authentication =
      await getAuthenticatedContext(
        request,
      );

    if (!authentication) {
      return jsonError(
        "You must be signed in to delete an alert.",
        401,
      );
    }

    const {
      supabase,
      user,
    } = authentication;

    const alertId =
      request.nextUrl
        .searchParams
        .get("id")
        ?.trim() ?? "";

    if (!alertId) {
      return jsonError(
        "An alert ID is required.",
        400,
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from(
        "trading_alert_rules",
      )
      .delete()
      .eq(
        "id",
        alertId,
      )
      .eq(
        "user_id",
        user.id,
      )
      .select("id")
      .maybeSingle();

    if (error) {
      console.error(
        "trading_alerts_delete_database_error",
        error,
      );

      return jsonError(
        "Unable to delete this alert.",
        500,
      );
    }

    if (!data) {
      return jsonError(
        "The requested alert was not found.",
        404,
      );
    }

    return NextResponse.json(
      {
        success: true,
        deleted_id: data.id,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "trading_alerts_delete_unexpected_error",
      error,
    );

    return jsonError(
      "An unexpected error occurred while deleting the alert.",
      500,
    );
  }
}