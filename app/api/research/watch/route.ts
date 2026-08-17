import { NextResponse } from "next/server";
import {
  loadResearchPublicState,
} from "@/lib/research/public-gateway";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  getPublicSearchUniverse,
  normalizePublicOpportunities,
} from "@/lib/research/publicResearch";

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function confidenceOf(
  item: Record<string, unknown>,
) {
  const value = Number(
    item.confidence ??
      item.weighted_score ??
      item.score ??
      0,
  );

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value),
    ),
  );
}

async function loadPublicResearch() {
  const state =
    await loadResearchPublicState();

  if (!state) {
    throw new Error(
      "Research Public Gateway unavailable.",
    );
  }

  const opportunities =
    state.opportunities;

  if (
    opportunities &&
    typeof opportunities === "object" &&
    !Array.isArray(opportunities)
  ) {
    const sections =
      opportunities as Record<
        string,
        unknown
      >;

    const researchUniverse =
      normalizePublicOpportunities(
        sections.research_universe,
      );

    if (researchUniverse.length > 0) {
      return researchUniverse;
    }

    const topOpportunities =
      normalizePublicOpportunities(
        sections.top_opportunities,
      );

    if (topOpportunities.length > 0) {
      return topOpportunities;
    }
  }

  return normalizePublicOpportunities(
    state.top_opportunities,
  );
}

