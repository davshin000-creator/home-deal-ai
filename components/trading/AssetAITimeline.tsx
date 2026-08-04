"use client";

import { useEffect, useMemo, useState } from "react";

type ActivityCategory =
  | "score"
  | "confidence"
  | "risk"
  | "regime";

type ActivityEvent = {
  id: string;
  symbol: string;
  assetType: string;
  category: ActivityCategory;
  previousValue: string | number;
  currentValue: string | number;
  createdAt: number;
};

type AssetAITimelineProps = {
  symbol: string;
};

const ACTIVITY_STORAGE_KEY =
  "nestrova:public-ai-activity:v1";

const MAX_VISIBLE_EVENTS = 8;

function isActivityEvent(
  value: unknown,
): value is ActivityEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event =
    value as Partial<ActivityEvent>;

  return (
    typeof event.id === "string" &&
    typeof event.symbol === "string" &&
    typeof event.assetType === "string" &&
    (
      event.category === "score" ||
      event.category === "confidence" ||
      event.category === "risk" ||
      event.category === "regime"
    ) &&
    (
      typeof event.previousValue === "string" ||
      typeof event.previousValue === "number"
    ) &&
    (
      typeof event.currentValue === "string" ||
      typeof event.currentValue === "number"
    ) &&
    typeof event.createdAt === "number"
  );
}

function readStoredEvents() {
  try {
    const raw = window.localStorage.getItem(
      ACTIVITY_STORAGE_KEY,
    );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isActivityEvent);
  } catch {
    return [];
  }
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(timestamp);
}

function categoryLabel(
  category: ActivityCategory,
) {
  switch (category) {
    case "score":
      return "AI Score";
    case "confidence":
      return "Confidence";
    case "risk":
      return "Risk";
    case "regime":
      return "Market Regime";
  }
}

function categoryClasses(
  event: ActivityEvent,
) {
  if (
    event.category === "score" &&
    Number(event.currentValue) >
      Number(event.previousValue)
  ) {
    return {
      dot: "bg-emerald-300",
      badge:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    };
  }

  if (
    event.category === "score" &&
    Number(event.currentValue) <
      Number(event.previousValue)
  ) {
    return {
      dot: "bg-orange-300",
      badge:
        "border-orange-400/20 bg-orange-400/10 text-orange-200",
    };
  }

  if (event.category === "risk") {
    return {
      dot: "bg-amber-300",
      badge:
        "border-amber-400/20 bg-amber-400/10 text-amber-200",
    };
  }

  if (event.category === "regime") {
    return {
      dot: "bg-violet-300",
      badge:
        "border-violet-400/20 bg-violet-400/10 text-violet-200",
    };
  }

  return {
    dot: "bg-cyan-300",
    badge:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  };
}

function eventValue(event: ActivityEvent) {
  if (event.category === "confidence") {
    return `${event.previousValue}% → ${event.currentValue}%`;
  }

  return `${event.previousValue} → ${event.currentValue}`;
}

export default function AssetAITimeline({
  symbol,
}: AssetAITimelineProps) {
  const [events, setEvents] = useState<
    ActivityEvent[]
  >([]);

  const normalizedSymbol =
    symbol.trim().toUpperCase();

  useEffect(() => {
    function loadEvents() {
      setEvents(readStoredEvents());
    }

    loadEvents();

    function handleStorage(
      storageEvent: StorageEvent,
    ) {
      if (
        storageEvent.key ===
        ACTIVITY_STORAGE_KEY
      ) {
        loadEvents();
      }
    }

    function handleActivityUpdated() {
      loadEvents();
    }

    window.addEventListener(
      "storage",
      handleStorage,
    );

    window.addEventListener(
      "nestrova:activity-updated",
      handleActivityUpdated,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage,
      );

      window.removeEventListener(
        "nestrova:activity-updated",
        handleActivityUpdated,
      );
    };
  }, []);

  const assetEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.symbol
              .trim()
              .toUpperCase() ===
            normalizedSymbol,
        )
        .sort(
          (first, second) =>
            second.createdAt -
            first.createdAt,
        )
        .slice(0, MAX_VISIBLE_EVENTS),
    [events, normalizedSymbol],
  );

  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.035] p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300/70">
            AI Timeline
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">
            How Nestrova intelligence changed for{" "}
            {normalizedSymbol}
          </h2>
        </div>

        <p className="text-xs text-white/30">
          Stored in this browser
        </p>
      </div>

      {assetEvents.length > 0 ? (
        <div className="relative mt-7">
          <div className="absolute bottom-4 left-[5px] top-4 w-px bg-white/10" />

          <div className="space-y-4">
            {assetEvents.map((event) => {
              const classes =
                categoryClasses(event);

              return (
                <article
                  key={event.id}
                  className="relative pl-8"
                >
                  <span
                    className={`absolute left-0 top-6 h-2.5 w-2.5 rounded-full ring-4 ring-[#090909] ${classes.dot}`}
                  />

                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${classes.badge}`}
                        >
                          {categoryLabel(
                            event.category,
                          )}
                        </span>

                        <p className="mt-3 text-xl font-semibold">
                          {eventValue(event)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-white/40">
                          {formatTime(
                            event.createdAt,
                          )}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                          {formatDate(
                            event.createdAt,
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/40">
                      Nestrova detected a change in the
                      public research state for this
                      asset.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-7 rounded-[22px] border border-white/10 bg-black/20 p-6">
          <p className="font-semibold text-white/65">
            No timeline changes recorded yet.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/35">
            Score, confidence, risk, and regime
            changes detected on the Trading
            Dashboard will appear here.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs leading-5 text-white/25">
        Timeline records contain public market
        intelligence only. They do not contain
        brokerage accounts, balances, positions,
        orders, or execution information.
      </p>
    </section>
  );
}
