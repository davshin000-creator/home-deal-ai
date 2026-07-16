import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  deleteAlert,
  markAlertRead,
  markAllAlertsRead,
} from "./actions";

export const dynamic = "force-dynamic";

type AlertItem = {
  id: string;
  symbol: string;
  alert_type: string;
  opportunity_score: number | null;
  market_regime: string | null;
  risk_level: string | null;
  title: string;
  message: string;
  triggered_value: number | null;
  threshold_value: number | null;
  source_updated_at: string | null;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
};

type SearchParams = Promise<{
  success?: string;
  error?: string;
}>;

function cleanLabel(value?: string | null) {
  if (!value) {
    return "Unavailable";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Unknown time";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function alertClasses(type?: string) {
  switch (type?.toUpperCase()) {
    case "OPPORTUNITY":
      return {
        badge:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        glow: "shadow-[0_0_70px_rgba(34,211,238,0.07)]",
      };

    case "RISK":
      return {
        badge:
          "border-amber-400/20 bg-amber-400/10 text-amber-200",
        glow: "shadow-[0_0_70px_rgba(251,191,36,0.06)]",
      };

    default:
      return {
        badge:
          "border-white/10 bg-white/[0.06] text-white/55",
        glow: "",
      };
  }
}

function successMessage(value?: string) {
  switch (value) {
    case "marked-read":
      return "Notification marked as read.";
    case "all-read":
      return "All notifications marked as read.";
    case "deleted":
      return "Notification deleted.";
    default:
      return null;
  }
}

function errorMessage(value?: string) {
  switch (value) {
    case "invalid-alert":
      return "The selected notification is invalid.";
    case "unable-to-update":
      return "The notification could not be updated.";
    case "unable-to-delete":
      return "The notification could not be deleted.";
    default:
      return null;
  }
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login?next=/notifications");
  }

  const { data, error } = await supabase
    .from("trading_alerts")
    .select(
      `
        id,
        symbol,
        alert_type,
        opportunity_score,
        market_regime,
        risk_level,
        title,
        message,
        triggered_value,
        threshold_value,
        source_updated_at,
        metadata,
        is_read,
        created_at
      `,
    )
    .eq("user_id", authData.user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(100);

  const alerts = (data ?? []) as AlertItem[];
  const unreadCount = alerts.filter((item) => !item.is_read).length;

  const success =
    successMessage(params.success);

  const pageError =
    errorMessage(params.error) ??
    (error ? "Notifications could not be loaded." : null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-52 top-[-280px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-300px] top-16 h-[800px] w-[800px] rounded-full bg-amber-400/[0.07] blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
              N
            </div>

            <div>
              <p className="text-sm font-semibold">Nestrova</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Notification Center
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/trading" className="transition hover:text-white">
              Trading
            </Link>
            <Link
              href="/trading/watchlist"
              className="transition hover:text-white"
            >
              Watchlist
            </Link>
            <Link href="/notifications" className="text-white">
              Notifications
            </Link>
          </nav>

          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1480px] px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-cyan-300/70">
              Personal Intelligence
            </p>

            <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Notifications from your market conditions.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
              Review Opportunity and Risk conditions generated from your
              private Watchlist settings and Nestrova&apos;s public read-only
              market intelligence.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Unread Notifications
            </p>
            <p className="mt-2 text-4xl font-semibold">
              {unreadCount}
            </p>
          </div>
        </div>

        {success ? (
          <div className="mt-8 rounded-[26px] border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        {pageError ? (
          <div className="mt-8 rounded-[26px] border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
            {pageError}
          </div>
        ) : null}
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Alert Queue
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
              {alerts.length} notification
              {alerts.length === 1 ? "" : "s"}
            </h2>
          </div>

          {unreadCount > 0 ? (
            <form action={markAllAlertsRead}>
              <button
                type="submit"
                className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Mark all as read
              </button>
            </form>
          ) : null}
        </div>

        <div className="mt-8 grid gap-5">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
              const classes = alertClasses(alert.alert_type);

              return (
                <article
                  key={alert.id}
                  className={`rounded-[36px] border bg-white/[0.05] p-6 ${
                    alert.is_read
                      ? "border-white/10 opacity-75"
                      : `border-cyan-400/20 ${classes.glow}`
                  }`}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] ${classes.badge}`}
                        >
                          {cleanLabel(alert.alert_type)}
                        </span>

                        {!alert.is_read ? (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            New
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/35">
                            Read
                          </span>
                        )}

                        <span className="text-xs text-white/30">
                          {formatDate(alert.created_at)}
                        </span>
                      </div>

                      <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
                        {alert.title}
                      </h3>

                      <p className="mt-4 max-w-4xl text-sm leading-7 text-white/48">
                        {alert.message}
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Symbol
                          </p>
                          <p className="mt-2 text-xl font-semibold">
                            {alert.symbol}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Opportunity
                          </p>
                          <p className="mt-2 text-xl font-semibold">
                            {alert.opportunity_score ?? "—"}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Regime
                          </p>
                          <p className="mt-2 text-lg font-semibold">
                            {cleanLabel(alert.market_regime)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                            Risk
                          </p>
                          <p className="mt-2 text-lg font-semibold">
                            {cleanLabel(alert.risk_level)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-xs text-white/28">
                        Intelligence source:{" "}
                        {formatDate(alert.source_updated_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-3">
                      {!alert.is_read ? (
                        <form action={markAlertRead}>
                          <input
                            type="hidden"
                            name="id"
                            value={alert.id}
                          />

                          <button
                            type="submit"
                            className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                          >
                            Mark read
                          </button>
                        </form>
                      ) : null}

                      <form action={deleteAlert}>
                        <input
                          type="hidden"
                          name="id"
                          value={alert.id}
                        />

                        <button
                          type="submit"
                          className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/15"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-8">
              <p className="text-lg font-semibold">
                No notifications yet.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/42">
                Enable alerts on your Trading Watchlist, set an Opportunity
                threshold or Risk condition, and run the Alert Engine to
                generate your first notification.
              </p>

              <Link
                href="/trading/watchlist"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Open Watchlist
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Notification Boundary
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em]">
            Alerts report matched research conditions, not guaranteed market
            outcomes.
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/45">
            Notifications are generated from public read-only intelligence and
            your saved preferences. They do not execute trades, connect to a
            brokerage account, or replace independent financial judgment.
          </p>
        </div>
      </section>
    </main>
  );
}
