"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TopOpportunities from "@/components/trading/TopOpportunities";
import type { Opportunity } from "@/components/trading/OpportunityCard";

type PublicSystemState = {
  public_mode?: string;
  execution_exposed?: boolean;
};

type PublicOpportunitiesState = {
  top_opportunities?: Opportunity[];
  candidate_count?: number;
  crypto_candidate_count?: number;
  stock_candidate_count?: number;
  ranking_status?: string;
  source_available?: boolean;
};

type PublicTradingState = {
  generated_at?: string;
  system?: PublicSystemState;
  opportunities?: PublicOpportunitiesState;
};

type LiveTopOpportunitiesProps = {
  initialOpportunities: Opportunity[];
  initialGeneratedAt?: string;
};

type ActivityEvent = {
  id: string;
  symbol: string;
  assetType: string;
  category: "score" | "confidence" | "risk" | "regime";
  previousValue: string | number;
  currentValue: string | number;
  createdAt: number;
};

const REFRESH_INTERVAL_MS = 30_000;
const MAX_ACTIVITY_EVENTS = 12;
const ACTIVITY_STORAGE_KEY =
  "nestrova:public-ai-activity:v1";

function isActivityEvent(
  value: unknown,
): value is ActivityEvent {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const event =
    value as Partial<ActivityEvent>;

  return (
    typeof event.id === "string" &&
    typeof event.symbol === "string" &&
    typeof event.assetType === "string" &&
    typeof event.category === "string" &&
    (
      typeof event.previousValue ===
        "string" ||
      typeof event.previousValue ===
        "number"
    ) &&
    (
      typeof event.currentValue ===
        "string" ||
      typeof event.currentValue ===
        "number"
    ) &&
    typeof event.createdAt === "number"
  );
}

function loadStoredActivityEvents() {
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

    return parsed
      .filter(isActivityEvent)
      .slice(0, MAX_ACTIVITY_EVENTS);
  } catch {
    return [];
  }
}

function storeActivityEvents(
  events: ActivityEvent[],
) {
  try {
    window.localStorage.setItem(
      ACTIVITY_STORAGE_KEY,
      JSON.stringify(
        events.slice(
          0,
          MAX_ACTIVITY_EVENTS,
        ),
      ),
    );

    window.dispatchEvent(
      new CustomEvent(
        "nestrova:activity-updated",
      ),
    );
  } catch {
    // Browser storage may be unavailable.
  }
}


function opportunityKey(opportunity: Opportunity) {
  return [
    opportunity.asset_type ?? "asset",
    opportunity.symbol?.trim().toUpperCase() ?? "UNKNOWN",
  ].join(":");
}

function normalizeLabel(value?: string | null) {
  return String(value ?? "Unavailable")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatRelativeTime(
  timestamp?: string,
  now = Date.now(),
) {
  if (!timestamp) {
    return "Update time unavailable";
  }

  const parsed = new Date(timestamp).getTime();

  if (Number.isNaN(parsed)) {
    return "Update time unavailable";
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - parsed) / 1000),
  );

  if (elapsedSeconds < 10) {
    return "Updated just now";
  }

  if (elapsedSeconds < 60) {
    return `Updated ${elapsedSeconds} seconds ago`;
  }

  const elapsedMinutes = Math.floor(
    elapsedSeconds / 60,
  );

  if (elapsedMinutes < 60) {
    return `Updated ${elapsedMinutes} minute${
      elapsedMinutes === 1 ? "" : "s"
    } ago`;
  }

  const elapsedHours = Math.floor(
    elapsedMinutes / 60,
  );

  return `Updated ${elapsedHours} hour${
    elapsedHours === 1 ? "" : "s"
  } ago`;
}

function formatEventTime(createdAt: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(createdAt);
}

