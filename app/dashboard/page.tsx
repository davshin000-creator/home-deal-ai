"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@/components/auth/ClerkCompat";
import FloatingAIAssistant from "@/components/assistant/FloatingAIAssistant";
import NotificationBell from "@/components/notifications/NotificationBell";
import DashboardNotifications from "@/components/notifications/DashboardNotifications";

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

type ProductCard = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  accent: "emerald" | "cyan" | "violet";
  links: Array<{
    label: string;
    href: string;
  }>;
};

const products: ProductCard[] = [
  {
    eyebrow: "Property Intelligence",
    title: "Real Estate",
    description:
      "Analyze fair value, rent, risk, negotiation leverage, and investment quality.",
    href: "/real-estate",
    action: "Open Real Estate",
    accent: "emerald",
    links: [
      { label: "Analyze Property", href: "/analyze" },
      { label: "Compare", href: "/compare" },
      { label: "Brain Console", href: "/brain-console" },
      { label: "Investor Memo", href: "/memo" },
    ],
  },
  {
    eyebrow: "Market Intelligence",
    title: "Trading",
    description:
      "Review market regime, AI Council research, opportunities, strategies, and your Watchlist.",
    href: "/trading",
    action: "Open Trading",
    accent: "cyan",
    links: [
      { label: "Daily Briefing", href: "/trading/briefing" },
      { label: "Markets", href: "/trading/markets" },
      { label: "Watchlist", href: "/trading/watchlist" },
      { label: "AI Council", href: "/trading/council" },
    ],
  },
  {
    eyebrow: "Continuous Discovery",
    title: "Research",
    description:
      "Follow aggregated discoveries, patterns, evidence, and future intelligence products.",
    href: "/research",
    action: "Open Research",
    accent: "violet",
    links: [
      { label: "Research Home", href: "/research" },
      { label: "Trading Strategies", href: "/trading/strategies" },
      { label: "Verified Registry", href: "/trading/verified" },
      { label: "Platform Home", href: "/" },
    ],
  },
];

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", marker: "D" },
  { label: "Real Estate", href: "/real-estate", marker: "R" },
  { label: "Trading", href: "/trading", marker: "T" },
  { label: "Watchlist", href: "/trading/watchlist", marker: "W" },
  { label: "Pricing", href: "/pricing", marker: "P" },
  { label: "Notifications", href: "/notifications", marker: "N" },
];

function accentClasses(accent: ProductCard["accent"]) {
  if (accent === "emerald") {
    return {
      label: "text-emerald-300/80",
      glow: "bg-emerald-400/10",
      button:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15",
      dot: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]",
    };
  }

  if (accent === "cyan") {
    return {
      label: "text-cyan-300/80",
      glow: "bg-cyan-400/10",
      button:
        "border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15",
      dot: "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]",
    };
  }

  return {
    label: "text-violet-300/80",
    glow: "bg-violet-400/10",
    button:
      "border-violet-400/20 bg-violet-400/10 text-violet-200 hover:bg-violet-400/15",
    dot: "bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.8)]",
  };
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return "0";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  });
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-white/38">
        {detail}
      </p>
    </article>
  );
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

  useEffect(() => {
    if (isSignedIn && user?.id) {
      void loadDashboard();
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
              Nestrova Intelligence Platform
            </p>

            <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.07em] md:text-7xl">
              Your intelligence dashboard is ready.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/48">
              Sign in to access Real Estate Intelligence, Trading
              Intelligence, Watchlist settings, reports, and your personalized
              platform activity.
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
                Return to platform →
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <FloatingAIAssistant />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-48 -top-52 h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-320px] top-20 h-[820px] w-[820px] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-[-360px] left-[25%] h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1700px]">
        <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 border-r border-white/10 bg-[#070707]/85 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-white text-sm font-black text-black shadow-[0_0_44px_rgba(255,255,255,0.2)]">
              N
            </div>

            <div>
              <p className="font-semibold tracking-[-0.03em]">
                Nestrova
              </p>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                Intelligence Platform
              </p>
            </div>
          </Link>

          <nav className="mt-10 grid gap-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                  item.href === "/dashboard"
                    ? "border border-white/10 bg-white/[0.08] text-white"
                    : "text-white/45 hover:bg-white/[0.055] hover:text-white"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-[10px] font-bold text-white/45 group-hover:text-white">
                  {item.marker}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.05] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30">
              Platform Access
            </p>

            <p className="mt-3 text-xl font-semibold">
              Intelligence Hub
            </p>

            <p className="mt-3 text-xs leading-6 text-white/38">
              Real Estate, Trading, Research, and personalized tools in one
              account.
            </p>

            <Link
              href="/pricing"
              className="mt-5 inline-flex w-full justify-center rounded-full bg-white px-4 py-3 text-xs font-semibold text-black transition hover:bg-neutral-200"
            >
              View Pro Access
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/78 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-5 px-5 py-4 md:px-8">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-black text-black lg:hidden"
                >
                  N
                </Link>

                <div>
                  <p className="text-sm font-semibold">
                    Nestrova Dashboard
                  </p>
                  <p className="text-xs text-white/32">
                    Your unified intelligence workspace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
  <Link
    href="/trading/briefing"
    className="hidden rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white sm:inline-flex"
  >
    Daily Briefing
  </Link>

  <NotificationBell />

  <UserButton />
