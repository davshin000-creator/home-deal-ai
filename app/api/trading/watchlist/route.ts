import { createServerClient } from "@supabase/ssr";
import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { hasFeature } from "@/lib/subscriptions/entitlements";

export const dynamic = "force-dynamic";

type AssetType =
  | "stock"
  | "crypto"
  | "etf"
  | "index"
  | "forex";

type WatchlistRequestBody = {
  symbol?: unknown;
  assetName?: unknown;
  assetType?: unknown;
  opportunityScore?: unknown;
  risk?: unknown;
  regime?: unknown;
  notes?: unknown;
};

type AuthenticatedClientResult = {
  supabase: SupabaseClient<any, any, any>;
  user: User;
};

const ALLOWED_ASSET_TYPES: AssetType[] = [
  "stock",
  "crypto",
  "etf",
  "index",
  "forex",
];

function getSupabaseEnvironment() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing public Supabase environment variables.",
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

async function createCookieSupabaseClient() {
  const cookieStore = await cookies();

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
              ({ name, value, options }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            /*
             * Some Server Component contexts do not allow
             * cookie writes. Route handlers normally do.
             */
          }
        },
      },
    },
  );
}

function getBearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization")?.trim();

  if (!authorization) {
    return "";
  }

  const match = authorization.match(
    /^Bearer\s+(.+)$/i,
  );

  return match?.[1]?.trim() ?? "";
}

async function getAuthenticatedClient(
  request: NextRequest,
): Promise<AuthenticatedClientResult | null> {
  const accessToken = getBearerToken(request);

  /*
   * Mobile authentication:
   * Authorization: Bearer <Supabase access token>
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
            Authorization: `Bearer ${accessToken}`,
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
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error(
        "watchlist_mobile_auth_error",
        error,
      );

      return null;
    }

    return {
      supabase,
      user,
    };
  }

  /*
   * Web authentication:
   * Supabase cookies from the browser.
   */
  const supabase =
    await createCookieSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    supabase,
    user,
  };
}

function jsonError(
  message: string,
  status: number,
  code?: string,
) {
  return NextResponse.json(
    {
      success: false,
      ...(code ? { code } : {}),
      error: message,
    },
    { status },
  );
}

function normalizeSymbol(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

function optionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function optionalNumber(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function normalizeAssetType(
  value: unknown,
): AssetType {
  if (
    typeof value === "string" &&
    ALLOWED_ASSET_TYPES.includes(
      value.toLowerCase() as AssetType,
    )
  ) {
    return value.toLowerCase() as AssetType;
  }

  return "stock";
}

async function getUserProfile(userId: string) {
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
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
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "watchlist_profile_lookup_error",
      error,
    );

    throw new Error(
      "Unable to load the user's subscription profile.",
    );
  }

  return data;
}

/**
 * GET /api/trading/watchlist
 *
 * Supports:
 * - Web Supabase cookie authentication
 * - Mobile Authorization Bearer authentication
 */
export async function GET(
  request: NextRequest,
) {
  try {
    const authentication =
      await getAuthenticatedClient(request);

    if (!authentication) {
      return jsonError(
        "Authentication required.",
        401,
      );
    }

    const { supabase, user } =
      authentication;

    const { data, error } = await supabase
      .from("trading_watchlist")
      .select(
        `
          id,
          symbol,
          asset_name,
          asset_type,
          opportunity_score,
          risk,
          regime,
          notes,
          is_active,
          created_at,
          updated_at
        `,
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Watchlist GET error:",
        error,
      );

      return jsonError(
        "Unable to load the watchlist.",
        500,
      );
    }

    return NextResponse.json(
      {
        success: true,
        watchlist: data ?? [],
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
      "Watchlist GET unexpected error:",
      error,
    );

    return jsonError(
      "Watchlist service is temporarily unavailable.",
      500,
    );
  }
}

