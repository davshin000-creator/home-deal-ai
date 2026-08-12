"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type HistoryItem = {
  id: string;
  symbol: string;
  confidence?: number | null;
  risk?: string | null;
  research_style?: string | null;
  research_version?: string | null;
  evidence_count?: number | null;
  captured_at?: string | null;
};

type HistoryResponse = {
  ok?: boolean;
  symbol?: string;
  history?: HistoryItem[];
  error?: string;
};

function cleanLabel(
  value?: string | null,
) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function formatDate(
  value?: string | null,
) {
  if (!value) return "Unknown";

  return new Date(
    value,
  ).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

export default function ResearchHistoryPage() {
  const params =
    useParams<{
      symbol: string;
    }>();

  const symbol =
    decodeURIComponent(
      params.symbol ?? "",
    ).toUpperCase();

  const [
    history,
    setHistory,
  ] =
    useState<HistoryItem[]>(
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

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const response =
          await fetch(
            `/api/research/history?symbol=${encodeURIComponent(
              symbol,
            )}`,
            {
              cache:
                "no-store",
            },
          );

        const data =
          (await response.json()) as HistoryResponse;

        if (!response.ok) {
          setError(
            data.error ||
              "Could not load Research History.",
          );

          return;
        }

        setHistory(
          data.history ?? [],
        );
      } catch {
        setError(
          "Could not connect to Research History.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (symbol) {
      void load();
    }
  }, [symbol]);

  const latest =
    history[
      history.length - 1
    ];

  const first =
    history[0];

  const confidenceChange =
    latest?.confidence != null &&
    first?.confidence != null
      ? latest.confidence -
        first.confidence
      : null;

  const chartPoints =
    useMemo(() => {
      if (
        history.length === 0
      ) {
        return "";
      }

      const width = 800;
      const height = 220;

      return history
        .map(
          (
            item,
            index,
          ) => {
            const x =
              history.length ===
              1
                ? width / 2
                : (index /
                    (history.length -
                      1)) *
                  width;

            const confidence =
              Math.max(
                0,
                Math.min(
                  100,
                  Number(
                    item.confidence ??
                      0,
                  ),
                ),
              );

            const y =
              height -
              (confidence /
                100) *
                height;

            return `${x},${y}`;
          },
        )
        .join(" ");
    }, [history]);

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-10">
        <Link
          href="/research/watch"
          className="text-sm font-semibold text-white/40 transition hover:text-white"
        >
          ← Research Watch
        </Link>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200/55">
            Research Evolution
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            {symbol} History
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/45">
            Follow how Nestrova&apos;s
            public research confidence,
            risk, style, and engine state
            have changed over time.
          </p>
        </section>

        {loading && (
          <div className="h-80 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.035]" />
        )}

        {error && (
          <div className="rounded-[22px] border border-red-300/15 bg-red-300/[0.06] p-5 text-sm text-red-100/80">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          history.length === 0 && (
            <section className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
              <h2 className="text-2xl font-black">
                No history yet.
              </h2>

              <p className="mt-3 text-sm text-white/38">
                Refresh Research Watch
                over time to begin building
                a history for {symbol}.
              </p>
            </section>
          )}

        {!loading &&
          history.length > 0 && (
            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [
                    "Snapshots",
                    history.length,
                  ],
                  [
                    "Current Confidence",
                    `${latest?.confidence ?? 0}%`,
                  ],
                  [
                    "Total Change",
                    confidenceChange ===
                    null
                      ? "—"
                      : `${confidenceChange > 0 ? "+" : ""}${confidenceChange}`,
                  ],
                  [
                    "Current Risk",
                    cleanLabel(
                      latest?.risk,
                    ),
                  ],
                ].map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
                        {label}
                      </p>

                      <p className="mt-3 text-2xl font-black">
                        {value}
                      </p>
                    </div>
                  ),
                )}
              </section>

              <section className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Confidence Timeline
                </p>

                <div className="mt-6 overflow-hidden rounded-[22px] border border-white/[0.06] bg-black/20 p-4">
                  <svg
                    viewBox="0 0 800 220"
                    className="h-[220px] w-full"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={
                        chartPoints
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      className="text-violet-300"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Research Timeline
                </p>

                <div className="mt-5 space-y-3">
                  {[...history]
                    .reverse()
                    .map(
                      (
                        item,
                        index,
                      ) => (
                        <article
                          key={item.id}
                          className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
                        >
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs text-white/28">
                                {formatDate(
                                  item.captured_at,
                                )}
                              </p>

                              <p className="mt-2 text-3xl font-black">
                                {item.confidence ??
                                  0}
                                %
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="rounded-[16px] border border-white/[0.07] bg-black/20 px-4 py-3">
                                <p className="text-[9px] uppercase text-white/25">
                                  Risk
                                </p>

                                <p className="mt-1 text-sm font-bold">
                                  {cleanLabel(
                                    item.risk,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-[16px] border border-white/[0.07] bg-black/20 px-4 py-3">
                                <p className="text-[9px] uppercase text-white/25">
                                  Style
                                </p>

                                <p className="mt-1 text-sm font-bold">
                                  {cleanLabel(
                                    item.research_style,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-[16px] border border-white/[0.07] bg-black/20 px-4 py-3">
                                <p className="text-[9px] uppercase text-white/25">
                                  Evidence
                                </p>

                                <p className="mt-1 text-sm font-bold">
                                  {item.evidence_count ??
                                    0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      ),
                    )}
                </div>
              </section>
            </div>
          )}
      </div>
    </main>
  );
}
