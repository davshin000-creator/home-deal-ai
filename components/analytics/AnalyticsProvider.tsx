"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { trackEvent } from "@/lib/analytics";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (!pathname) return;

    const pageEventMap: Record<string, string> = {
      "/dashboard": "dashboard_viewed",
      "/pricing": "pricing_viewed",
      "/portfolio": "portfolio_viewed",
      "/compare": "compare_started",
      "/coach": "coach_generated",
      "/markets": "market_viewed",
    };

    const eventName = pageEventMap[pathname];

    if (eventName) {
      trackEvent({
        userId: user?.id,
        eventName: eventName as any,
        properties: {
          page: pathname,
        },
      });
    }
  }, [pathname, user?.id]);

  return null;
}