/**
 * POST /api/trading/watchlist
 *
 * Adds or restores an asset.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const authentication =
      await getAuthenticatedClient(request);

    if (!authentication) {
      return jsonError(
        "Authentication required.",
        401,
      );
    }

    const { supabase, user } =
      authentication;

    let body: WatchlistRequestBody;

    try {
      body =
        (await request.json()) as WatchlistRequestBody;
    } catch {
      return jsonError(
        "Invalid JSON request body.",
        400,
      );
    }

    const symbol = normalizeSymbol(
      body.symbol,
    );

    if (!symbol) {
      return jsonError(
        "A valid symbol is required.",
        400,
      );
    }

    if (symbol.length > 30) {
      return jsonError(
        "The symbol is too long.",
        400,
      );
    }

    const assetType = normalizeAssetType(
      body.assetType,
    );

    const opportunityScore =
      optionalNumber(
        body.opportunityScore,
      );

    if (
      opportunityScore !== null &&
      (opportunityScore < 0 ||
        opportunityScore > 100)
    ) {
      return jsonError(
        "Opportunity score must be between 0 and 100.",
        400,
      );
    }

    const profile =
      await getUserProfile(user.id);

    const hasUnlimitedWatchlist =
      hasFeature(profile, "trading");

    if (!hasUnlimitedWatchlist) {
      const admin =
        createSupabaseAdminClient();

      const {
        count,
        error: countError,
      } = await admin
        .from("trading_watchlist")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (countError) {
        console.error(
          "watchlist_count_error",
          countError,
        );

        return jsonError(
          "Unable to verify watchlist usage.",
          500,
        );
      }

      const {
        data: existing,
        error: existingError,
      } = await admin
        .from("trading_watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("symbol", symbol)
        .eq("asset_type", assetType)
        .maybeSingle();

      if (existingError) {
        console.error(
          "watchlist_existing_lookup_error",
          existingError,
        );

        return jsonError(
          "Unable to verify the existing watchlist item.",
          500,
        );
      }

      if (
        !existing &&
        (count ?? 0) >= 5
      ) {
        return jsonError(
          "Free accounts can save up to 5 watchlist assets.",
          403,
          "WATCHLIST_LIMIT_REACHED",
        );
      }
    }

    const watchlistItem = {
      user_id: user.id,
      symbol,
      asset_name: optionalText(
        body.assetName,
      ),
      asset_type: assetType,
      opportunity_score:
        opportunityScore,
      risk: optionalText(body.risk),
      regime: optionalText(
        body.regime,
      ),
      notes: optionalText(
        body.notes,
      ),
      is_active: true,
    };

    const { data, error } =
      await supabase
        .from("trading_watchlist")
        .upsert(watchlistItem, {
          onConflict:
            "user_id,symbol,asset_type",
        })
        .select(
          `
            id,
            symbol,
            asset_name,
            asset_type,
            opportunity_score,
            risk,
            regime,
            notes,
            is_active,
            created_at,
            updated_at
          `,
        )
        .single();

    if (error) {
      console.error(
        "Watchlist POST error:",
        error,
      );

      return jsonError(
        "Unable to add the asset to the watchlist.",
        500,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${symbol} was added to your watchlist.`,
        item: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Watchlist POST unexpected error:",
      error,
    );

    return jsonError(
      "Watchlist service is temporarily unavailable.",
      500,
    );
  }
}

/**
 * DELETE /api/trading/watchlist?symbol=NVDA
 *
 * Removes a matching symbol from the user's Watchlist.
 */
export async function DELETE(
  request: NextRequest,
) {
  try {
    const authentication =
      await getAuthenticatedClient(request);

    if (!authentication) {
      return jsonError(
        "Authentication required.",
        401,
      );
    }

    const { supabase, user } =
      authentication;

    const symbol = normalizeSymbol(
      request.nextUrl.searchParams.get(
        "symbol",
      ),
    );

    if (!symbol) {
      return jsonError(
        "A symbol query parameter is required.",
        400,
      );
    }

    const assetTypeParameter =
      request.nextUrl.searchParams.get(
        "asset_type",
      );

    let deleteQuery = supabase
      .from("trading_watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("symbol", symbol);

    if (assetTypeParameter) {
      deleteQuery = deleteQuery.eq(
        "asset_type",
        normalizeAssetType(
          assetTypeParameter,
        ),
      );
    }

    const { error } =
      await deleteQuery;

    if (error) {
      console.error(
        "Watchlist DELETE error:",
        error,
      );

      return jsonError(
        "Unable to remove the asset from the watchlist.",
        500,
      );
    }

    return NextResponse.json({
      success: true,
      message: `${symbol} was removed from your watchlist.`,
    });
  } catch (error) {
    console.error(
      "Watchlist DELETE unexpected error:",
      error,
    );

    return jsonError(
      "Watchlist service is temporarily unavailable.",
      500,
    );
  }
}