"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type NotificationItem = {
  id: string;
  symbol: string;
  alert_type: string;
  title: string;
  message: string;
  opportunity_score: number | null;
  risk_level: string | null;
  is_read: boolean;
  created_at: string;
};

type NotificationResponse = {
  authenticated: boolean;
  unread_count: number;
  notifications: NotificationItem[];
};

function cleanLabel(value?: string | null) {
  if (!value) {
    return "Alert";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function relativeTime(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const difference = Date.now() - timestamp;
  const minutes = Math.floor(difference / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function alertClasses(type?: string) {
  switch (type?.toUpperCase()) {
    case "OPPORTUNITY":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";

    case "RISK":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";

    default:
      return "border-white/10 bg-white/[0.06] text-white/50";
  }
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const loadNotifications =
    useCallback(async () => {
      try {
        const response = await fetch(
          "/api/notifications/summary",
          {
            cache: "no-store",
            credentials: "include",
          },
        );

        if (!response.ok) {
          return;
        }

        const result =
          (await response.json()) as NotificationResponse;

        setUnreadCount(result.unread_count ?? 0);
        setNotifications(
          (result.notifications ?? []).slice(0, 4),
        );
      } catch (error) {
        console.error(
          "dashboard_notifications_error",
          error,
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadNotifications();

    const interval = window.setInterval(
      () => {
        void loadNotifications();
      },
      30_000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [loadNotifications]);

  return (
    <article className="overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.05]">
      <div className="flex items-center justify-between gap-5 border-b border-white/10 p-7">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
              Intelligence Alerts
            </p>

            {unreadCount > 0 ? (
              <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-cyan-300 px-1.5 text-[9px] font-black text-black">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            Recent notifications
          </h2>
        </div>

        <Link
          href="/notifications"
          className="text-sm font-semibold text-white/42 transition hover:text-white"
        >
          View all →
        </Link>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[24px] border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="grid gap-3">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href="/notifications"
                className={`group rounded-[26px] border p-5 transition ${
                  notification.is_read
                    ? "border-white/[0.07] bg-black/15 opacity-65 hover:opacity-100"
                    : "border-cyan-400/15 bg-cyan-400/[0.045] hover:border-cyan-400/25 hover:bg-cyan-400/[0.07]"
                }`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${alertClasses(
                          notification.alert_type,
                        )}`}
                      >
                        {cleanLabel(notification.alert_type)}
                      </span>

                      {!notification.is_read ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                      ) : null}
                    </div>

                    <p className="mt-3 truncate font-semibold">
                      {notification.title}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/38">
                      {notification.message}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-white/28">
                      {relativeTime(notification.created_at)}
                    </p>

                    <span className="mt-4 inline-block text-lg text-white/25 transition group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-white/10 bg-black/15 p-7">
            <p className="font-semibold">
              No notifications yet.
            </p>

            <p className="mt-3 text-sm leading-7 text-white/40">
              Enable alerts in your Trading Watchlist. New
              Opportunity and Risk conditions will appear here.
            </p>

            <Link
              href="/trading/watchlist"
              className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              Open Watchlist
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
