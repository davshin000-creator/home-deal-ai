"use client";

export type AnalyticsPayload = {
  userId?: string;
  eventName?: string;
  properties?: Record<string, unknown>;
};

export type AnalyticsEvent =
  | string
  | AnalyticsPayload;

/**
 * Flexible analytics tracker.
 *
 * Supports both:
 * trackEvent("event_name", { source: "x" })
 *
 * and:
 * trackEvent({
 *   userId,
 *   eventName,
 *   properties: { source: "x" }
 * })
 */
export async function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
) {
  const payload =
    typeof event === "string"
      ? {
          eventName: event,
          properties: properties || {},
        }
      : {
          userId: event.userId,
          eventName: event.eventName || "unknown_event",
          properties: event.properties || {},
        };

  if (typeof window !== "undefined") {
    console.log("[Nestrova Analytics]", payload);
  }

  return {
    ok: true,
    event: {
      ...payload,
      timestamp: new Date().toISOString(),
    },
  };
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    console.log("[Nestrova Identify]", userId, traits || {});
  }

  return { ok: true, userId, traits: traits || {} };
}