</div>
            </div>

            <div className="flex gap-2 overflow-x-auto border-t border-white/[0.06] px-5 py-3 lg:hidden">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold ${
                    item.href === "/dashboard"
                      ? "border-white/20 bg-white text-black"
                      : "border-white/10 bg-white/[0.045] text-white/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

          <div className="px-5 py-8 md:px-8 md:py-10 xl:px-10">
            {message ? (
              <div className="mb-7 flex flex-col gap-4 rounded-[28px] border border-red-400/20 bg-red-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
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
                  onClick={() => void loadDashboard()}
                  className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-xs font-semibold text-red-100"
                >
                  Try Again
                </button>
              </div>
            ) : null}

            {loading ? (
              <DashboardSkeleton />
            ) : (
              <>
                <section className="relative overflow-hidden rounded-[46px] border border-white/10 bg-white/[0.06] p-7 shadow-[0_42px_140px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:p-10">
                  <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
                  <div className="absolute -bottom-40 left-[15%] h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

                  <div className="relative grid gap-10 xl:grid-cols-[1fr_390px] xl:items-end">
                    <div>
                      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                        Platform Online
                      </div>

                      <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
                        Welcome back, {displayName}.
                      </h1>

                      <p className="mt-6 max-w-3xl text-lg leading-8 text-white/48">
                        Continue your property analysis, review today&apos;s
                        market intelligence, manage your Watchlist, or explore
                        Nestrova research.
                      </p>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                          href="/analyze"
                          className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
                        >
                          Analyze Property
                        </Link>

                        <Link
                          href="/trading/briefing"
                          className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white/65 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                        >
                          Open Daily Briefing
                        </Link>
                        <Link
                          href="/notifications"
                          className="hidden rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                        >
                          Notifications
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-[34px] border border-white/10 bg-black/25 p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        AI Brief
                      </p>

                      <p className="mt-4 text-xl font-semibold leading-8 tracking-[-0.03em]">
                        {data?.ai_brief ||
                          "Your personalized intelligence brief is being prepared."}
                      </p>

                      <Link
                        href="/trading/briefing"
                        className="mt-6 inline-flex text-sm font-semibold text-cyan-200/70 transition hover:text-cyan-200"
                      >
                        View full intelligence →
                      </Link>
                    </div>
                  </div>
                </section>

                <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Property Portfolio"
                    value={formatNumber(data?.portfolio_count)}
                    detail="Properties currently tracked in your workspace."
                  />

                  <MetricCard
                    label="Average Deal Score"
                    value={formatNumber(data?.avg_deal_score)}
                    detail="Average investment quality across analyzed deals."
                  />

                  <MetricCard
                    label="Saved Deals"
                    value={formatNumber(data?.saved_deals)}
                    detail="Property opportunities saved for later review."
                  />

                  <MetricCard
                    label="Watchlist Assets"
                    value={formatNumber(data?.watchlist_count)}
                    detail="Markets saved to your private Trading Watchlist."
                  />
                </section>

                <section className="mt-12">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30">
                        My Intelligence
                      </p>

                      <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
                        One account. Multiple decision systems.
                      </h2>
                    </div>

                    <Link
                      href="/"
                      className="text-sm font-semibold text-white/42 transition hover:text-white"
                    >
                      View platform home →
                    </Link>
                  </div>

                  <div className="mt-7 grid gap-6 xl:grid-cols-3">
                    {products.map((product) => {
                      const accent = accentClasses(product.accent);

                      return (
                        <article
                          key={product.title}
                          className="group relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.05] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_30px_100px_rgba(0,0,0,0.4)]"
                        >
                          <div
                            className={`absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl ${accent.glow}`}
                          />

                          <div className="relative">
                            <div className="flex items-center gap-3">
                              <span
                                className={`h-2 w-2 rounded-full ${accent.dot}`}
                              />

                              <p
                                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${accent.label}`}
                              >
                                {product.eyebrow}
                              </p>
                            </div>

                            <h3 className="mt-6 text-4xl font-semibold tracking-[-0.055em]">
                              {product.title}
                            </h3>

                            <p className="mt-4 min-h-24 text-sm leading-7 text-white/43">
                              {product.description}
                            </p>

                            <div className="mt-7 grid grid-cols-2 gap-3">
                              {product.links.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-semibold text-white/45 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>

                            <Link
                              href={product.href}
                              className={`mt-7 inline-flex w-full justify-center rounded-full border px-5 py-3.5 text-sm font-semibold transition ${accent.button}`}
                            >
                              {product.action}
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_420px]">
                  <article className="rounded-[40px] border border-white/10 bg-white/[0.05] p-7 md:p-8">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/30">
                          Recent Activity
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                          Continue where you left off.
                        </h2>
                      </div>

                      <p className="text-sm text-white/30">
                        {data?.recent_activity?.length ?? 0} items
                      </p>
                    </div>

                    <div className="mt-7 grid gap-3">
                      {data?.recent_activity &&
                      data.recent_activity.length > 0 ? (
                        data.recent_activity.slice(0, 6).map((item, index) => (
                          <Link
                            key={`${item.href}-${index}`}
                            href={item.href || "/dashboard"}
                            className="group flex items-center justify-between gap-5 rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.055]"
                          >
                            <div>
                              <p className="font-semibold">
                                {item.title}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-white/38">
                                {item.description}
                              </p>
                            </div>

                            <span className="text-xl text-white/28 transition group-hover:translate-x-1 group-hover:text-white">
                              →
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="rounded-[26px] border border-white/10 bg-black/20 p-6">
                          <p className="font-semibold">
                            No recent activity yet.
                          </p>

                          <p className="mt-3 text-sm leading-7 text-white/40">
                            Analyze a property or add an asset to your Watchlist
                            to begin building your intelligence history.
                          </p>
                        </div>
                      )}
                    </div>
                  </article>

                  <aside className="grid gap-6">
                    <article className="rounded-[38px] border border-white/10 bg-white/[0.05] p-7">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/30">
                        Usage
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                            AI Reports
                          </p>
                          <p className="mt-2 text-2xl font-semibold">
                            {formatNumber(data?.ai_reports)}
                          </p>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                            Weekly Reports
                          </p>
                          <p className="mt-2 text-2xl font-semibold">
                            {formatNumber(data?.weekly_reports)}
                          </p>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                            Coach Plans
                          </p>
                          <p className="mt-2 text-2xl font-semibold">
                            {formatNumber(data?.coach_plans)}
                          </p>
                        </div>

                        <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                            Saved Deals
                          </p>
                          <p className="mt-2 text-2xl font-semibold">
                            {formatNumber(data?.saved_deals)}
                          </p>
                        </div>
                      </div>
                    </article>

                    <article className="rounded-[38px] border border-cyan-400/20 bg-cyan-400/[0.07] p-7">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                        Quick Launch
                      </p>

                      <div className="mt-6 grid gap-3">
                        <Link
                          href="/analyze"
                          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          Analyze a property →
                        </Link>

                        <Link
                          href="/saved"
                          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          Saved Deals →
                        </Link>

                        <Link
                          href="/reports"
                          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          My AI Reports →
                        </Link>

                        <Link
                          href="/trading/watchlist"
                          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          Manage Watchlist →
                        </Link>

                        <Link
                          href="/trading/council"
                          className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          Review AI Council →
                        </Link>
                      </div>
                    </article>
                  </aside>
                </section>
                <section className="mt-12">
  <DashboardNotifications />
</section>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
