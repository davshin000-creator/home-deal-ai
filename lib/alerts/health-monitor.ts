import type { SupabaseClient } from "@supabase/supabase-js";

const FAILURE_THRESHOLD = 3;

type AlertRunSummary = {
  id: string;
  status: "SUCCESS" | "FAILED";
  started_at: string;
  error_message: string | null;
};

type HealthMonitorInput = {
  supabase: SupabaseClient;
  latestRunId: string | null;
  latestRunStatus: "SUCCESS" | "FAILED";
};

async function resolveOpenFailureIncident(
  supabase: SupabaseClient,
  latestRunId: string | null,
) {
  const resolvedAt = new Date().toISOString();

  const { error } = await supabase
    .from("alert_system_incidents")
    .update({
      status: "RESOLVED",
      resolved_at: resolvedAt,
      latest_run_id: latestRunId,
      last_detected_at: resolvedAt,
      metadata: {
        recovery_run_id: latestRunId,
        recovery_time: resolvedAt,
      },
    })
    .eq("incident_key", "alert-engine-consecutive-failures")
    .eq("status", "OPEN");

  if (error) {
    throw new Error(
      `Unable to resolve Alert Engine incident: ${error.message}`,
    );
  }
}

async function evaluateConsecutiveFailures(
  supabase: SupabaseClient,
  latestRunId: string | null,
) {
  const { data, error } = await supabase
    .from("alert_engine_runs")
    .select(
      `
        id,
        status,
        started_at,
        error_message
      `,
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(FAILURE_THRESHOLD);

  if (error) {
    throw new Error(
      `Unable to read Alert Engine run history: ${error.message}`,
    );
  }

  const recentRuns = (data ?? []) as AlertRunSummary[];

  if (recentRuns.length < FAILURE_THRESHOLD) {
    return;
  }

  const allFailed = recentRuns.every(
    (run) => run.status === "FAILED",
  );

  if (!allFailed) {
    return;
  }

  const now = new Date().toISOString();

  const failureMessages = recentRuns
    .map((run) => run.error_message)
    .filter(Boolean);

  const { data: existingIncident, error: existingError } =
    await supabase
      .from("alert_system_incidents")
      .select("id")
      .eq(
        "incident_key",
        "alert-engine-consecutive-failures",
      )
      .eq("status", "OPEN")
      .maybeSingle();

  if (existingError) {
    throw new Error(
      `Unable to inspect existing incident: ${existingError.message}`,
    );
  }

  if (existingIncident) {
    const { error: updateError } = await supabase
      .from("alert_system_incidents")
      .update({
        severity: "CRITICAL",
        failure_count: recentRuns.length,
        last_detected_at: now,
        latest_run_id: latestRunId,
        message:
          "The Nestrova Alert Engine has failed during at least three consecutive evaluations.",
        metadata: {
          recent_run_ids: recentRuns.map((run) => run.id),
          recent_errors: failureMessages,
        },
      })
      .eq("id", existingIncident.id);

    if (updateError) {
      throw new Error(
        `Unable to update Alert Engine incident: ${updateError.message}`,
      );
    }

    return;
  }

  const { error: insertError } = await supabase
    .from("alert_system_incidents")
    .insert({
      incident_key: "alert-engine-consecutive-failures",
      incident_type: "CONSECUTIVE_FAILURES",
      status: "OPEN",
      severity: "CRITICAL",
      title: "Alert Engine requires attention",
      message:
        "The Nestrova Alert Engine has failed during three consecutive evaluations. Review the execution history and VPS service logs.",
      failure_count: recentRuns.length,
      first_detected_at: now,
      last_detected_at: now,
      latest_run_id: latestRunId,
      metadata: {
        threshold: FAILURE_THRESHOLD,
        recent_run_ids: recentRuns.map((run) => run.id),
        recent_errors: failureMessages,
      },
    });

  if (insertError && insertError.code !== "23505") {
    throw new Error(
      `Unable to create Alert Engine incident: ${insertError.message}`,
    );
  }
}

export async function updateAlertEngineHealth({
  supabase,
  latestRunId,
  latestRunStatus,
}: HealthMonitorInput) {
  try {
    if (latestRunStatus === "SUCCESS") {
      await resolveOpenFailureIncident(
        supabase,
        latestRunId,
      );

      return;
    }

    await evaluateConsecutiveFailures(
      supabase,
      latestRunId,
    );
  } catch (error) {
    console.error(
      "alert_engine_health_monitor_error",
      error,
    );
  }
}
