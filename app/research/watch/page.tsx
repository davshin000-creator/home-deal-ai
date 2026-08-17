"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

type WatchItem = {
  id: string;
  symbol: string;

  created_at?: string | null;

  last_confidence?: number | null;
  last_risk?: string | null;
  last_research_style?: string | null;
  last_research_version?: string | null;
  last_checked_at?: string | null;

  current?: {
    confidence?: number | null;
    risk?: string | null;
    research_style?: string | null;
    research_version?: string | null;
    reasons?: string[];
  } | null;

  changes?: {
    confidence?: number | null;
    risk_changed?: boolean;
    style_changed?: boolean;
    version_changed?: boolean;
  };
};

type WatchResponse = {
  ok?: boolean;
  watches?: WatchItem[];
  error?: string;
  code?: string;
};

function cleanLabel(
  value?: string | null,
) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function confidenceChangeLabel(
  value?: number | null,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "No baseline";
  }

  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function confidenceChangeStyle(
  value?: number | null,
) {
  if (
    value === null ||
    value === undefined ||
    value === 0
  ) {
    return "border-white/10 bg-white/[0.04] text-white/45";
  }

  if (value > 0) {
    return "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-100";
  }

  return "border-red-300/15 bg-red-300/[0.06] text-red-100";
}

export default function ResearchWatchPage() {
  const [
    watches,
    setWatches,
  ] = useState<WatchItem[]>([]);

  const [
    symbol,
    setSymbol,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    adding,
    setAdding,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] =
    useState<string | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const loadWatches =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              "/api/research/watch",
              {
                cache:
                  "no-store",
              },
            );

          const data =
            (await response.json()) as WatchResponse;

          if (!response.ok) {
            setError(
              data.error ||
                "Could not load Research Watch.",
            );

            setWatches([]);
            return;
          }

          setWatches(
            data.watches ?? [],
          );
        } catch (
          requestError
        ) {
          console.error(
            "research_watch_load_failed",
            requestError,
          );

          setError(
            "Could not connect to Research Watch.",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadWatches();
  }, [loadWatches]);

  async function addWatch(
    event: FormEvent,
  ) {
    event.preventDefault();

    const normalized =
      symbol
        .trim()
        .toUpperCase();

    if (!normalized) {
      setError(
        "Enter a symbol to watch.",
      );

      return;
    }

    setAdding(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/research/watch",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                symbol:
                  normalized,
              }),
          },
        );

      const data =
        (await response.json()) as WatchResponse;

      if (!response.ok) {
        setError(
          data.error ||
            "Could not add Research Watch.",
        );

        return;
      }

      setSymbol("");

      setMessage(
        `${normalized} added to Research Watch.`,
      );

      await loadWatches();
    } catch (
      requestError
    ) {
      console.error(
        "research_watch_add_failed",
        requestError,
      );

      setError(
        "Could not add Research Watch.",
      );
    } finally {
      setAdding(false);
    }
  }

  async function removeWatch(
    symbolToDelete: string,
  ) {
    const confirmed =
      window.confirm(
        `Remove ${symbolToDelete} from Research Watch?`,
      );

    if (!confirmed) {
      return;
    }

    setDeleting(
      symbolToDelete,
    );

    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          `/api/research/watch?symbol=${encodeURIComponent(
            symbolToDelete,
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
            "Could not remove Research Watch.",
        );

        return;
      }

      setWatches(
        (current) =>
          current.filter(
            (item) =>
              item.symbol !==
              symbolToDelete,
          ),
      );

      setMessage(
        `${symbolToDelete} removed.`,
      );
    } catch (
      requestError
    ) {
      console.error(
        "research_watch_remove_failed",
        requestError,
      );

      setError(
        "Could not remove Research Watch.",
      );
    } finally {
      setDeleting(null);
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

          <span className="rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
            Pro · Live Tracking
          </span>
        </div>

        <section className="pb-10 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200/55">
            Continuous Research
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
            Research Watch
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/45">
            Track changes in Nestrova
            confidence, risk, research
            style, and research-engine
            versions for subjects you
            care about.
          </p>
        </section>

        <form
          onSubmit={addWatch}
          className="rounded-[30px] border border-white/10 bg-white/[0.04] p-3"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={symbol}
              onChange={(event) =>
                setSymbol(
                  event.target.value,
                )
              }
              placeholder="Add symbol — NVDA, BTC, AAPL..."
              autoComplete="off"
              className="min-h-14 min-w-0 flex-1 rounded-[20px] border border-white/10 bg-black/40 px-5 text-base font-semibold uppercase outline-none placeholder:normal-case placeholder:text-white/25 focus:border-violet-300/30"
            />

            <button
              type="submit"
              disabled={adding}
              className="min-h-14 rounded-[20px] bg-white px-7 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {adding
                ? "Adding..."
                : "Add to Watch"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-white/25">
            <span>
              Pro limit: 20 symbols
            </span>

            <span>
              {watches.length}/20
            </span>
          </div>
        </form>

        {error && (
          <div className="mt-5 rounded-[22px] border border-red-300/15 bg-red-300/[0.06] px-5 py-4 text-sm text-red-100/80">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-[22px] border border-emerald-300/15 bg-emerald-300/[0.05] px-5 py-4 text-sm text-emerald-100/70">
            {message}
          </div>
        )}

        {loading && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.035]"
                />
              ),
            )}
          </div>
        )}

        {!loading &&
          watches.length === 0 &&
          !error && (
            <section className="mt-8 rounded-[34px] border border-dashed border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl">
                ◎
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-[-0.035em]">
                Nothing on watch yet.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/38">
                Add a symbol and Nestrova
                will compare the current
                public research state with
                the state captured when the
                watch was created.
              </p>
            </section>
          )}

        {!loading &&
          watches.length > 0 && (
            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Active Watch
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                    Current changes.
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void loadWatches()
                  }
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/55 transition hover:text-white"
                >
                  Refresh Intelligence
                </button>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {watches.map(
                  (watch) => {
                    const hasCurrentResearch =
                      Boolean(
                        watch.current,
                      );

                    const confidence =
                      watch.current
                        ?.confidence ??
                      watch.last_confidence ??
                      0;

                    const delta =
                      watch.changes
                        ?.confidence;

                    const changeDetected =
                      Boolean(
                        delta ||
                          watch
                            .changes
                            ?.risk_changed ||
                          watch
                            .changes
                            ?.style_changed ||
                          watch
                            .changes
                            ?.version_changed,
                      );

                    return (
                      <article
                        key={watch.id}
                        className="flex min-w-0 flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-violet-200/50">
                              Research Watch
                            </p>

                            <h3 className="mt-2 text-4xl font-black tracking-[-0.05em]">
                              {watch.symbol}
                            </h3>
                          </div>

                          <span
                            className={
                              !hasCurrentResearch
                                ? "rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] text-violet-100"
                                : changeDetected
                                  ? "rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] text-amber-100"
                                  : "rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] text-emerald-100"
                            }
                          >
                            {!hasCurrentResearch
                              ? "Awaiting Research"
                              : changeDetected
                                ? "Change Detected"
                                : "Stable"}
                          </span>
                        </div>

                        {!hasCurrentResearch ? (
                          <div className="mt-6 flex flex-1 flex-col justify-center rounded-[24px] border border-violet-300/10 bg-violet-300/[0.035] p-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/55">
                              Awaiting Research
                            </p>

                            <p className="mt-3 text-base font-bold text-white/75">
                              No current public research evidence yet.
                            </p>

                            <p className="mt-3 text-sm leading-6 text-white/35">
                              This symbol is supported by Nestrova and remains on your watch list. Confidence, risk, research style, and engine details will appear automatically when current public research evidence becomes available.
                            </p>
                          </div>
                        ) : (
                          <>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <div className="rounded-[19px] border border-white/[0.07] bg-black/20 p-4">
                            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/28">
                              Confidence
                            </p>

                            <p className="mt-2 text-2xl font-black">
                              {confidence}%
                            </p>
                          </div>

                          <div
                            className={`rounded-[19px] border p-4 ${confidenceChangeStyle(
                              delta,
                            )}`}
                          >
                            <p className="text-[9px] font-bold uppercase tracking-[0.13em] opacity-60">
                              Change
                            </p>

                            <p className="mt-2 text-2xl font-black">
                              {confidenceChangeLabel(
                                delta,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm">
                            <span className="text-white/32">
                              Risk
                            </span>

                            <div className="text-right">
                              <span className="font-bold">
                                {cleanLabel(
                                  watch.current
                                    ?.risk ??
                                    watch.last_risk,
                                )}
                              </span>

                              {watch
                                .changes
                                ?.risk_changed && (
                                <p className="mt-1 text-[10px] font-bold uppercase text-amber-200/60">
                                  Changed
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm">
                            <span className="text-white/32">
                              Research Style
                            </span>

                            <div className="max-w-[65%] text-right">
                              <span className="break-words font-bold">
                                {cleanLabel(
                                  watch.current
                                    ?.research_style ??
                                    watch.last_research_style,
                                )}
                              </span>

                              {watch
                                .changes
                                ?.style_changed && (
                                <p className="mt-1 text-[10px] font-bold uppercase text-amber-200/60">
                                  Changed
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-white/32">
                              Engine
                            </span>

                            <div className="max-w-[65%] text-right">
                              <span className="break-words font-bold">
                                {watch.current
                                  ?.research_version ??
                                  watch.last_research_version ??
                                  "Unknown"}
                              </span>

                              {watch
                                .changes
                                ?.version_changed && (
                                <p className="mt-1 text-[10px] font-bold uppercase text-amber-200/60">
                                  Changed
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                          </>
                        )}

                        {watch.current
                          ?.reasons &&
                          watch.current
                            .reasons.length >
                            0 && (
                            <div className="mt-5 rounded-[20px] border border-white/[0.07] bg-black/20 p-4">
                              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/25">
                                Current Evidence
                              </p>

                              <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/40">
                                {
                                  watch
                                    .current
                                    .reasons[0]
                                }
                              </p>
                            </div>
                          )}

                        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={`/research/history/${encodeURIComponent(
                                watch.symbol,
                              )}`}
                              className="text-xs font-bold text-violet-100/60 transition hover:text-white"
                            >
                              View History
                            </Link>

                            <Link
                              href="/research/deep"
                              className="text-xs font-bold text-white/50 transition hover:text-white"
                            >
                              Deep Research →
                            </Link>
                          </div>

                          <button
                            type="button"
                            disabled={
                              deleting ===
                              watch.symbol
                            }
                            onClick={() =>
                              void removeWatch(
                                watch.symbol,
                              )
                            }
                            className="text-xs font-semibold text-white/25 transition hover:text-red-200 disabled:opacity-40"
                          >
                            {deleting ===
                            watch.symbol
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          )}
      </div>
    </main>
  );
}
