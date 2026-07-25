"use client";

import Link from "next/link";

type FeedItem = {
  category: "Trading" | "Real Estate" | "Research" | "Alerts";
  title: string;
  description: string;
  href: string;
  action: string;
  accent: "cyan" | "emerald" | "violet" | "amber";
};

type Props = {
  aiBrief?: string | null;
  recentActivity?: Array<{
    title: string;
    description: string;
    href: string;
  }>;
  watchlistCount: number;
  alertCount: number;
  analysisRemaining: number | null;
  canUseRealEstate: boolean;
  canUseTrading: boolean;
};

const accentStyles = {
  cyan: {
    label: "text-cyan-200",
    dot: "bg-cyan-300",
    glow: "bg-cyan-400/10",
  },
  emerald: {
    label: "text-emerald-200",
    dot: "bg-emerald-300",
    glow: "bg-emerald-400/10",
  },
  violet: {
    label: "text-violet-200",
    dot: "bg-violet-300",
    glow: "bg-violet-400/10",
  },
  amber: {
    label: "text-amber-200",
    dot: "bg-amber-300",
    glow: "bg-amber-300/10",
  },
} as const;

export default function AIHomeFeed({
  aiBrief,
  recentActivity,
  watchlistCount,
  alertCount,
  analysisRemaining,
  canUseRealEstate,
  canUseTrading,
}: Props) {
  const feedItems: FeedItem[] = [
    {
      category: "Trading",
      title:
        watchlistCount > 0
          ? `${watchlistCount} assets are being monitored.`
          : "Your Trading Watchlist is ready.",
      description: canUseTrading
        ? "Nestrova is monitoring your saved assets for opportunity, risk, and regime changes."
        : "Add up to 5 assets free or unlock unlimited monitoring with Trading Pro.",
      href: "/trading/watchlist",
      action: "Open Watchlist",
      accent: "cyan",
    },
    {
      category: "Real Estate",
      title: canUseRealEstate
        ? "Unlimited property analysis is active."
        : analysisRemaining === null
          ? "Property usage is being calculated."
          : `${analysisRemaining} property analyses remain this month.`,
      description:
        "Review fair value, rental estimates, deal quality, financing, and negotiation leverage.",
      href: "/analyze",
      action: "Analyze Property",
      accent: "emerald",
    },
    {
      category: "Alerts",
      title: canUseTrading
        ? `${alertCount} active trading alerts.`
        : "Custom trading alerts are locked.",
      description: canUseTrading
        ? "Nestrova will surface meaningful score, risk, and market regime changes."
        : "Trading Pro or All Access is required to create personalized alerts.",
      href: canUseTrading ? "/notifications" : "/pricing#plans",
      action: canUseTrading ? "Review Alerts" : "View Plans",
      accent: "amber",
    },
    {
      category: "Research",
      title: "AI research systems continue monitoring.",
      description:
        aiBrief ||
        "Nestrova is preparing your latest market, property, and research intelligence.",
      href: "/research",
      action: "Open Research",
      accent: "violet",
    },
  ];

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
            AI Home Feed
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">
            What Nestrova found for you.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/38">
            A unified feed of trading, property, alert, and research
            intelligence from across your workspace.
          </p>
        </div>

        <Link
          href="/notifications"
          className="text-sm font-semibold text-white/42 transition hover:text-white"
        >
          View all updates →
        </Link>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-2">
        {feedItems.map((item) => {
          const accent = accentStyles[item.accent];

          return (
            <article
              key={item.category}
              className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.065]"
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${accent.glow}`}
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${accent.dot}`}
                  />

                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${accent.label}`}
                  >
                    {item.category}
                  </p>
                </div>

                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/40">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/58 transition group-hover:text-white"
                >
                  {item.action}
                  <span>→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {recentActivity && recentActivity.length > 0 ? (
        <div className="mt-6 rounded-[34px] border border-white/10 bg-black/20 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Latest Activity
              </p>

              <p className="mt-2 text-lg font-semibold">
                Your most recent intelligence actions
              </p>
            </div>

            <span className="text-xs text-white/25">
              {recentActivity.length} items
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {recentActivity.slice(0, 4).map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href || "/dashboard"}
                className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition hover:bg-white/[0.07]"
              >
                <p className="font-semibold">{item.title}</p>

                <p className="mt-2 text-sm leading-6 text-white/36">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}