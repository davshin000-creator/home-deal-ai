import { NextResponse } from "next/server";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  normalizePublicOpportunities,
} from "@/lib/research/publicResearch";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrova.com";

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
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/core/state`,
      {
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      `Gateway returned ${response.status}`,
    );
  }

  const state =
    await response.json();

  return [
    ...normalizePublicOpportunities(
      state?.top_opportunities,
    ),
    ...normalizePublicOpportunities(
      state?.opportunities,
    ),
  ];
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

    if (
      opportunities.length > 0 &&
      (watches ?? []).length > 0
    ) {
      const snapshots =
        (watches ?? [])
          .map((watch) => {
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

            if (!current) {
              return null;
            }

            return {
              user_id:
                user.id,

              symbol:
                normalizeSymbol(
                  watch.symbol,
                ),

              confidence:
                confidenceOf(
                  current,
                ),

              risk:
                typeof current.risk ===
                "string"
                  ? current.risk
                  : null,

              research_style:
                typeof current.research_style ===
                "string"
                  ? current.research_style
                  : null,

              research_version:
                typeof current.research_version ===
                "string"
                  ? current.research_version
                  : null,

              evidence_count:
                Array.isArray(
                  current.research_reasons,
                )
                  ? current.research_reasons.length
                  : 0,

              captured_at:
                new Date().toISOString(),
            };
          })
          .filter(
            (
              item,
            ): item is {
              user_id: string;
              symbol: string;
              confidence: number;
              risk: string | null;
              research_style: string | null;
              research_version: string | null;
              evidence_count: number;
              captured_at: string;
            } =>
              item !== null,
          );

      if (snapshots.length > 0) {
        const {
          error:
            historyError,
        } = await supabase
          .from(
            "research_watch_history",
          )
          .insert(
            snapshots,
          );

        if (historyError) {
          console.error(
            "research_watch_history_insert_failed",
            historyError,
          );
        }
      }
    }

    const researchAlerts: {
      user_id: string;
      symbol: string;
      alert_type: string;
      title: string;
      message: string;
      previous_value: string | null;
      current_value: string | null;
      created_at: string;
    }[] = [];

    for (const watch of watches ?? []) {
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

      if (!current) {
        continue;
      }

      const symbol =
        normalizeSymbol(
          watch.symbol,
        );

      const currentConfidence =
        confidenceOf(
          current,
        );

      const previousConfidence =
        watch.last_confidence ===
        null ||
        watch.last_confidence ===
        undefined
          ? null
          : Number(
              watch.last_confidence,
            );

      if (
        previousConfidence !== null &&
        Math.abs(
          currentConfidence -
            previousConfidence,
        ) >= 5
      ) {
        const delta =
          currentConfidence -
          previousConfidence;

        researchAlerts.push({
          user_id:
            user.id,

          symbol,

          alert_type:
            "CONFIDENCE_CHANGE",

          title:
            `${symbol} research confidence changed`,

          message:
            `Research confidence moved from ${previousConfidence}% to ${currentConfidence}% (${delta > 0 ? "+" : ""}${delta}).`,

          previous_value:
            String(
              previousConfidence,
            ),

          current_value:
            String(
              currentConfidence,
            ),

          created_at:
            new Date().toISOString(),
        });
      }

      const currentRisk =
        typeof current.risk ===
        "string"
          ? current.risk
          : null;

      if (
        currentRisk &&
        watch.last_risk &&
        currentRisk !==
          watch.last_risk
      ) {
        researchAlerts.push({
          user_id:
            user.id,

          symbol,

          alert_type:
            "RISK_CHANGE",

          title:
            `${symbol} research risk changed`,

          message:
            `Research risk changed from ${watch.last_risk} to ${currentRisk}.`,

          previous_value:
            watch.last_risk,

          current_value:
            currentRisk,

          created_at:
            new Date().toISOString(),
        });
      }

      const currentStyle =
        typeof current.research_style ===
        "string"
          ? current.research_style
          : null;

      if (
        currentStyle &&
        watch.last_research_style &&
        currentStyle !==
          watch.last_research_style
      ) {
        researchAlerts.push({
          user_id:
            user.id,

          symbol,

          alert_type:
            "STYLE_CHANGE",

          title:
            `${symbol} research style changed`,

          message:
            `Research style changed from ${watch.last_research_style} to ${currentStyle}.`,

          previous_value:
            watch.last_research_style,

          current_value:
            currentStyle,

          created_at:
            new Date().toISOString(),
        });
      }

      const currentVersion =
        typeof current.research_version ===
        "string"
          ? current.research_version
          : null;

      if (
        currentVersion &&
        watch.last_research_version &&
        currentVersion !==
          watch.last_research_version
      ) {
        researchAlerts.push({
          user_id:
            user.id,

          symbol,

          alert_type:
            "VERSION_CHANGE",

          title:
            `${symbol} research engine changed`,

          message:
            `Research engine changed from ${watch.last_research_version} to ${currentVersion}.`,

          previous_value:
            watch.last_research_version,

          current_value:
            currentVersion,

          created_at:
            new Date().toISOString(),
        });
      }
    }

    if (
      researchAlerts.length >
      0
    ) {
      const {
        error:
          alertsInsertError,
      } = await supabase
        .from(
          "research_alerts",
        )
        .insert(
          researchAlerts,
        );

      if (
        alertsInsertError
      ) {
        console.error(
          "research_alert_insert_failed",
          alertsInsertError,
        );
      }
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

    const supabase =
      createSupabaseAdminClient();

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