function detectOpportunityChanges(
  previousItems: Opportunity[],
  currentItems: Opportunity[],
): ActivityEvent[] {
  const previousMap = new Map(
    previousItems.map((item) => [
      opportunityKey(item),
      item,
    ]),
  );

  const events: ActivityEvent[] = [];
  const createdAt = Date.now();

  for (const current of currentItems) {
    const previous = previousMap.get(
      opportunityKey(current),
    );

    if (!previous) {
      continue;
    }

    const symbol =
      current.symbol?.trim().toUpperCase() ??
      "UNKNOWN";

    const assetType =
      current.asset_type === "crypto"
        ? "Crypto"
        : current.asset_type === "stock"
          ? "U.S. Stock"
          : "Asset";

    const previousScore =
      previous.opportunity_score ?? 0;

    const currentScore =
      current.opportunity_score ?? 0;

    if (previousScore !== currentScore) {
      events.push({
        id: `${symbol}-score-${createdAt}`,
        symbol,
        assetType,
        category: "score",
        previousValue: previousScore,
        currentValue: currentScore,
        createdAt,
      });
    }

    const previousConfidence =
      previous.confidence ?? 0;

    const currentConfidence =
      current.confidence ?? 0;

    if (
      previousConfidence !==
      currentConfidence
    ) {
      events.push({
        id: `${symbol}-confidence-${createdAt}`,
        symbol,
        assetType,
        category: "confidence",
        previousValue: previousConfidence,
        currentValue: currentConfidence,
        createdAt,
      });
    }

    const previousRisk =
      previous.risk?.trim().toUpperCase() ??
      "UNKNOWN";

    const currentRisk =
      current.risk?.trim().toUpperCase() ??
      "UNKNOWN";

    if (previousRisk !== currentRisk) {
      events.push({
        id: `${symbol}-risk-${createdAt}`,
        symbol,
        assetType,
        category: "risk",
        previousValue: normalizeLabel(previousRisk),
        currentValue: normalizeLabel(currentRisk),
        createdAt,
      });
    }

    const previousRegime =
      previous.regime?.trim().toUpperCase() ??
      "UNKNOWN";

    const currentRegime =
      current.regime?.trim().toUpperCase() ??
      "UNKNOWN";

    if (previousRegime !== currentRegime) {
      events.push({
        id: `${symbol}-regime-${createdAt}`,
        symbol,
        assetType,
        category: "regime",
        previousValue: normalizeLabel(
          previousRegime,
        ),
        currentValue: normalizeLabel(
          currentRegime,
        ),
        createdAt,
      });
    }
  }

  return events;
}

function eventTitle(event: ActivityEvent) {
  switch (event.category) {
    case "score":
      return "AI Score changed";
    case "confidence":
      return "Confidence changed";
    case "risk":
      return "Risk classification changed";
    case "regime":
      return "Market regime changed";
  }
}

function eventValue(event: ActivityEvent) {
  if (event.category === "confidence") {
    return `${event.previousValue}% → ${event.currentValue}%`;
  }

  return `${event.previousValue} → ${event.currentValue}`;
}

function eventAccent(event: ActivityEvent) {
  if (
    event.category === "score" &&
    Number(event.currentValue) >
      Number(event.previousValue)
  ) {
    return "bg-emerald-300";
  }

  if (
    event.category === "score" &&
    Number(event.currentValue) <
      Number(event.previousValue)
  ) {
    return "bg-orange-300";
  }

  if (event.category === "risk") {
    return "bg-amber-300";
  }

  if (event.category === "regime") {
    return "bg-violet-300";
  }

  return "bg-cyan-300";
}

