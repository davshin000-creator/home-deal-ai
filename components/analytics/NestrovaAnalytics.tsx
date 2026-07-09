"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    nestrovaTrack?: (eventName: string, metadata?: Record<string, any>) => Promise<void>;
  }
}

export default function NestrovaAnalytics() {
  useEffect(() => {
    window.nestrovaTrack = async (eventName, metadata = {}) => {
      try {
        await fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_name: eventName,
            page_path: window.location.pathname,
            metadata,
          }),
        });
      } catch {}
    };

    window.nestrovaTrack("page_view", {
      title: document.title,
      referrer: document.referrer || "",
    });
  }, []);

  return null;
}

