export type AnalyticsEventName =
  | "dashboard_viewed"
  | "property_analyzed"
  | "report_generated"
  | "coach_generated"
  | "deal_saved"
  | "pricing_viewed"
  | "upgrade_clicked"
  | "feedback_submitted"
  | "watchlist_added"
  | "portfolio_viewed"
  | "compare_started"
  | "market_viewed"
  | "onboarding_completed";

type TrackOptions = {
  userId?: string;
  eventName: AnalyticsEventName;
  properties?: Record<string, unknown>;
};

export async function trackEvent({
  userId,
  eventName,
  properties = {},
}: TrackOptions) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId || null,
        event_name: eventName,
        properties,
        url:
          typeof window !== "undefined"
            ? window.location.href
            : null,
        pathname:
          typeof window !== "undefined"
            ? window.location.pathname
            : null,
        referrer:
          typeof document !== "undefined"
            ? document.referrer
            : null,
      }),
    });
  } catch {
    // Never break product UX because analytics failed.
  }
}
