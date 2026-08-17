"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ResearchAlert = {
  id: string;
  symbol: string;
  alert_type: string;
  title: string;
  message: string;
  previous_value?: string | null;
  current_value?: string | null;
  is_read: boolean;
  created_at?: string | null;
};

type AlertsResponse = {
  ok?: boolean;
  alerts?: ResearchAlert[];
  watch_subject_count?: number;
  error?: string;
};

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "Unknown";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

function alertLabel(
  type: string,
) {
  if (
    type ===
    "RESEARCH_AVAILABLE"
  ) {
    return "Research Available";
  }

  if (
    type ===
    "CONFIDENCE_CHANGE"
  ) {
    return "Confidence";
  }

  if (
    type ===
    "RISK_CHANGE"
  ) {
    return "Risk";
  }

  if (
    type ===
    "STYLE_CHANGE"
  ) {
    return "Research Style";
  }

  if (
    type ===
    "VERSION_CHANGE"
  ) {
    return "Research Engine";
  }

  return "Research Alert";
}

function alertStyle(
  type: string,
) {
  if (
    type ===
    "RESEARCH_AVAILABLE"
  ) {
    return "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-100";
  }

  if (
    type ===
    "CONFIDENCE_CHANGE"
  ) {
    return "border-cyan-300/15 bg-cyan-300/[0.055] text-cyan-100";
  }

  if (
    type ===
    "RISK_CHANGE"
  ) {
    return "border-amber-300/15 bg-amber-300/[0.055] text-amber-100";
  }

  if (
    type ===
    "STYLE_CHANGE"
  ) {
    return "border-violet-300/15 bg-violet-300/[0.055] text-violet-100";
  }

  return "border-emerald-300/15 bg-emerald-300/[0.055] text-emerald-100";
}

