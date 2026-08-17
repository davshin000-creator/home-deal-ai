import {
  loadResearchPublicState,
} from "@/lib/research/public-gateway";

import {
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

import {
  normalizePublicOpportunities,
} from "@/lib/research/publicResearch";

import type {
  PublicOpportunity,
} from "@/lib/research/publicResearch";

type ResearchWatchRow = {
  id: string;
  user_id: string;
  symbol: string;

  last_confidence?:
    number | null;

  last_risk?:
    string | null;

  last_research_style?:
    string | null;

  last_research_version?:
    string | null;

  last_checked_at?:
    string | null;
};

type ResearchAlertRow = {
  user_id: string;
  symbol: string;
  alert_type: string;
  title: string;
  message: string;
  previous_value:
    string | null;
  current_value:
    string | null;
  created_at: string;
};

type ResearchHistoryRow = {
  user_id: string;
  symbol: string;
  confidence: number;
  risk: string | null;
  research_style:
    string | null;
  research_version:
    string | null;
  evidence_count: number;
  captured_at: string;
};

export type ResearchWatchEngineResult = {
  evaluatedWatches: number;
  matchedResearch: number;
  awaitingResearch: number;
  candidateAlerts: number;
  insertedAlerts: number;
  historySnapshots: number;
  updatedBaselines: number;
  sourceGeneratedAt:
    string | null;
  durationMs: number;
};

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function confidenceOf(
  item: PublicOpportunity,
) {
  const value =
    Number(
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

async function loadResearchUniverse() {
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
    typeof opportunities ===
      "object" &&
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

    if (
      researchUniverse.length > 0
    ) {
      return {
        opportunities:
          researchUniverse,

        generatedAt:
          state.generated_at ??
          null,
      };
    }

    const topOpportunities =
      normalizePublicOpportunities(
        sections.top_opportunities,
      );

    if (
      topOpportunities.length > 0
    ) {
      return {
        opportunities:
          topOpportunities,

        generatedAt:
          state.generated_at ??
          null,
      };
    }
  }

  return {
    opportunities:
      normalizePublicOpportunities(
        state.top_opportunities,
      ),

    generatedAt:
      state.generated_at ??
      null,
  };
}

export async function runResearchWatchEngine():
  Promise<ResearchWatchEngineResult> {
  const startedTimestamp =
    Date.now();

  const supabase =
    createSupabaseAdminClient();

  const {
    data:
      watchData,
    error:
      watchError,
  } = await supabase
    .from("research_watch")
    .select(
      [
        "id",
        "user_id",
        "symbol",
        "last_confidence",
        "last_risk",
        "last_research_style",
        "last_research_version",
        "last_checked_at",
      ].join(","),
    );

  if (watchError) {
    throw new Error(
      `Unable to load Research Watch: ${watchError.message}`,
    );
  }

  const watches =
    (watchData ?? []) as unknown as
      ResearchWatchRow[];

  const {
    opportunities,
    generatedAt,
  } =
    await loadResearchUniverse();

  const opportunityMap =
    new Map<
      string,
      PublicOpportunity
    >();

  for (
    const opportunity
    of opportunities
  ) {
    const symbol =
      normalizeSymbol(
        opportunity.symbol,
      );

    if (!symbol) {
      continue;
    }

    opportunityMap.set(
      symbol,
      opportunity,
    );
  }

  const alerts:
    ResearchAlertRow[] = [];

  const history:
    ResearchHistoryRow[] = [];

  const baselineUpdates: {
    id: string;
    userId: string;
    symbol: string;

    lastConfidence:
      number | null;

    lastRisk:
      string | null;

    lastResearchStyle:
      string | null;

    lastResearchVersion:
      string | null;

    checkedAt: string;
  }[] = [];

  let matchedResearch = 0;
  let awaitingResearch = 0;

  const capturedAt =
    new Date().toISOString();

  for (
    const watch
    of watches
  ) {
    const symbol =
      normalizeSymbol(
        watch.symbol,
      );

    const current =
      opportunityMap.get(
        symbol,
      );

    if (!current) {
      awaitingResearch += 1;
      continue;
    }

    matchedResearch += 1;

    const currentConfidence =
      confidenceOf(current);

    const previousConfidence =
      watch.last_confidence ===
        null ||
      watch.last_confidence ===
        undefined
        ? null
        : Number(
            watch.last_confidence,
          );

    const currentRisk =
      typeof current.risk ===
        "string"
        ? current.risk
        : null;

    const currentStyle =
      typeof current
        .research_style ===
        "string"
        ? current
            .research_style
        : null;

    const currentVersion =
      typeof current
        .research_version ===
        "string"
        ? current
            .research_version
        : null;

    const hadPreviousResearch =
      previousConfidence !==
        null ||
      Boolean(
        watch.last_risk,
      ) ||
      Boolean(
        watch
          .last_research_style,
      ) ||
      Boolean(
        watch
          .last_research_version,
      );

    if (!hadPreviousResearch) {
      alerts.push({
        user_id:
          watch.user_id,

        symbol,

        alert_type:
          "RESEARCH_AVAILABLE",

        title:
          `${symbol} research is now available`,

        message:
          `Nestrova public research evidence is now available for ${symbol}. Current research confidence: ${currentConfidence}%.`,

        previous_value:
          null,

        current_value:
          String(
            currentConfidence,
          ),

        created_at:
          capturedAt,
      });
    }

    if (
      previousConfidence !==
        null &&
      Math.abs(
        currentConfidence -
          previousConfidence,
      ) >= 5
    ) {
      const delta =
        currentConfidence -
        previousConfidence;

      alerts.push({
        user_id:
          watch.user_id,

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
          capturedAt,
      });
    }

    if (
      currentRisk &&
      watch.last_risk &&
      currentRisk !==
        watch.last_risk
    ) {
      alerts.push({
        user_id:
          watch.user_id,

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
          capturedAt,
      });
    }

    if (
      currentStyle &&
      watch
        .last_research_style &&
      currentStyle !==
        watch
          .last_research_style
    ) {
      alerts.push({
        user_id:
          watch.user_id,

        symbol,

        alert_type:
          "STYLE_CHANGE",

        title:
          `${symbol} research style changed`,

        message:
          `Research style changed from ${watch.last_research_style} to ${currentStyle}.`,

        previous_value:
          watch
            .last_research_style,

        current_value:
          currentStyle,

        created_at:
          capturedAt,
      });
    }

    if (
      currentVersion &&
      watch
        .last_research_version &&
      currentVersion !==
        watch
          .last_research_version
    ) {
      alerts.push({
        user_id:
          watch.user_id,

        symbol,

        alert_type:
          "VERSION_CHANGE",

        title:
          `${symbol} research engine changed`,

        message:
          `Research engine changed from ${watch.last_research_version} to ${currentVersion}.`,

        previous_value:
          watch
            .last_research_version,

        current_value:
          currentVersion,

        created_at:
          capturedAt,
      });
    }

    history.push({
      user_id:
        watch.user_id,

      symbol,

      confidence:
        currentConfidence,

      risk:
        currentRisk,

      research_style:
        currentStyle,

      research_version:
        currentVersion,

      evidence_count:
        Array.isArray(
          current
            .research_reasons,
        )
          ? current
              .research_reasons
              .length
          : 0,

      captured_at:
        capturedAt,
    });

    let nextConfidence =
      previousConfidence;

    if (
      previousConfidence ===
      null
    ) {
      nextConfidence =
        currentConfidence;
    }

    if (
      previousConfidence !==
        null &&
      Math.abs(
        currentConfidence -
          previousConfidence,
      ) >= 5
    ) {
      nextConfidence =
        currentConfidence;
    }

    baselineUpdates.push({
      id:
        watch.id,

      userId:
        watch.user_id,

      symbol,

      lastConfidence:
        nextConfidence,

      lastRisk:
        currentRisk ??
        watch.last_risk ??
        null,

      lastResearchStyle:
        currentStyle ??
        watch
          .last_research_style ??
        null,

      lastResearchVersion:
        currentVersion ??
        watch
          .last_research_version ??
        null,

      checkedAt:
        capturedAt,
    });
  }

  let insertedAlerts = 0;

  if (alerts.length > 0) {
    const {
      error:
        alertInsertError,
    } = await supabase
      .from(
        "research_alerts",
      )
      .insert(
        alerts,
      );

    if (alertInsertError) {
      throw new Error(
        `Unable to insert Research Alerts: ${alertInsertError.message}`,
      );
    }

    insertedAlerts =
      alerts.length;
  }

  if (history.length > 0) {
    const {
      error:
        historyInsertError,
    } = await supabase
      .from(
        "research_watch_history",
      )
      .insert(
        history,
      );

    if (historyInsertError) {
      throw new Error(
        `Unable to save Research Watch history: ${historyInsertError.message}`,
      );
    }
  }

  let updatedBaselines = 0;

  for (
    const update
    of baselineUpdates
  ) {
    const {
      error:
        baselineError,
    } = await supabase
      .from(
        "research_watch",
      )
      .update({
        last_confidence:
          update
            .lastConfidence,

        last_risk:
          update.lastRisk,

        last_research_style:
          update
            .lastResearchStyle,

        last_research_version:
          update
            .lastResearchVersion,

        last_checked_at:
          update.checkedAt,
      })
      .eq(
        "id",
        update.id,
      )
      .eq(
        "user_id",
        update.userId,
      );

    if (baselineError) {
      throw new Error(
        `Unable to update Research Watch baseline for ${update.symbol}: ${baselineError.message}`,
      );
    }

    updatedBaselines += 1;
  }

  return {
    evaluatedWatches:
      watches.length,

    matchedResearch,

    awaitingResearch,

    candidateAlerts:
      alerts.length,

    insertedAlerts,

    historySnapshots:
      history.length,

    updatedBaselines,

    sourceGeneratedAt:
      generatedAt,

    durationMs:
      Date.now() -
      startedTimestamp,
  };
}
