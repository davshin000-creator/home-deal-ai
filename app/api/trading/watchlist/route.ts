import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  hasFeature,
} from "@/lib/subscriptions/entitlements";

export const dynamic = "force-dynamic";

type AssetType = "stock" | "crypto" | "etf" | "index" | "forex";

type WatchlistRequestBody = {
  symbol?: unknown;
  assetName?: unknown;
  assetType?: unknown;
  opportunityScore?: unknown;
  risk?: unknown;
  regime?: unknown;
  notes?: unknown;
};

const ALLOWED_ASSET_TYPES: AssetType[] = [
  "stock",
  "crypto",
  "etf",
  "index",
  "forex",
];

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components may not allow cookie writes.
          // Route handlers can normally update cookies.
        }
      },
    },
  });
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
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

  return normalized.length > 0 ? normalized : null;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAssetType(value: unknown): AssetType {
  if (
    typeof value === "string" &&
    ALLOWED_ASSET_TYPES.includes(value.toLowerCase() as AssetType)
  ) {
    return value.toLowerCase() as AssetType;
  }

  return "stock";
}

/**
 * GET /api/trading/watchlist
 *
 * Returns the authenticated user's active watchlist.
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonError("Authentication required.", 401);
    }

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Watchlist GET error:", error);

      return jsonError("Unable to load the watchlist.", 500);
    }

    return NextResponse.json(
      {
        success: true,
        watchlist: data ?? [],
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Watchlist GET unexpected error:", error);

    return jsonError("Watchlist service is temporarily unavailable.", 500);
  }
}

/**
 * POST /api/trading/watchlist
 *
 * Adds an asset to the authenticated user's watchlist.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonError("Authentication required.", 401);
    }

    let body: WatchlistRequestBody;

    try {
      body = (await request.json()) as WatchlistRequestBody;
    } catch {
      return jsonError("Invalid JSON request body.", 400);
    }

    const symbol = normalizeSymbol(body.symbol);

    if (!symbol) {
      return jsonError("A valid symbol is required.", 400);
    }

    if (symbol.length > 30) {
      return jsonError("The symbol is too long.", 400);
    }

    const assetType = normalizeAssetType(body.assetType);
    const opportunityScore = optionalNumber(body.opportunityScore);

    if (
      opportunityScore !== null &&
      (opportunityScore < 0 || opportunityScore > 100)
    ) {
      return jsonError(
        "Opportunity score must be between 0 and 100.",
        400,
      );
    }

    const watchlistItem = {
      user_id: user.id,
      symbol,
      asset_name: optionalText(body.assetName),
      asset_type: assetType,
      opportunity_score: opportunityScore,
      risk: optionalText(body.risk),
      regime: optionalText(body.regime),
      notes: optionalText(body.notes),
      is_active: true,
    };

    const { profile } = await getCurrentUserProfile();

const hasUnlimitedWatchlist = hasFeature(
  profile,
  "trading",
);

if (!hasUnlimitedWatchlist) {
  const admin = createSupabaseAdminClient();

  const { count, error: countError } = await admin
    .from("trading_watchlist")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (countError) {
    console.error(countError);

    return jsonError(
      "Unable to verify watchlist usage.",
      500,
    );
  }

  const { data: existing } = await admin
    .from("trading_watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("symbol", symbol)
    .eq("asset_type", assetType)
    .maybeSingle();

  if (!existing && (count ?? 0) >= 5) {
    return NextResponse.json(
      {
        success: false,
        code: "WATCHLIST_LIMIT_REACHED",
        error:
          "Free accounts can save up to 5 watchlist assets.",
      },
      {
        status: 403,
      },
    );
  }
}

    const { data, error } = await supabase
      .from("trading_watchlist")
      .upsert(watchlistItem, {
        onConflict: "user_id,symbol,asset_type"
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
      console.error("Watchlist POST error:", error);

      return jsonError("Unable to add the asset to the watchlist.", 500);
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
    console.error("Watchlist POST unexpected error:", error);

    return jsonError("Watchlist service is temporarily unavailable.", 500);
  }
}

/**
 * DELETE /api/trading/watchlist?symbol=NVDA
 *
 * Removes an asset from the authenticated user's watchlist.
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonError("Authentication required.", 401);
    }

    const symbol = normalizeSymbol(
      request.nextUrl.searchParams.get("symbol"),
    );

    if (!symbol) {
      return jsonError("A symbol query parameter is required.", 400);
    }

    const { error } = await supabase
      .from("trading_watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("symbol", symbol);

    if (error) {
      console.error("Watchlist DELETE error:", error);

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
    console.error("Watchlist DELETE unexpected error:", error);

    return jsonError("Watchlist service is temporarily unavailable.", 500);
  }
}