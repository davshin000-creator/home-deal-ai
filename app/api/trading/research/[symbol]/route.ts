import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  hasFeature,
} from "@/lib/subscriptions/entitlements";

import {
  checkTradingResearchUsage,
  consumeTradingResearchUsage,
  hasRecentTradingResearchAccess,
  recordTradingResearchAccess,
} from "@/lib/trading/usage";

export const dynamic = "force-dynamic";

const TRADING_API_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function jsonError(
  message: string,
  status: number,
  code?: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      success: false,
      ...(code ? { code } : {}),
      error: message,
      ...(extra ?? {}),
    },
    {
      status,
    },
  );
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      symbol: string;
    }>;
  },
) {
  try {
    const {
      symbol: rawSymbol,
    } = await context.params;

    const symbol =
      normalizeSymbol(rawSymbol);

    if (!symbol) {
      return jsonError(
        "A valid symbol is required.",
        400,
        "INVALID_SYMBOL",
      );
    }

    if (
      symbol.length > 30 ||
      !/^[A-Z0-9._-]+$/.test(symbol)
    ) {
      return jsonError(
        "The symbol is invalid.",
        400,
        "INVALID_SYMBOL",
      );
    }

    const {
      user,
      profile,
    } =
      await getCurrentUserProfile();

    if (!user) {
      return jsonError(
        "Authentication required.",
        401,
        "AUTHENTICATION_REQUIRED",
      );
    }

    const forceFreeForLocalTest =
      process.env.NODE_ENV !== "production" &&
      process.env.TRADING_RESEARCH_FORCE_FREE_FOR_TEST ===
        "true";

    const hasTradingAccess =
      forceFreeForLocalTest
        ? false
        : hasFeature(
            profile,
            "trading",
          );

    let recentAccess = false;

    if (!hasTradingAccess) {
      const recent =
        await hasRecentTradingResearchAccess(
          user.id,
          symbol,
        );

      recentAccess =
        recent.recent;

      if (!recentAccess) {
        const usage =
          await checkTradingResearchUsage(
            user.id,
          );

        if (!usage.allowed) {
          return jsonError(
            "You have reached your free monthly Trading Research limit.",
            403,
            "TRADING_RESEARCH_LIMIT_REACHED",
            {
              usage: {
                used: usage.used,
                limit: usage.limit,
                remaining:
                  usage.remaining,
                usageMonth:
                  usage.usageMonth,
              },
            },
          );
        }
      }
    }

    const upstreamResponse =
      await fetch(
        `${TRADING_API_URL}/api/v1/assets/${encodeURIComponent(
          symbol,
        )}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept:
              "application/json",
          },
        },
      );

    let upstreamData:
      | Record<string, unknown>
      | null = null;

    try {
      upstreamData =
        (await upstreamResponse.json()) as Record<
          string,
          unknown
        >;
    } catch {
      upstreamData = null;
    }

    if (
      upstreamResponse.status === 404
    ) {
      return jsonError(
        "Public research is not currently available for this asset.",
        404,
        "RESEARCH_NOT_AVAILABLE",
      );
    }

    if (!upstreamResponse.ok) {
      console.error(
        "trading_research_upstream_failed",
        symbol,
        upstreamResponse.status,
      );

      return jsonError(
        "Trading Research is temporarily unavailable.",
        503,
        "RESEARCH_UPSTREAM_UNAVAILABLE",
      );
    }

    if (
      !upstreamData ||
      upstreamData.source_available === false
    ) {
      return jsonError(
        "Public research is not currently available for this asset.",
        404,
        "RESEARCH_NOT_AVAILABLE",
      );
    }

    let usage:
      | {
          used: number;
          limit: number;
          remaining: number;
          usageMonth: string;
        }
      | null = null;

    let charged = false;

    if (!hasTradingAccess) {
      if (!recentAccess) {
        const consumed =
          await consumeTradingResearchUsage(
            user.id,
          );

        if (!consumed.allowed) {
          return jsonError(
            "You have reached your free monthly Trading Research limit.",
            403,
            "TRADING_RESEARCH_LIMIT_REACHED",
            {
              usage: {
                used:
                  consumed.used,
                limit:
                  consumed.limit,
                remaining:
                  consumed.remaining,
                usageMonth:
                  consumed.usageMonth,
              },
            },
          );
        }

        usage = {
          used:
            consumed.used,
          limit:
            consumed.limit,
          remaining:
            consumed.remaining,
          usageMonth:
            consumed.usageMonth,
        };

        charged = true;

        await recordTradingResearchAccess(
          user.id,
          symbol,
          true,
        );
      } else {
        const currentUsage =
          await checkTradingResearchUsage(
            user.id,
          );

        usage = {
          used:
            currentUsage.used,
          limit:
            currentUsage.limit,
          remaining:
            currentUsage.remaining,
          usageMonth:
            currentUsage.usageMonth,
        };
      }
    }

    return NextResponse.json(
      {
        success: true,
        ...upstreamData,
        access: {
          tier:
            hasTradingAccess
              ? "pro"
              : "free",
          unlimited:
            hasTradingAccess,
          usage,
          charged:
            hasTradingAccess
              ? false
              : charged,
          deduped:
            hasTradingAccess
              ? false
              : recentAccess,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "trading_research_route_failed",
      error,
    );

    return jsonError(
      "Unable to load Trading Research.",
      500,
      "TRADING_RESEARCH_ERROR",
    );
  }
}