export async function GET() {
  try {
    const { user } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to view Research Watch.",
        },
        {
          status: 401,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      data: watches,
      error,
    } = await supabase
      .from("research_watch")
      .select("*")
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

    if (error) {
      console.error(
        "research_watch_get_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not load Research Watch.",
        },
        {
          status: 500,
        },
      );
    }

    let opportunities:
      Awaited<
        ReturnType<
          typeof loadPublicResearch
        >
      > = [];

    try {
      opportunities =
        await loadPublicResearch();
    } catch (gatewayError) {
      console.error(
        "research_watch_gateway_failed",
        gatewayError,
      );
    }

    const enriched =
      (watches ?? []).map(
        (watch) => {
          const current =
            opportunities.find(
              (item) =>
                normalizeSymbol(
                  item.symbol,
                ) ===
                normalizeSymbol(
                  watch.symbol,
                ),
            );

          const currentConfidence =
            current
              ? confidenceOf(
                  current,
                )
              : null;

          const currentRisk =
            typeof current?.risk ===
            "string"
              ? current.risk
              : null;

          const currentStyle =
            typeof current?.research_style ===
            "string"
              ? current.research_style
              : null;

          const currentVersion =
            typeof current?.research_version ===
            "string"
              ? current.research_version
              : null;

          return {
            ...watch,

            current: current
              ? {
                  confidence:
                    currentConfidence,

                  risk:
                    currentRisk,

                  research_style:
                    currentStyle,

                  research_version:
                    currentVersion,

                  reasons:
                    Array.isArray(
                      current.research_reasons,
                    )
                      ? current.research_reasons
                      : [],
                }
              : null,

            changes: {
              confidence:
                currentConfidence !==
                  null &&
                watch.last_confidence !==
                  null
                  ? currentConfidence -
                    Number(
                      watch.last_confidence,
                    )
                  : null,

              risk_changed:
                Boolean(
                  currentRisk &&
                    watch.last_risk &&
                    currentRisk !==
                      watch.last_risk,
                ),

              style_changed:
                Boolean(
                  currentStyle &&
                    watch.last_research_style &&
                    currentStyle !==
                      watch.last_research_style,
                ),

              version_changed:
                Boolean(
                  currentVersion &&
                    watch.last_research_version &&
                    currentVersion !==
                      watch.last_research_version,
                ),
            },
          };
        },
      );

    return NextResponse.json({
      ok: true,
      watches:
        enriched,
    });
  } catch (error) {
    console.error(
      "research_watch_get_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not load Research Watch.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const {
      user,
      profile,
    } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to use Research Watch.",
        },
        {
          status: 401,
        },
      );
    }

    if (!hasResearchAccess(profile)) {
      return NextResponse.json(
        {
          error:
            "Research Watch requires Nestrova Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    const body =
      await request.json();

    const symbol =
      normalizeSymbol(
        body?.symbol,
      );

    if (!symbol) {
      return NextResponse.json(
        {
          error:
            "Symbol is required.",
        },
        {
          status: 400,
        },
      );
    }

    let searchable = false;

    try {
      const publicState =
        await loadResearchPublicState();

      if (!publicState) {
        throw new Error(
          "Research Public Gateway unavailable.",
        );
      }

      const searchUniverse =
        getPublicSearchUniverse(
          publicState,
        );

      searchable =
        searchUniverse.some(
          (item) =>
            normalizeSymbol(
              item.symbol,
            ) === symbol,
        );
    } catch (gatewayError) {
      console.error(
        "research_watch_symbol_validation_failed",
        gatewayError,
      );

      return NextResponse.json(
        {
          error:
            "Research universe is temporarily unavailable.",
          code:
            "RESEARCH_UNIVERSE_UNAVAILABLE",
        },
        {
          status: 502,
        },
      );
    }

    if (!searchable) {
      return NextResponse.json(
        {
          error:
            `${symbol} is not currently supported by Nestrova Research.`,
          code:
            "RESEARCH_SYMBOL_UNSUPPORTED",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      data: existingWatches,
      error: existingWatchError,
    } = await supabase
      .from("research_watch")
      .select("*")
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "symbol",
        symbol,
      )
      .limit(1);

    if (existingWatchError) {
      console.error(
        "research_watch_existing_check_failed",
        existingWatchError,
      );

      return NextResponse.json(
        {
          error:
            "Could not verify Research Watch.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      Array.isArray(
        existingWatches,
      ) &&
      existingWatches.length > 0
    ) {
      return NextResponse.json({
        ok: true,
        already_watched: true,
        watch:
          existingWatches[0],
      });
    }

    const {
      count,
      error:
        countError,
    } = await supabase
      .from("research_watch")
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq(
        "user_id",
        user.id,
      );

    if (countError) {
      return NextResponse.json(
        {
          error:
            "Could not verify Research Watch limit.",
        },
        {
          status: 500,
        },
      );
    }

    if (
      Number(count ?? 0) >=
      20
    ) {
      return NextResponse.json(
        {
          error:
            "Research Watch currently supports up to 20 symbols.",
          code:
            "RESEARCH_WATCH_LIMIT",
        },
        {
          status: 403,
        },
      );
    }

    let current:
      Record<string, unknown> |
      undefined;

    try {
      const opportunities =
        await loadPublicResearch();

      current =
        opportunities.find(
          (item) =>
            normalizeSymbol(
              item.symbol,
            ) === symbol,
        );
    } catch (
      gatewayError
    ) {
      console.error(
        "research_watch_initial_gateway_failed",
        gatewayError,
      );
    }

    const payload = {
      user_id:
        user.id,

      symbol,

      last_confidence:
        current
          ? confidenceOf(
              current,
            )
          : null,

      last_risk:
        typeof current?.risk ===
        "string"
          ? current.risk
          : null,

      last_research_style:
        typeof current?.research_style ===
        "string"
          ? current.research_style
          : null,

      last_research_version:
        typeof current?.research_version ===
        "string"
          ? current.research_version
          : null,

      last_checked_at:
        new Date().toISOString(),
    };

    const {
      data,
      error,
    } = await supabase
      .from("research_watch")
      .upsert(
        payload,
        {
          onConflict:
            "user_id,symbol",
        },
      )
      .select("*")
      .single();

    if (error) {
      console.error(
        "research_watch_post_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not add Research Watch.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      watch:
        data,
    });
  } catch (error) {
    console.error(
      "research_watch_post_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not add Research Watch.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const { user } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in.",
        },
        {
          status: 401,
        },
      );
    }

    const symbol =
      normalizeSymbol(
        new URL(
          request.url,
        ).searchParams.get(
          "symbol",
        ),
      );

    if (!symbol) {
      return NextResponse.json(
        {
          error:
            "Symbol is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      error,
    } = await supabase
      .from("research_watch")
      .delete()
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "symbol",
        symbol,
      );

    if (error) {
      console.error(
        "research_watch_delete_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not remove Research Watch.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "research_watch_delete_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not remove Research Watch.",
      },
      {
        status: 500,
      },
    );
  }
}
