import {
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

export const FREE_TRADING_RESEARCH_MONTHLY_LIMIT =
  10;

function currentUsageMonth() {
  const now = new Date();

  return [
    now.getUTCFullYear(),
    String(
      now.getUTCMonth() + 1,
    ).padStart(2, "0"),
  ].join("-");
}

export async function getTradingResearchUsage(
  userId: string,
) {
  const supabase =
    createSupabaseAdminClient();

  const usageMonth =
    currentUsageMonth();

  const {
    data,
    error,
  } = await supabase
    .from("research_usage")
    .select("usage_count")
    .eq("user_id", userId)
    .eq(
      "feature",
      "trading_asset",
    )
    .eq(
      "usage_month",
      usageMonth,
    )
    .maybeSingle();

  if (error) {
    console.error(
      "trading_research_usage_get_failed",
      error,
    );

    throw new Error(
      "Could not load trading research usage.",
    );
  }

  const used = Number(
    data?.usage_count ?? 0,
  );

  const limit =
    FREE_TRADING_RESEARCH_MONTHLY_LIMIT;

  return {
    feature: "trading_asset" as const,
    usageMonth,
    used,
    limit,
    remaining: Math.max(
      0,
      limit - used,
    ),
  };
}

export async function checkTradingResearchUsage(
  userId: string,
) {
  const usage =
    await getTradingResearchUsage(
      userId,
    );

  return {
    allowed:
      usage.used < usage.limit,
    ...usage,
  };
}

export async function consumeTradingResearchUsage(
  userId: string,
) {
  const supabase =
    createSupabaseAdminClient();

  const usage =
    await getTradingResearchUsage(
      userId,
    );

  if (
    usage.used >= usage.limit
  ) {
    return {
      allowed: false,
      ...usage,
    };
  }

  const nextCount =
    usage.used + 1;

  const {
    error,
  } = await supabase
    .from("research_usage")
    .upsert(
      {
        user_id: userId,
        feature: "trading_asset",
        usage_month:
          usage.usageMonth,
        usage_count:
          nextCount,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "user_id,feature,usage_month",
      },
    );

  if (error) {
    console.error(
      "trading_research_usage_consume_failed",
      error,
    );

    throw new Error(
      "Could not update trading research usage.",
    );
  }

  return {
    allowed: true,
    ...usage,
    used: nextCount,
    remaining: Math.max(
      0,
      usage.limit - nextCount,
    ),
  };
}

export const TRADING_RESEARCH_DEDUPE_MINUTES =
  30;

function normalizeResearchSymbol(
  value: string,
) {
  return value
    .trim()
    .toUpperCase();
}

export async function hasRecentTradingResearchAccess(
  userId: string,
  symbol: string,
) {
  const supabase =
    createSupabaseAdminClient();

  const normalizedSymbol =
    normalizeResearchSymbol(symbol);

  const cutoff =
    new Date(
      Date.now() -
        TRADING_RESEARCH_DEDUPE_MINUTES *
          60 *
          1000,
    ).toISOString();

  const {
    data,
    error,
  } = await supabase
    .from(
      "trading_research_access_log",
    )
    .select(
      "id,accessed_at,charged",
    )
    .eq(
      "user_id",
      userId,
    )
    .eq(
      "symbol",
      normalizedSymbol,
    )
    .gte(
      "accessed_at",
      cutoff,
    )
    .order(
      "accessed_at",
      {
        ascending: false,
      },
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "trading_research_recent_access_failed",
      error,
    );

    throw new Error(
      "Could not check recent Trading Research access.",
    );
  }

  return {
    recent: Boolean(data),
    accessedAt:
      data?.accessed_at ?? null,
    charged:
      data?.charged ?? null,
  };
}

export async function recordTradingResearchAccess(
  userId: string,
  symbol: string,
  charged: boolean,
) {
  const supabase =
    createSupabaseAdminClient();

  const normalizedSymbol =
    normalizeResearchSymbol(symbol);

  const {
    error,
  } = await supabase
    .from(
      "trading_research_access_log",
    )
    .insert({
      user_id:
        userId,
      symbol:
        normalizedSymbol,
      accessed_at:
        new Date().toISOString(),
      charged,
    });

  if (error) {
    console.error(
      "trading_research_access_log_failed",
      error,
    );

    throw new Error(
      "Could not record Trading Research access.",
    );
  }
}

