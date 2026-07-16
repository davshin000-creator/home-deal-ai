import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AlertRun = {
  id: string;
  status: "SUCCESS" | "FAILED";
  started_at: string;
  completed_at: string | null;
  evaluated_watchlists: number;
  matched_assets: number;
  candidate_alerts: number;
  inserted_alerts: number;
  skipped_duplicates: number;
  source_generated_at: string | null;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
};

type SystemIncident = {
  id: string;
  incident_type: string;
  status: "OPEN" | "RESOLVED";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  failure_count: number;
  first_detected_at: string;
  last_detected_at: string;
  resolved_at: string | null;
  created_at: string;
};

function parseAdminEmails() {
  return new Set(
    String(
      process.env.NESTROVA_ADMIN_EMAILS ??
        "",
    )
      .split(",")
      .map((email) =>
        email.trim().toLowerCase(),
      )
      .filter(Boolean),
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Unavailable";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "medium",
    },
  ).format(parsed);
}

function formatDuration(
  value?: number | null,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  return `${(value / 1000).toFixed(2)} s`;
}

function statusClasses(status: string) {
  if (status === "SUCCESS") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  return "border-red-400/20 bg-red-400/10 text-red-200";
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-white/38">
        {detail}
      </p>
    </article>
  );
}

export default async function AlertOperationsPage() {
  const userClient =
    await createSupabaseServerClient();

  const { data: authData } =
    await userClient.auth.getUser();

  if (!authData.user) {
    redirect(
      "/login?next=/admin/alert-operations",
    );
  }

  const adminEmails = parseAdminEmails();
  const currentEmail =
    authData.user.email
      ?.trim()
      .toLowerCase() ?? "";

  if (
    !currentEmail ||
    !adminEmails.has(currentEmail)
  ) {
    redirect("/dashboard");
  }

  const adminClient =
    createSupabaseAdminClient();

  const { data, error } =
    await adminClient
      .from("alert_engine_runs")
      .select(
        `
          id,
          status,
          started_at,
          completed_at,
          evaluated_watchlists,
          matched_assets,
          candidate_alerts,
          inserted_alerts,
          skipped_duplicates,
          source_generated_at,
          duration_ms,
          error_message,
          created_at
        `,
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(100);

  const runs = (data ?? []) as AlertRun[];

const {
  data: incidentData,
  error: incidentError,
} = await adminClient
  .from("alert_system_incidents")
  .select(
    `
      id,
      incident_type,
      status,
      severity,
      title,
      message,
      failure_count,
      first_detected_at,
      last_detected_at,
      resolved_at,
      created_at
    `,
  )
  .order("created_at", {
    ascending: false,
  })
  .limit(20);

const incidents =
  (incidentData ?? []) as SystemIncident[];

const openIncidents = incidents.filter(
  (incident) => incident.status === "OPEN",
);

const latest = runs[0] ?? null;

  const successCount = runs.filter(
    (run) => run.status === "SUCCESS",
  ).length;

  const failureCount = runs.filter(
    (run) => run.status === "FAILED",
  ).length;

  const totalInserted =
    runs.reduce(
      (sum, run) =>
        sum + run.inserted_alerts,
      0,
    );

  const recentFailures = runs
    .filter(
      (run) => run.status === "FAILED",
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-320px] top-20 h-[800px] w-[800px] rounded-full bg-emerald-400/[0.07] blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
              N
            </div>

            <div>
              <p className="text-sm font-semibold">
                Nestrova Admin
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Alert Operations
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/notifications"
              className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              Notifications
            </Link>

            <Link
              href="/dashboard"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1480px] px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-cyan-300/70">
          Operations Monitor
        </p>

        <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
          Alert Engine health and execution history.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
          Monitor automated evaluations, generated alerts,
          duplicate protection, execution duration, and failures
          without exposing user Watchlists or private Trading OS data.
        </p>

        {error ? (
          <div className="mt-8 rounded-[28px] border border-red-400/20 bg-red-400/10 p-6 text-red-200">
            Operations data could not be loaded: {error.message}
          </div>
        ) : null}

{incidentError ? (
  <div className="mt-4 rounded-[28px] border border-red-400/20 bg-red-400/10 p-6 text-red-200">
    Health Incident data could not be loaded:{" "}
    {incidentError.message}
  </div>
) : null}

      </section>

{openIncidents.length > 0 ? (
  <section className="relative mx-auto max-w-[1480px] px-5 py-5 md:px-8">
    <div className="overflow-hidden rounded-[38px] border border-red-400/25 bg-red-400/[0.08] p-7 shadow-[0_0_90px_rgba(248,113,113,0.08)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-red-200">
              System Incident
            </span>

            <span className="h-2 w-2 animate-pulse rounded-full bg-red-300 shadow-[0_0_16px_rgba(252,165,165,0.9)]" />

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-red-100/45">
              {openIncidents[0].severity}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.055em] text-red-50 md:text-4xl">
            {openIncidents[0].title}
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-red-100/65">
            {openIncidents[0].message}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-red-100/40">
            <span>
              First detected:{" "}
              {formatDate(
                openIncidents[0].first_detected_at,
              )}
            </span>

            <span aria-hidden="true">•</span>

            <span>
              Last detected:{" "}
              {formatDate(
                openIncidents[0].last_detected_at,
              )}
            </span>
          </div>
        </div>

        <div className="shrink-0 rounded-[26px] border border-red-300/15 bg-black/20 p-5 xl:min-w-[220px]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-red-100/40">
            Consecutive Failures
          </p>

          <p className="mt-2 text-4xl font-semibold text-red-100">
            {openIncidents[0].failure_count}
          </p>

          <p className="mt-3 text-xs leading-5 text-red-100/40">
            Review execution history and VPS service logs.
          </p>
        </div>
      </div>
    </div>
  </section>
) : null}

      <section className="relative mx-auto grid max-w-[1480px] gap-5 px-5 py-8 sm:grid-cols-2 md:px-8 xl:grid-cols-4">
        <Metric
          label="Latest Status"
          value={latest?.status ?? "No Runs"}
          detail={
            latest
              ? formatDate(latest.completed_at)
              : "Run the Alert Engine to create the first record."
          }
        />

        <Metric
          label="Successful Runs"
          value={String(successCount)}
          detail={`Across the latest ${runs.length} retained execution records.`}
        />

        <Metric
          label="Failed Runs"
          value={String(failureCount)}
          detail="Review recent failures below when this value is above zero."
        />

        <Metric
          label="Alerts Inserted"
          value={String(totalInserted)}
          detail="Notifications generated across the displayed run history."
        />
      </section>

      {latest ? (
        <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
          <article className="rounded-[42px] border border-white/10 bg-white/[0.055] p-7 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  Latest Execution
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
                  {formatDate(latest.started_at)}
                </h2>
              </div>

              <span
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${statusClasses(
                  latest.status,
                )}`}
              >
                {latest.status}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {[
                [
                  "Watchlists",
                  latest.evaluated_watchlists,
                ],
                [
                  "Matched",
                  latest.matched_assets,
                ],
                [
                  "Candidates",
                  latest.candidate_alerts,
                ],
                [
                  "Inserted",
                  latest.inserted_alerts,
                ],
                [
                  "Duplicates",
                  latest.skipped_duplicates,
                ],
                [
                  "Duration",
                  formatDuration(
                    latest.duration_ms,
                  ),
                ],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-[24px] border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/28">
                    {label}
                  </p>

                  <p className="mt-3 text-2xl font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {latest.error_message ? (
              <div className="mt-6 rounded-[24px] border border-red-400/20 bg-red-400/10 p-5 text-sm leading-7 text-red-100/70">
                {latest.error_message}
              </div>
            ) : null}
          </article>
        </section>
      ) : null}

      {recentFailures.length > 0 ? (
        <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300/70">
              Recent Failures
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
              Failures requiring review.
            </h2>
          </div>

          <div className="mt-7 grid gap-4">
            {recentFailures.map((run) => (
              <article
                key={run.id}
                className="rounded-[30px] border border-red-400/15 bg-red-400/[0.06] p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-red-100">
                      {formatDate(
                        run.started_at,
                      )}
                    </p>

                    <p className="mt-3 text-sm leading-7 text-red-100/60">
                      {run.error_message ??
                        "Unknown failure."}
                    </p>
                  </div>

                  <p className="text-xs text-red-100/40">
                    {formatDuration(
                      run.duration_ms,
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="relative mx-auto max-w-[1480px] px-5 py-10 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Execution History
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
            Latest automated evaluations.
          </h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045]">
          <div className="hidden grid-cols-[1.3fr_0.7fr_repeat(5,0.65fr)] gap-4 border-b border-white/10 px-6 py-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/28 xl:grid">
            <p>Started</p>
            <p>Status</p>
            <p>Watchlists</p>
            <p>Matched</p>
            <p>Candidates</p>
            <p>Inserted</p>
            <p>Duration</p>
          </div>

          {runs.length > 0 ? (
            runs.map((run) => (
              <article
                key={run.id}
                className="grid gap-3 border-b border-white/10 px-6 py-5 last:border-b-0 xl:grid-cols-[1.3fr_0.7fr_repeat(5,0.65fr)] xl:items-center xl:gap-4"
              >
                <p className="text-sm text-white/65">
                  {formatDate(run.started_at)}
                </p>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-[10px] font-bold ${statusClasses(
                    run.status,
                  )}`}
                >
                  {run.status}
                </span>

                <p className="text-sm text-white/45">
                  {run.evaluated_watchlists}
                </p>

                <p className="text-sm text-white/45">
                  {run.matched_assets}
                </p>

                <p className="text-sm text-white/45">
                  {run.candidate_alerts}
                </p>

                <p className="text-sm text-white/45">
                  {run.inserted_alerts}
                </p>

                <p className="text-sm text-white/45">
                  {formatDuration(
                    run.duration_ms,
                  )}
                </p>
              </article>
            ))
          ) : (
            <div className="p-8 text-sm text-white/42">
              No Alert Engine executions have been recorded yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
