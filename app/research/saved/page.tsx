"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type SavedResearch = {
  id: string;
  report_type:
    | "deep"
    | "council"
    | "compare";
  symbol_a?: string | null;
  symbol_b?: string | null;
  title?: string | null;
  result_json?: unknown;
  created_at?: string | null;
};

type SavedResponse = {
  ok?: boolean;
  reports?: SavedResearch[];
  error?: string;
};

function typeLabel(
  value: SavedResearch["report_type"],
) {
  if (value === "deep") {
    return "Deep Research";
  }

  if (value === "council") {
    return "Research Council";
  }

  return "Research Compare";
}

function typeHref(
  report: SavedResearch,
) {
  if (report.report_type === "deep") {
    return "/research/deep";
  }

  if (report.report_type === "council") {
    return "/research/council";
  }

  return "/research/compare";
}

function typeStyle(
  value: SavedResearch["report_type"],
) {
  if (value === "deep") {
    return "border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-100";
  }

  if (value === "council") {
    return "border-violet-300/15 bg-violet-300/[0.06] text-violet-100";
  }

  return "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-100";
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "Unknown date";
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
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

export default function SavedResearchPage() {
  const [
    reports,
    setReports,
  ] =
    useState<SavedResearch[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<string | null>(
      null,
    );

  const loadReports =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/research/saved",
              {
                cache:
                  "no-store",
              },
            );

          const data =
            (await response.json()) as SavedResponse;

          if (!response.ok) {
            setError(
              data.error ||
                "Could not load saved research.",
            );

            setReports([]);
            return;
          }

          setReports(
            data.reports ?? [],
          );
        } catch (
          requestError
        ) {
          console.error(
            "saved_research_load_failed",
            requestError,
          );

          setError(
            "Could not connect to Saved Research.",
          );

          setReports([]);
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  async function deleteReport(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Delete this saved research report?",
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response =
        await fetch(
          `/api/research/saved?id=${encodeURIComponent(
            id,
          )}`,
          {
            method:
              "DELETE",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Could not delete research.",
        );

        return;
      }

      setReports(
        (current) =>
          current.filter(
            (report) =>
              report.id !== id,
          ),
      );
    } catch (
      requestError
    ) {
      console.error(
        "saved_research_delete_failed",
        requestError,
      );

      setError(
        "Could not delete research.",
      );
    } finally {
      setDeletingId(null);
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

          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            Research Library
          </span>
        </div>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200/55">
            Saved Research
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            Your research library.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/45">
            Review saved Deep Research,
            Council, and Compare results
            associated with your Nestrova
            account.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/research/deep"
              className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2 text-xs font-bold text-cyan-100"
            >
              + Deep Research
            </Link>

            <Link
              href="/research/council"
              className="rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-4 py-2 text-xs font-bold text-violet-100"
            >
              + Research Council
            </Link>

            <Link
              href="/research/compare"
              className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-2 text-xs font-bold text-emerald-100"
            >
              + Research Compare
            </Link>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-[22px] border border-red-300/15 bg-red-300/[0.06] px-5 py-4 text-sm text-red-100/80">
            {error}

            <button
              type="button"
              onClick={() =>
                void loadReports()
              }
              className="ml-3 font-bold text-white underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.035]"
                />
              ),
            )}
          </div>
        )}

        {!loading &&
          reports.length === 0 &&
          !error && (
            <section className="rounded-[34px] border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl">
                ✦
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-[-0.035em]">
                No saved research yet.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/38">
                Generate a Deep Research,
                Research Council, or
                Research Compare result,
                then choose Save Research.
              </p>

              <Link
                href="/research/deep"
                className="mt-7 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black"
              >
                Start Deep Research
              </Link>
            </section>
          )}

        {!loading &&
          reports.length > 0 && (
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Research Archive
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                    {reports.length} saved{" "}
                    {reports.length === 1
                      ? "report"
                      : "reports"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void loadReports()
                  }
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/55 transition hover:text-white"
                >
                  Refresh
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {reports.map(
                  (report) => (
                    <article
                      key={report.id}
                      className="flex min-w-0 flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] ${typeStyle(
                            report.report_type,
                          )}`}
                        >
                          {typeLabel(
                            report.report_type,
                          )}
                        </span>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            report.id
                          }
                          onClick={() =>
                            void deleteReport(
                              report.id,
                            )
                          }
                          className="text-xs font-semibold text-white/25 transition hover:text-red-200 disabled:opacity-40"
                        >
                          {deletingId ===
                          report.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>

                      <h3 className="mt-5 break-words text-2xl font-black tracking-[-0.04em]">
                        {report.title ||
                          report.symbol_a ||
                          "Saved Research"}
                      </h3>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-[18px] border border-white/[0.07] bg-black/20 p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                            Primary
                          </p>

                          <p className="mt-2 text-lg font-black">
                            {report.symbol_a ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-[18px] border border-white/[0.07] bg-black/20 p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                            Secondary
                          </p>

                          <p className="mt-2 text-lg font-black">
                            {report.symbol_b ||
                              "—"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-xs text-white/28">
                        Saved{" "}
                        {formatDate(
                          report.created_at,
                        )}
                      </p>

                      <div className="mt-auto pt-6">
                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
                          <a
                            href={`/api/research/saved/${encodeURIComponent(
                              report.id,
                            )}/pdf`}
                            className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white/65 transition hover:bg-white/[0.09] hover:text-white"
                          >
                            Download PDF
                            <span>↓</span>
                          </a>

                          <Link
                            href={typeHref(
                              report,
                            )}
                            className="flex items-center justify-between text-sm font-semibold text-white/55 transition hover:text-white"
                          >
                            Run new analysis
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}