export default function LiveTopOpportunities({
  initialOpportunities,
  initialGeneratedAt,
  }: LiveTopOpportunitiesProps) {
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(
      initialOpportunities,
    );

  const previousOpportunitiesRef =
    useRef<Opportunity[]>(
      initialOpportunities,
    );

  const [generatedAt, setGeneratedAt] =
    useState<string | undefined>(
      initialGeneratedAt,
    );

  const [activityEvents, setActivityEvents] =
    useState<ActivityEvent[]>([]);

  const [activityLoaded, setActivityLoaded] =
    useState(false);

  const [clock, setClock] = useState(0);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [refreshError, setRefreshError] =
    useState<string | null>(null);

  const [
    lastSuccessfulRefresh,
    setLastSuccessfulRefresh,
  ] = useState<number | null>(null);

  useEffect(() => {
    setActivityEvents(
      loadStoredActivityEvents(),
    );

    setActivityLoaded(true);
  }, []);

  useEffect(() => {
    if (!activityLoaded) {
      return;
    }

    storeActivityEvents(
      activityEvents,
    );
  }, [
    activityEvents,
    activityLoaded,
  ]);

  useEffect(() => {
    let active = true;

    async function refreshTradingState() {
      if (!active) {
        return;
      }

      setIsRefreshing(true);

      try {
        const response = await fetch(
          "/api/trading/public-state",
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `API returned ${response.status}.`,
          );
        }

        const data =
          (await response.json()) as PublicTradingState;

        if (
          data.system?.public_mode !==
            "READ_ONLY" ||
          data.system?.execution_exposed !==
            false
        ) {
          throw new Error(
            "Public API safety validation failed.",
          );
        }

        const nextOpportunities =
          data.opportunities
            ?.top_opportunities;

        if (
          !Array.isArray(
            nextOpportunities,
          )
        ) {
          throw new Error(
            "Opportunity data is unavailable.",
          );
        }

        if (!active) {
          return;
        }

        const detectedEvents =
          detectOpportunityChanges(
            previousOpportunitiesRef.current,
            nextOpportunities,
          );

        if (detectedEvents.length > 0) {
          setActivityEvents(
            (currentEvents) => {
              const merged = [
                ...detectedEvents,
                ...currentEvents,
              ];

              const seen = new Set<string>();

              return merged
                .filter((event) => {
                  const signature = [
                    event.symbol,
                    event.category,
                    event.previousValue,
                    event.currentValue,
                    event.createdAt,
                  ].join(":");

                  if (seen.has(signature)) {
                    return false;
                  }

                  seen.add(signature);
                  return true;
                })
                .slice(
                  0,
                  MAX_ACTIVITY_EVENTS,
                );
            },
          );
        }

        previousOpportunitiesRef.current =
          nextOpportunities;

        setOpportunities(
          nextOpportunities,
        );

        setGeneratedAt(
          data.generated_at,
        );

        setLastSuccessfulRefresh(
          Date.now(),
        );

        setRefreshError(null);
      } catch (error) {
        if (!active) {
          return;
        }

        setRefreshError(
          error instanceof Error
            ? error.message
            : "Live refresh failed.",
        );
      } finally {
        if (active) {
          setIsRefreshing(false);
        }
      }
    }

    const refreshInterval =
      window.setInterval(
        () => {
          void refreshTradingState();
        },
        REFRESH_INTERVAL_MS,
      );

    const clockInterval =
      window.setInterval(
        () => {
          setClock(Date.now());
        },
        1_000,
      );

    return () => {
      active = false;

      window.clearInterval(
        refreshInterval,
      );

      window.clearInterval(
        clockInterval,
      );
    };
  }, []);

  const relativeUpdateTime = useMemo(() => {
    if (clock === 0) {
      return "Live update";
    }

    return formatRelativeTime(
      generatedAt,
      clock,
    );
  }, [generatedAt, clock]);

  const refreshStatus = useMemo(() => {
    if (isRefreshing) {
      return "Refreshing market intelligence";
    }

    if (refreshError) {
      return "Using last verified public state";
    }

    const secondsSinceSuccess =
      clock === 0
        ? 0
        : Math.floor(
            (
              clock -
              (lastSuccessfulRefresh ?? clock)
            ) / 1000,
          );

    if (secondsSinceSuccess < 35) {
      return "Live public intelligence";
    }

    return "Next refresh pending";
  }, [
    clock,
    isRefreshing,
    lastSuccessfulRefresh,
    refreshError,
  ]);

  return (
    <div>
      <div className="relative mx-auto max-w-[1480px] px-5 pt-4 md:px-8">
        <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                refreshError
                  ? "bg-amber-300"
                  : "bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]"
              }`}
            />

            <div>
              <p className="text-sm font-semibold text-white/70">
                {refreshStatus}
              </p>

              <p className="mt-0.5 text-xs text-white/35">
                {relativeUpdateTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/30">
            <span>
              Refreshes every 30 seconds
            </span>

            {isRefreshing ? (
              <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300" />
            ) : null}
          </div>
        </div>

        {refreshError ? (
          <p className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.07] px-4 py-3 text-xs leading-5 text-amber-100/70">
            Live refresh could not complete. The last verified public market state remains visible.
          </p>
        ) : null}
      </div>

      <TopOpportunities
        opportunities={opportunities}
      />

      <section className="relative mx-auto mt-6 max-w-[1480px] px-5 pb-12 md:mt-8 md:px-8">
        <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/70">
                Live AI Activity
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Recent intelligence changes.
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-white/30">
                Changes appear after each 30-second refresh.
              </p>

              {activityEvents.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActivityEvents([]);

                    try {
                      window.localStorage.removeItem(
                        ACTIVITY_STORAGE_KEY,
                      );
                    } catch {
                      // Browser storage may be unavailable.
                    }
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/45 transition hover:border-white/20 hover:text-white"
                >
                  Clear activity
                </button>
              ) : null}
            </div>
          </div>

          {activityEvents.length > 0 ? (
            <div className="mt-7 grid gap-3 lg:grid-cols-2">
              {activityEvents.map((event) => (
                <article
                  key={event.id}
                  className="flex gap-4 rounded-[22px] border border-white/10 bg-black/20 p-5"
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${eventAccent(
                      event,
                    )}`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {event.symbol}
                        </p>

                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] uppercase tracking-[0.13em] text-white/35">
                          {event.assetType}
                        </span>
                      </div>

                      <p className="text-[10px] text-white/25">
                        {formatEventTime(
                          event.createdAt,
                        )}
                      </p>
                    </div>

                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      {eventTitle(event)}
                    </p>

                    <p className="mt-2 text-lg font-semibold text-white/75">
                      {eventValue(event)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[24px] border border-white/10 bg-black/20 p-6">
              <p className="font-semibold text-white/65">
                Waiting for the next intelligence change.
              </p>

              <p className="mt-2 text-sm leading-6 text-white/35">
                The feed will record AI Score, confidence, risk, and regime changes without exposing any private account or execution data.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}



