"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BellIcon,
  BillingIcon,
  BookmarkIcon,
  BrainIcon,
  CompareIcon,
  CouncilIcon,
  DocumentIcon,
  HomeIcon,
  LayersIcon,
  MarketsIcon,
  PortfolioIcon,
  PropertyIcon,
  SearchPropertyIcon,
  SparkIcon,
  WatchlistIcon,
} from "@/components/ui/NestrovaIcons";

type NavigationTone =
  | "neutral"
  | "cyan"
  | "emerald"
  | "violet";

type NavigationItem = {
  label: string;
  href: string;
  icon: ReactNode;
  tone: NavigationTone;
};

type NavigationGroup = {
  label?: string;
  tone?: NavigationTone;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: <HomeIcon className="h-4 w-4" />,
        tone: "neutral",
      },
    ],
  },
  {
    label: "Trading Intelligence",
    tone: "cyan",
    items: [
      {
        label: "Trading Dashboard",
        href: "/trading",
        icon: <MarketsIcon className="h-4 w-4" />,
        tone: "cyan",
      },
      {
        label: "AI Portfolio",
        href: "/trading/portfolio",
        icon: <PortfolioIcon className="h-4 w-4" />,
        tone: "cyan",
      },
      {
        label: "Markets",
        href: "/trading/markets",
        icon: <LayersIcon className="h-4 w-4" />,
        tone: "cyan",
      },
      {
        label: "Watchlist",
        href: "/trading/watchlist",
        icon: <WatchlistIcon className="h-4 w-4" />,
        tone: "cyan",
      },
      {
        label: "Executive Brief",
        href: "/trading/briefing",
        icon: <DocumentIcon className="h-4 w-4" />,
        tone: "cyan",
      },
      {
        label: "AI Council",
        href: "/trading/council",
        icon: <CouncilIcon className="h-4 w-4" />,
        tone: "cyan",
      },
    ],
  },
  {
    label: "Real Estate Intelligence",
    tone: "emerald",
    items: [
      {
        label: "Property Dashboard",
        href: "/real-estate",
        icon: <PropertyIcon className="h-4 w-4" />,
        tone: "emerald",
      },
      {
        label: "Analyze Property",
        href: "/analyze",
        icon: <SearchPropertyIcon className="h-4 w-4" />,
        tone: "emerald",
      },
      {
        label: "Saved Properties",
        href: "/saved",
        icon: <BookmarkIcon className="h-4 w-4" />,
        tone: "emerald",
      },
      {
        label: "Compare Deals",
        href: "/compare",
        icon: <CompareIcon className="h-4 w-4" />,
        tone: "emerald",
      },
      {
        label: "Reports",
        href: "/reports",
        icon: <DocumentIcon className="h-4 w-4" />,
        tone: "emerald",
      },
    ],
  },
  {
    label: "Nestrova",
    tone: "violet",
    items: [
      {
        label: "AI Brain",
        href: "/brain-console",
        icon: <BrainIcon className="h-4 w-4" />,
        tone: "violet",
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: <BellIcon className="h-4 w-4" />,
        tone: "violet",
      },
      {
        label: "Billing",
        href: "/settings/billing",
        icon: <BillingIcon className="h-4 w-4" />,
        tone: "violet",
      },
    ],
  },
];

const activeClasses: Record<
  NavigationTone,
  string
> = {
  neutral:
    "border-white/15 bg-white/[0.08] text-white shadow-[0_10px_35px_rgba(0,0,0,0.22)]",
  cyan:
    "border-cyan-300/20 bg-cyan-300/[0.10] text-white shadow-[0_12px_38px_rgba(34,211,238,0.08)]",
  emerald:
    "border-emerald-300/20 bg-emerald-300/[0.10] text-white shadow-[0_12px_38px_rgba(52,211,153,0.08)]",
  violet:
    "border-violet-300/20 bg-violet-300/[0.10] text-white shadow-[0_12px_38px_rgba(139,92,246,0.09)]",
};

