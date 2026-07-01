"use client";

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    console.log("[Nestrova Analytics]", name, properties || {});
  }

  return {
    ok: true,
    event: {
      name,
      properties: properties || {},
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
