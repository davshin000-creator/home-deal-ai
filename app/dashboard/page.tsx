"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import {
  SignInButton,
  useUser,
} from "@/components/auth/ClerkCompat";
import FloatingAIAssistant from "@/components/assistant/FloatingAIAssistant";
import NestrovaAppShell from "@/components/shell/NestrovaAppShell";

type DashboardActivity = {
  title: string;
  description: string;
  href: string;
};

type DashboardData = {
  user_name: string;
  portfolio_count: number;
  avg_deal_score: number;
  saved_deals: number;
  ai_reports: number;
  coach_plans: number;
  watchlist_count: number;
  weekly_reports: number;
  ai_brief: string;
  recent_activity: DashboardActivity[];
};

type SubscriptionData = {
  plan: string;
  subscription_type: string;
  subscription_status: string;
  trial_ends_at: string | null;
};

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return "0";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  });
}

function DashboardSkeleton() {
  return (
    <div className="grid animate-pulse gap-6">
      <div className="h-64 rounded-[42px] border border-white/10 bg-white/[0.045]" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-[28px] border border-white/10 bg-white/[0.045]"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-96 rounded-[38px] border border-white/10 bg-white/[0.045]"
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [subscription, setSubscription] =
  useState<SubscriptionData | null>(null);

  const [analysisRemaining, setAnalysisRemaining] =
  useState<number | null>(null);

  const [watchlistCount, setWatchlistCount] =
  useState(0);

  const [alertCount, setAlertCount] =
  useState(0);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      void loadDashboard();
      void loadSubscription();
    }
  }, [isSignedIn, user?.id]);

  async function loadDashboard() {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/dashboard?user_id=${encodeURIComponent(user.id)}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not load dashboard.");
        setData(null);
        return;
      }

      setData(result as DashboardData);
    } catch {
      setMessage("Dashboard connection failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubscription() {
  if (!user?.id) {
    return;
  }

  try {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          plan,
          subscription_type,
          subscription_status,
          trial_ends_at
        `,
      )
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "dashboard_subscription_load_error",
        error,
      );
      return;
    }

    if (data) {
      setSubscription(data);

    try {
  const usageResponse = await fetch(
    `/api/usage?feature=analysis&user_id=${encodeURIComponent(
      user.id,
    )}`,
    {
      cache: "no-store",
    },
  );

  if (usageResponse.ok) {
    const usage = await usageResponse.json();

    setAnalysisRemaining(
      typeof usage.remaining === "number"
        ? usage.remaining
        : null,
    );
  }
} catch (error) {
  console.error(error);
}

try {
  const response = await fetch(
    "/api/trading/watchlist",
    {
      cache: "no-store",
    },
  );

  if (response.ok) {
    const result = await response.json();

    setWatchlistCount(
      result.watchlist?.length ?? 0,
    );
  }
} catch {}

try {
  const response = await fetch(
    "/api/trading/alerts",
    {
      cache: "no-store",
    },
  );

  if (response.ok) {
    const result = await response.json();

    setAlertCount(
      result.alerts?.length ?? 0,
    );
  }
} catch {}

    }
  } catch (error) {
    console.error(
      "dashboard_subscription_unexpected_error",
      error,
    );
  }
}

  const displayName = useMemo(() => {
    if (data?.user_name?.trim()) {
      return data.user_name.trim();
    }

    const currentUser = user as
      | {
          firstName?: string | null;
          fullName?: string | null;
          primaryEmailAddress?: {
            emailAddress?: string;
          };
        }
      | undefined;

    if (currentUser?.firstName) {
      return currentUser.firstName;
    }

    if (currentUser?.fullName) {
      return currentUser.fullName;
    }

    const email =
      currentUser?.primaryEmailAddress?.emailAddress;

    if (email) {
      return email.split("@")[0];
    }

    return "Investor";
  }, [data?.user_name, user]);

    const subscriptionType =
    subscription?.subscription_type ??
    subscription?.plan ??
    "free";

  const subscriptionStatus =
    subscription?.subscription_status ?? "free";

  const isPaidSubscription =
    subscriptionStatus === "active" ||
    subscriptionStatus === "trialing" ||
    subscriptionStatus === "approved";

  const canUseRealEstate =
    isPaidSubscription &&
    (subscriptionType === "real_estate" ||
      subscriptionType === "all_access");

  const canUseTrading =
    isPaidSubscription &&
    (subscriptionType === "trading" ||
      subscriptionType === "all_access");

  const subscriptionDisplayName =
    subscriptionType === "all_access"
      ? "Nestrova AI Pro"
      : subscriptionType === "real_estate"
        ? "Real Estate Pro"
        : subscriptionType === "trading"
          ? "Radar Pro"
          : "Free";

  const greeting = (() => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
})();

const intelligenceItems = [
  {
    label: "Property portfolio",
    value: `${formatNumber(data?.portfolio_count)} tracked`,
    href: "/real-estate",
  },
  {
    label: "Radar watchlist",
    value: `${watchlistCount} assets`,
    href: "/trading/watchlist",
  },
  {
    label: "Active alerts",
    value: canUseTrading
      ? `${alertCount} active`
      : "Premium locked",
    href: canUseTrading
      ? "/notifications"
      : "/pricing#plans",
  },
  {
    label: "Analysis capacity",
    value: canUseRealEstate
      ? "Unlimited"
      : analysisRemaining === null
        ? "Loading"
        : `${analysisRemaining} remaining`,
    href: "/analyze",
  },
];

  if (!isSignedIn) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-16 text-white md:px-8">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
          <div className="absolute -left-44 -top-44 h-[720px] w-[720px] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-[-300px] right-[-220px] h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <section className="relative mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_46px_150px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-lg font-black text-black">
              N
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/70">
              Nestrova
            </p>

            <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Your Nestrova workspace.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/48">
              Sign in to access Real Estate, Radar, Research, saved
              intelligence, alerts, and your personalized workspace.
            </p>

            <SignInButton mode="modal">
              <button className="mt-9 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200">
                Sign In to Nestrova
              </button>
            </SignInButton>

            <div className="mt-8">
              <Link
                href="/"
                className="text-sm font-semibold text-white/45 transition hover:text-white"
              >
                Return to platform &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <NestrovaAppShell
      userName={data?.user_name || displayName}
      title="Home"
      subtitle="Your Nestrova workspace."
    >
      <FloatingAIAssistant />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-8 md:py-10">
        {message ? (
          <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-red-400/20 bg-red-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-red-200">
                Dashboard data unavailable
              </p>

              <p className="mt-1 text-sm text-red-100/60">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadDashboard()
              }
              className="rounded-[12px] border border-red-300/20 bg-red-300/10 px-4 py-2 text-xs font-semibold text-red-100"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045] p-7 md:p-10">
              <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-400/[0.08] blur-3xl" />

              <div className="relative max-w-4xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/60">
                  Nestrova
                </p>

                <h1 className="mt-4 text-[clamp(2.7rem,7vw,5.5rem)] font-black leading-[0.94] tracking-[-0.065em]">
                  Your Nestrova
                  <span className="block text-white/35">
                    workspace.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
                  Research properties, markets,
                  and opportunities from one simple
                  workspace.
                </p>
              </div>
            </section>

            <section className="mt-8">
              <div className="grid gap-5 lg:grid-cols-3">
                <Link
                  href="/real-estate"
                  className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-emerald-300/[0.045]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/60">
                    Real Estate
                  </p>

                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">
                    Understand a property.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/40">
                    Analyze value, rental potential,
                    Deal Score, and risk.
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-semibold">
                      Open Real Estate
                    </span>

                    <span className="text-lg text-emerald-200/65 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/trading"
                  className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-cyan-300/[0.045]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/60">
                    Radar
                  </p>

                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">
                    Explore the market.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/40">
                    Find stocks and crypto worth
                    researching right now.
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-semibold">
                      Open Radar
                    </span>

                    <span className="text-lg text-cyan-200/65 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/research"
                  className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-violet-300/25 hover:bg-violet-300/[0.045]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/60">
                    Research
                  </p>

                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">
                    Go deeper with AI.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/40">
                    Research stocks and crypto with
                    deeper evidence and AI analysis.
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-semibold">
                      Open Research
                    </span>

                    <span className="text-lg text-violet-200/65 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <article className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-7">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/28">
                      Recent Activity
                    </p>

                    <h2 className="mt-3 text-2xl font-black tracking-[-0.045em]">
                      Continue where you left off.
                    </h2>
                  </div>

                  <span className="text-xs text-white/25">
                    {data?.recent_activity?.length ?? 0} items
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {data?.recent_activity &&
                  data.recent_activity.length > 0 ? (
                    data.recent_activity
                      .slice(0, 3)
                      .map((item, index) => (
                        <Link
                          key={`${item.href}-${index}`}
                          href={
                            item.href ||
                            "/dashboard"
                          }
                          className="group flex items-center justify-between gap-5 rounded-[20px] border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.05]"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {item.title}
                            </p>

                            <p className="mt-1 truncate text-xs text-white/32">
                              {item.description}
                            </p>
                          </div>

                          <span className="shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                            →
                          </span>
                        </Link>
                      ))
                  ) : (
                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                      <p className="font-semibold">
                        No recent activity yet.
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/35">
                        Your recent research and
                        property activity will appear
                        here.
                      </p>
                    </div>
                  )}
                </div>
              </article>

              <aside className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/28">
                  Account
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.045em]">
                  {subscriptionDisplayName}
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Status: {subscriptionStatus}
                </p>

                <Link
                  href="/settings/billing"
                  className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  Manage settings
                  <span>→</span>
                </Link>
              </aside>
            </section>
          </>
        )}
      </div>
    </NestrovaAppShell>
  );
}
