"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
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
  error?: string;
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

  const difference =
    Date.now() - timestamp;

  const minutes = Math.floor(
    difference / 60_000,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  return `${days}d ago`;
}

function alertBadgeClasses(type: string) {
  switch (type.toUpperCase()) {
    case "OPPORTUNITY":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";

    case "RISK":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";

    default:
      return "border-white/10 bg-white/[0.06] text-white/50";
  }
}

export default function NotificationBell() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([]);

  const [hasNewAlert, setHasNewAlert] =
    useState(false);

  const previousUnreadRef =
    useRef(0);

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

        if (response.status === 401) {
          setUnreadCount(0);
          setNotifications([]);
          return;
        }

        if (!response.ok) {
          return;
        }

        const result =
          (await response.json()) as NotificationResponse;

        const nextUnread =
          result.unread_count ?? 0;

        if (
          nextUnread >
          previousUnreadRef.current
        ) {
          setHasNewAlert(true);

          window.setTimeout(() => {
            setHasNewAlert(false);
          }, 4000);
        }

        previousUnreadRef.current =
          nextUnread;

        setUnreadCount(nextUnread);
        setNotifications(
          result.notifications ?? [],
        );
      } catch (error) {
        console.error(
          "notification_bell_load_error",
          error,
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadNotifications();

    const interval =
      window.setInterval(() => {
        void loadNotifications();
      }, 30_000);

    const handleFocus = () => {
      void loadNotifications();
    };

    window.addEventListener(
      "focus",
      handleFocus,
    );

    return () => {
      window.clearInterval(interval);

      window.removeEventListener(
        "focus",
        handleFocus,
      );
    };
  }, [loadNotifications]);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  function toggleDropdown() {
    setOpen((current) => !current);

    if (!open) {
      void loadNotifications();
    }
  }

  const displayCount =
    unreadCount > 99
      ? "99+"
      : String(unreadCount);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="Open notifications"
        aria-expanded={open}
        className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl border transition duration-300 ${
          open
            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.13)]"
            : "border-white/10 bg-white/[0.055] text-white/55 hover:border-white/20 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span
          className={`absolute inset-0 rounded-2xl bg-cyan-400/10 opacity-0 blur-xl transition ${
            unreadCount > 0
              ? "group-hover:opacity-100"
              : ""
          }`}
        />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`relative h-5 w-5 ${
            hasNewAlert
              ? "animate-[notification-ring_0.65s_ease-in-out_3]"
              : ""
          }`}
        >
          <path
            d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 21h4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        {unreadCount > 0 ? (
          <>
            <span className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-cyan-400/35" />

            <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#050505] bg-cyan-300 px-1 text-[9px] font-black text-black shadow-[0_0_18px_rgba(103,232,249,0.75)]">
              {displayCount}
            </span>
          </>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-[100] mt-3 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0a]/95 shadow-[0_35px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-cyan-300/65">
                  Intelligence Alerts
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                  Notifications
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-semibold text-white/50">
                {unreadCount} unread
              </div>
            </div>
          </div>

          <div className="max-h-[430px] overflow-y-auto p-3">
            {loading ? (
              <div className="grid gap-3 p-2">
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-[22px] border border-white/10 bg-white/[0.045]"
                  />
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="grid gap-2">
                {notifications.map(
                  (notification) => (
                    <Link
                      key={notification.id}
                      href="/notifications"
                      onClick={() =>
                        setOpen(false)
                      }
                      className={`group rounded-[22px] border p-4 transition ${
                        notification.is_read
                          ? "border-white/[0.07] bg-white/[0.025] opacity-65 hover:opacity-100"
                          : "border-cyan-400/15 bg-cyan-400/[0.055] hover:border-cyan-400/25 hover:bg-cyan-400/[0.08]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${alertBadgeClasses(
                                notification.alert_type,
                              )}`}
                            >
                              {cleanLabel(
                                notification.alert_type,
                              )}
                            </span>

                            {!notification.is_read ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                            ) : null}
                          </div>

                          <p className="mt-3 truncate text-sm font-semibold text-white/85">
                            {notification.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/38">
                            {notification.message}
                          </p>
                        </div>

                        <p className="shrink-0 text-[10px] text-white/25">
                          {relativeTime(
                            notification.created_at,
                          )}
                        </p>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            ) : (
              <div className="p-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/30">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 21h4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="mt-4 font-semibold">
                  No notifications yet
                </p>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Watchlist conditions will appear here when they are met.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <Link
              href="/notifications"
              onClick={() =>
                setOpen(false)
              }
              className="flex w-full items-center justify-between rounded-[20px] border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              Open Notification Center
              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