const iconActiveClasses: Record<
  NavigationTone,
  string
> = {
  neutral:
    "border-white/15 bg-white/[0.09] text-white",
  cyan:
    "border-cyan-300/20 bg-cyan-300/15 text-cyan-100",
  emerald:
    "border-emerald-300/20 bg-emerald-300/15 text-emerald-100",
  violet:
    "border-violet-300/20 bg-violet-300/15 text-violet-100",
};

const groupLabelClasses: Record<
  NavigationTone,
  string
> = {
  neutral: "text-white/25",
  cyan: "text-cyan-200/35",
  emerald: "text-emerald-200/35",
  violet: "text-violet-200/35",
};

function isCurrentPath(
  pathname: string,
  href: string,
) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function NestrovaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 border-r border-white/10 bg-[#07070a]/95 px-4 py-5 text-white backdrop-blur-2xl xl:flex xl:flex-col">
      <Link
        href="/dashboard"
        className="group flex items-center gap-3 rounded-[20px] border border-transparent px-3 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
      >
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-gradient-to-br from-violet-400 via-fuchsia-500 to-indigo-500 text-lg font-black text-white shadow-[0_0_38px_rgba(168,85,247,0.34)]">
          N

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#07070a] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-[-0.045em]">
            Nestrova
          </p>

          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.19em] text-white/30">
            Intelligence Platform
          </p>
        </div>
      </Link>

      <div className="mt-6 flex-1 space-y-7 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {navigationGroups.map(
          (group, groupIndex) => (
            <div key={group.label ?? groupIndex}>
              {group.label ? (
                <p
                  className={`mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] ${
                    groupLabelClasses[
                      group.tone ?? "neutral"
                    ]
                  }`}
                >
                  {group.label}
                </p>
              ) : null}

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const active = isCurrentPath(
                    pathname,
                    item.href,
                  );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={
                        active ? "page" : undefined
                      }
                      className={[
                        "group flex min-w-0 items-center gap-3",
                        "rounded-[15px] border px-3 py-2.5",
                        "text-sm font-semibold transition duration-200",
                        active
                          ? activeClasses[item.tone]
                          : "border-transparent text-white/42 hover:border-white/10 hover:bg-white/[0.055] hover:text-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center",
                          "rounded-[10px] border transition duration-200",
                          active
                            ? iconActiveClasses[
                                item.tone
                              ]
                            : "border-white/10 bg-white/[0.04] text-white/35 group-hover:border-white/15 group-hover:text-white/75",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>

                      {active ? (
                        <span
                          className={[
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            item.tone === "cyan"
                              ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"
                              : item.tone ===
                                  "emerald"
                                ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]"
                                : item.tone ===
                                    "violet"
                                  ? "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]"
                                  : "bg-white",
                          ].join(" ")}
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ),
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-violet-300/15 bg-[linear-gradient(145deg,rgba(139,92,246,0.11),rgba(255,255,255,0.035))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-45" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            <p className="truncate text-xs font-bold text-white/72">
              Nestrova AI
            </p>
          </div>

          <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-emerald-200">
            Online
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-[13px] border border-white/10 bg-black/20 px-3 py-2.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
              Mode
            </p>

            <p className="mt-1.5 text-[10px] font-semibold text-cyan-100/70">
              Read Only
            </p>
          </div>

          <div className="rounded-[13px] border border-white/10 bg-black/20 px-3 py-2.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
              Research
            </p>

            <p className="mt-1.5 text-[10px] font-semibold text-violet-100/70">
              Shadow
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            "Crypto",
            "U.S. Stocks",
            "Real Estate",
          ].map((coverage) => (
            <span
              key={coverage}
              className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[8px] font-semibold text-white/35"
            >
              {coverage}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-[9px] text-white/28">
          <SparkIcon className="h-3.5 w-3.5 shrink-0 text-violet-200/45" />

          <span className="truncate">
            Intelligence systems available
          </span>
        </div>
      </div>
    </aside>
  );
}
