import { createSupabaseAdminClient } from "@/lib/supabase/server";

import {
  evaluateWatchlistItem,
  normalizeSymbol,
  type AlertCandidate,
  type PublicOpportunity,
  type WatchlistAlertInput,
} from "./evaluator";

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ??
  "https://api.nestrovaai.com";

type TradingState = {
  generated_at?: string;
  opportunities?: {
    top_opportunities?: PublicOpportunity[];
  };
  system?: {
    public_mode?: string;
    execution_exposed?: boolean;
  };
};

export type AlertEngineResult = {
  runId: string | null;
  evaluatedWatchlists: number;
  matchedAssets: number;
  candidateAlerts: number;
  insertedAlerts: number;
  skippedDuplicates: number;
  durationMs: number;
};

async function fetchTradingState(): Promise<TradingState> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/core/state`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Trading API returned ${response.status}.`,
    );
  }

  const data = (await response.json()) as TradingState;

  if (
    data.system?.public_mode !== "READ_ONLY" ||
    data.system?.execution_exposed !== false
  ) {
    throw new Error(
      "Trading API safety validation failed.",
    );
  }

  return data;
}

export async function runAlertEngine(): Promise<AlertEngineResult> {
  const startedAt = new Date();
  const startedTimestamp = Date.now();

  const supabase = createSupabaseAdminClient();

  let runId: string | null = null;

  const { data: runRecord, error: runCreateError } =
    await supabase
      .from("alert_engine_runs")
      .insert({
        status: "SUCCESS",
        started_at: startedAt.toISOString(),
        metadata: {
          trigger: "scheduled_or_manual",
        },
      })
      .select("id")
      .single();

  if (runCreateError) {
    console.error(
      "alert_engine_run_create_error",
      runCreateError,
    );
  } else {
    runId = runRecord?.id ?? null;
  }

  try {
    const [tradingState, watchlistResponse] =
      await Promise.all([
        fetchTradingState(),

        supabase
          .from("trading_watchlist")
          .select(
            `
              id,
              user_id,
              symbol,
              asset_type,
              alert_enabled,
              opportunity_threshold,
              risk_threshold
            `,
          )
          .eq("alert_enabled", true),
      ]);

    if (watchlistResponse.error) {
      throw new Error(
        watchlistResponse.error.message,
      );
    }

    const watchlists =
      (watchlistResponse.data ??
        []) as WatchlistAlertInput[];

    const opportunities =
      tradingState.opportunities?.top_opportunities ??
      [];

    const opportunityMap = new Map(
      opportunities.map((item) => [
        normalizeSymbol(item.symbol),
        item,
      ]),
    );

    const candidates: AlertCandidate[] = [];
    let matchedAssets = 0;

    for (const item of watchlists) {
      const opportunity = opportunityMap.get(
        normalizeSymbol(item.symbol),
      );

      if (opportunity) {
        matchedAssets += 1;
      }

      candidates.push(
        ...evaluateWatchlistItem(
          item,
          opportunity,
        ),
      );
    }

    let insertedAlerts = 0;
    let skippedDuplicates = 0;

    for (const candidate of candidates) {
      const { error } = await supabase
        .from("trading_alerts")
        .insert({
          user_id: candidate.userId,
          watchlist_id:
            candidate.watchlistId,
          symbol: candidate.symbol,
          alert_type:
            candidate.alertType,
          alert_key: candidate.alertKey,
          opportunity_score:
            candidate.opportunityScore,
          market_regime:
            candidate.marketRegime,
          risk_level:
            candidate.riskLevel,
          title: candidate.title,
          message: candidate.message,
          triggered_value:
            candidate.triggeredValue,
          threshold_value:
            candidate.thresholdValue,
          source_updated_at:
            tradingState.generated_at ??
            null,
          metadata: candidate.metadata,
          is_read: false,
        });

      if (!error) {
        insertedAlerts += 1;
        continue;
      }

      if (error.code === "23505") {
        skippedDuplicates += 1;
        continue;
      }

      throw new Error(error.message);
    }

    const completedAt = new Date();
    const durationMs =
      Date.now() - startedTimestamp;

    if (runId) {
      const { error: updateError } =
        await supabase
          .from("alert_engine_runs")
          .update({
            status: "SUCCESS",
            completed_at:
              completedAt.toISOString(),
            evaluated_watchlists:
              watchlists.length,
            matched_assets: matchedAssets,
            candidate_alerts:
              candidates.length,
            inserted_alerts:
              insertedAlerts,
            skipped_duplicates:
              skippedDuplicates,
            source_generated_at:
              tradingState.generated_at ??
              null,
            duration_ms: durationMs,
            error_message: null,
            metadata: {
              public_mode:
                tradingState.system
                  ?.public_mode ??
                null,
              execution_exposed:
                tradingState.system
                  ?.execution_exposed ??
                null,
            },
          })
          .eq("id", runId);

      if (updateError) {
        console.error(
          "alert_engine_run_update_error",
          updateError,
        );
      }
    }

    return {
      runId,
      evaluatedWatchlists:
        watchlists.length,
      matchedAssets,
      candidateAlerts:
        candidates.length,
      insertedAlerts,
      skippedDuplicates,
      durationMs,
    };
  } catch (error) {
    const completedAt = new Date();
    const durationMs =
      Date.now() - startedTimestamp;

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown Alert Engine error.";

    if (runId) {
      const { error: failureUpdateError } =
        await supabase
          .from("alert_engine_runs")
          .update({
            status: "FAILED",
            completed_at:
              completedAt.toISOString(),
            duration_ms: durationMs,
            error_message: errorMessage,
          })
          .eq("id", runId);

      if (failureUpdateError) {
        console.error(
          "alert_engine_failure_log_error",
          failureUpdateError,
        );
      }
    } else {
      const { error: fallbackLogError } =
        await supabase
          .from("alert_engine_runs")
          .insert({
            status: "FAILED",
            started_at:
              startedAt.toISOString(),
            completed_at:
              completedAt.toISOString(),
            duration_ms: durationMs,
            error_message: errorMessage,
            metadata: {
              fallback_log: true,
            },
          });

      if (fallbackLogError) {
        console.error(
          "alert_engine_fallback_log_error",
          fallbackLogError,
        );
      }
    }

    throw error;
  }
}