export default function ResearchAlertsPage() {
  const [
    alerts,
    setAlerts,
  ] =
    useState<ResearchAlert[]>(
      [],
    );

  const [
    watchSubjectCount,
    setWatchSubjectCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updatingId,
    setUpdatingId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    markingAll,
    setMarkingAll,
  ] = useState(false);

  const loadAlerts =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/research/alerts",
              {
                cache:
                  "no-store",
              },
            );

          const data =
            (await response.json()) as AlertsResponse;

          if (!response.ok) {
            setError(
              data.error ||
                "Could not load Research Alerts.",
            );

            setAlerts([]);
            return;
          }

          setAlerts(
            data.alerts ?? [],
          );

          setWatchSubjectCount(
            data.watch_subject_count ?? 0,
          );
        } catch (
          requestError
        ) {
          console.error(
            "research_alerts_load_failed",
            requestError,
          );

          setError(
            "Could not connect to Research Alerts.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  const unreadCount =
    useMemo(
      () =>
        alerts.filter(
          (alert) =>
            !alert.is_read,
        ).length,
      [alerts],
    );

  async function markRead(
    id: string,
  ) {
    setUpdatingId(id);
    setError("");

    try {
      const response =
        await fetch(
          "/api/research/alerts",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                id,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Could not update alert.",
        );

        return;
      }

      setAlerts(
        (current) =>
          current.map(
            (alert) =>
              alert.id === id
                ? {
                    ...alert,
                    is_read: true,
                  }
                : alert,
          ),
      );
    } catch (
      requestError
    ) {
      console.error(
        "research_alert_read_failed",
        requestError,
      );

      setError(
        "Could not update alert.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function markAllRead() {
    if (
      unreadCount === 0
    ) {
      return;
    }

    setMarkingAll(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/research/alerts",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                all: true,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Could not update alerts.",
        );

        return;
      }

      setAlerts(
        (current) =>
          current.map(
            (alert) => ({
              ...alert,
              is_read: true,
            }),
          ),
      );
    } catch (
      requestError
    ) {
      console.error(
        "research_alert_mark_all_failed",
        requestError,
      );

      setError(
        "Could not update alerts.",
      );
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/research"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            ← Research
          </Link>

          <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
            Pro · Change Alerts
          </span>
        </div>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200/55">
            Research Monitoring
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            Research Alerts
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/45">
            Review meaningful changes
            detected across your Research
            Watch subjects.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                Total Alerts
              </p>

              <p className="mt-3 text-3xl font-black">
                {alerts.length}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                Unread
              </p>

              <p className="mt-3 text-3xl font-black">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                Watch Subjects
              </p>

              <p className="mt-3 text-3xl font-black">
                {watchSubjectCount}
              </p>
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/research/watch"
              className="rounded-full border border-violet-300/15 bg-violet-300/[0.05] px-4 py-2 text-xs font-bold text-violet-100/70"
            >
              Research Watch
            </Link>

            <button
              type="button"
              onClick={() =>
                void loadAlerts()
              }
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/50 transition hover:text-white"
            >
              Refresh
            </button>
          </div>

          <button
            type="button"
            disabled={
              markingAll ||
              unreadCount === 0
            }
            onClick={() =>
              void markAllRead()
            }
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-neutral-200 disabled:opacity-40"
          >
            {markingAll
              ? "Updating..."
              : "Mark all read"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-[22px] border border-red-300/15 bg-red-300/[0.06] px-5 py-4 text-sm text-red-100/80">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.035]"
                />
              ),
            )}
          </div>
        )}

        {!loading &&
          alerts.length === 0 &&
          !error && (
            <section className="rounded-[34px] border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl">
                ◇
              </div>

              <h2 className="mt-6 text-2xl font-black">
                No research alerts yet.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/38">
                Alerts appear when watched
                research subjects experience
                meaningful confidence, risk,
                style, or engine changes.
              </p>
            </section>
          )}

        {!loading &&
          alerts.length > 0 && (
            <section className="space-y-4">
              {alerts.map(
                (alert) => (
                  <article
                    key={alert.id}
                    className={`rounded-[28px] border p-6 transition ${
                      alert.is_read
                        ? "border-white/[0.07] bg-white/[0.025]"
                        : "border-white/10 bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] ${alertStyle(
                              alert.alert_type,
                            )}`}
                          >
                            {alertLabel(
                              alert.alert_type,
                            )}
                          </span>

                          {!alert.is_read && (
                            <span className="rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/70">
                              New
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-2xl font-black tracking-[-0.035em]">
                          {alert.title}
                        </h2>

                        <p className="mt-3 max-w-4xl text-sm leading-7 text-white/50">
                          {alert.message}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-black">
                          {alert.symbol}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {formatDate(
                            alert.created_at,
                          )}
                        </p>
                      </div>
                    </div>

                    {(alert.previous_value ||
                      alert.current_value) && (
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="rounded-[16px] border border-white/[0.07] bg-black/20 px-4 py-3">
                          <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
                            Previous
                          </p>

                          <p className="mt-1 text-sm font-bold">
                            {alert.previous_value ||
                              "—"}
                          </p>
                        </div>

                        <span className="text-white/20">
                          →
                        </span>

                        <div className="rounded-[16px] border border-white/[0.07] bg-black/20 px-4 py-3">
                          <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
                            Current
                          </p>

                          <p className="mt-1 text-sm font-bold">
                            {alert.current_value ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                      <Link
                        href={`/research/history/${encodeURIComponent(
                          alert.symbol,
                        )}`}
                        className="text-xs font-bold text-violet-100/60 transition hover:text-white"
                      >
                        View Research History →
                      </Link>

                      {!alert.is_read && (
                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            alert.id
                          }
                          onClick={() =>
                            void markRead(
                              alert.id,
                            )
                          }
                          className="text-xs font-bold text-white/40 transition hover:text-white disabled:opacity-40"
                        >
                          {updatingId ===
                          alert.id
                            ? "Updating..."
                            : "Mark read"}
                        </button>
                      )}
                    </div>
                  </article>
                ),
              )}
            </section>
          )}
      </div>
    </main>
  );
}
