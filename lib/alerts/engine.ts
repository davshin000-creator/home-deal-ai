import { createSupabaseAdminClient } from "@/lib/supabase/server";
import {
  loadTradingPublicAsset,
  loadTradingPublicState,
} from "@/lib/trading/public-gateway";
import { updateAlertEngineHealth } from "./health-monitor";

import {
  evaluateWatchlistItem,
  normalizeSymbol,
  type AlertCandidate,
  type PublicOpportunity,
  type WatchlistAlertInput,
} from "./evaluator";

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
  const result =
    await loadTradingPublicState<TradingState>();

  if (
    result.error ||
    !result.data
  ) {
    throw new Error(
      result.error ??
        "Trading intelligence is temporarily unavailable.",
    );
  }

  const data =
    result.data;

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


async function fetchAssetOpportunity(
  symbol: string,
): Promise<PublicOpportunity | undefined> {
  const maxAttempts = 3;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt += 1
  ) {
    try {
      const result =
        await loadTradingPublicAsset<
          PublicOpportunity & {
            public_mode?: string;
            execution_exposed?: boolean;
            source_available?: boolean;
          }
        >(symbol);

      if (
        result.error ||
        !result.data
      ) {
        const retryable =
          result.status === 502 ||
          result.status === 503 ||
          result.status === 504 ||
          result.status === null;

        console.warn(
          "alert_engine_asset_fetch_failed",
          symbol,
          result.status,
          `attempt=${attempt}/${maxAttempts}`,
        );

        if (
          retryable &&
          attempt < maxAttempts
        ) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                750 * attempt,
              ),
          );

          continue;
        }

        return undefined;
      }

      const data =
        result.data;

      if (
        data.public_mode !== "READ_ONLY" ||
        data.execution_exposed !== false ||
        data.source_available === false
      ) {
        console.warn(
          "alert_engine_asset_safety_rejected",
          symbol,
        );

        return undefined;
      }

      if (
        normalizeSymbol(data.symbol) !==
        normalizeSymbol(symbol)
      ) {
        console.warn(
          "alert_engine_asset_symbol_mismatch",
          symbol,
          data.symbol,
        );

        return undefined;
      }

      return data;
    } catch (error) {
      console.error(
        "alert_engine_asset_fetch_error",
        symbol,
        `attempt=${attempt}/${maxAttempts}`,
        error,
      );

      if (attempt < maxAttempts) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              750 * attempt,
            ),
        );

        continue;
      }

      return undefined;
    }
  }

  return undefined;
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
              risk_threshold,
              last_confidence,
              last_direction,
              last_outlook,
              last_risk,
              last_research_checked_at
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

    /*
     * The public ranking only contains a small
     * subset of the full market universe.
     *
     * For watched assets that are not currently
     * ranked, request fresh public research from
     * the read-only per-asset endpoint.
     */
    const missingSymbols = Array.from(
      new Set(
        watchlists
          .map((item) =>
            normalizeSymbol(item.symbol),
          )
          .filter(
            (symbol) =>
              Boolean(symbol) &&
              !opportunityMap.has(symbol),
          ),
      ),
    );

    if (missingSymbols.length > 0) {
      const fallbackResults =
        await Promise.all(
          missingSymbols.map(
            async (symbol) => ({
              symbol,
              opportunity:
                await fetchAssetOpportunity(
                  symbol,
                ),
            }),
          ),
        );

      for (const result of fallbackResults) {
        if (!result.opportunity) {
          continue;
        }

        opportunityMap.set(
          result.symbol,
          result.opportunity,
        );
      }
    }

    const candidates: AlertCandidate[] = [];
    let matchedAssets = 0;

    for (const item of watchlists) {
      const opportunity = opportunityMap.get(
        normalizeSymbol(item.symbol),
      );

      if (!opportunity) {
        continue;
      }

      matchedAssets += 1;

      const currentConfidence =
        typeof opportunity.confidence === "number" &&
        Number.isFinite(opportunity.confidence)
          ? Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  opportunity.confidence,
                ),
              ),
            )
          : null;

      const currentDirection =
        typeof opportunity.direction === "string" &&
        opportunity.direction.trim()
          ? opportunity.direction
              .trim()
              .toUpperCase()
          : null;

      const currentOutlook =
        typeof opportunity.outlook === "string" &&
        opportunity.outlook.trim()
          ? opportunity.outlook
              .trim()
              .toUpperCase()
          : null;

      const currentRisk =
        typeof opportunity.risk === "string" &&
        opportunity.risk.trim()
          ? opportunity.risk
              .trim()
              .toUpperCase()
          : null;

      /*
       * First observation:
       * establish a baseline without generating
       * a change alert.
       */
      if (!item.last_research_checked_at) {
        const {
          error: baselineError,
        } = await supabase
          .from("trading_watchlist")
          .update({
            last_confidence:
              currentConfidence,
            last_direction:
              currentDirection,
            last_outlook:
              currentOutlook,
            last_risk:
              currentRisk,
            last_research_checked_at:
              new Date().toISOString(),
          })
          .eq("id", item.id)
          .eq(
            "user_id",
            item.user_id,
          );

        if (baselineError) {
          throw new Error(
            `Unable to save alert baseline for ${item.symbol}: ${baselineError.message}`,
          );
        }

        continue;
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

    /*
     * Refresh research snapshots after candidate
     * evaluation and alert insertion.
     *
     * Confidence keeps its previous baseline until
     * the cumulative move reaches 5 points.
     */
    for (const item of watchlists) {
      const opportunity =
        opportunityMap.get(
          normalizeSymbol(
            item.symbol,
          ),
        );

      if (!opportunity) {
        continue;
      }

      const currentConfidence =
        typeof opportunity.confidence === "number" &&
        Number.isFinite(
          opportunity.confidence,
        )
          ? Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  opportunity.confidence,
                ),
              ),
            )
          : null;

      const currentDirection =
        typeof opportunity.direction === "string" &&
        opportunity.direction.trim()
          ? opportunity.direction
              .trim()
              .toUpperCase()
          : null;

      const currentOutlook =
        typeof opportunity.outlook === "string" &&
        opportunity.outlook.trim()
          ? opportunity.outlook
              .trim()
              .toUpperCase()
          : null;

      const currentRisk =
        typeof opportunity.risk === "string" &&
        opportunity.risk.trim()
          ? opportunity.risk
              .trim()
              .toUpperCase()
          : null;

      let nextConfidence =
        item.last_confidence ??
        currentConfidence;

      if (
        currentConfidence !== null &&
        item.last_confidence !== null &&
        item.last_confidence !== undefined &&
        Math.abs(
          currentConfidence -
            Number(
              item.last_confidence,
            ),
        ) >= 5
      ) {
        nextConfidence =
          currentConfidence;
      }

      const {
        error: snapshotError,
      } = await supabase
        .from("trading_watchlist")
        .update({
          last_confidence:
            nextConfidence,
          last_direction:
            currentDirection ??
            item.last_direction ??
            null,
          last_outlook:
            currentOutlook ??
            item.last_outlook ??
            null,
          last_risk:
            currentRisk ??
            item.last_risk ??
            null,
          last_research_checked_at:
            new Date().toISOString(),
        })
        .eq("id", item.id)
        .eq(
          "user_id",
          item.user_id,
        );

      if (snapshotError) {
        throw new Error(
          `Unable to update research snapshot for ${item.symbol}: ${snapshotError.message}`,
        );
      }
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

    await updateAlertEngineHealth({
  supabase,
  latestRunId: runId,
  latestRunStatus: "SUCCESS",
});

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

await updateAlertEngineHealth({
  supabase,
  latestRunId: runId,
  latestRunStatus: "FAILED",
});

    throw error;
  }
}
