"use client";

import Link from "next/link";
import NestrovaMark from "@/components/brand/NestrovaMark";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";
import { UserButton } from "@/components/auth/ClerkCompat";
import {
  ArrowRightIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";

type NestrovaHeaderProps = {
  userName?: string | null;
  title?: string;
  subtitle?: string;
};

type MobileNavigationItem = {
  label: string;
  href: string;
  marker: string;
};

type MobileNavigationGroup = {
  label?: string;
  items: MobileNavigationItem[];
};

const mobileNavigation: MobileNavigationGroup[] = [
  {
    items: [
      {
        label: "Home",
        href: "/dashboard",
        marker: "H",
      },
    ],
  },
  {
    label: "Trading Intelligence",
    items: [
      {
        label: "Trading Dashboard",
        href: "/trading",
        marker: "T",
      },
      {
        label: "AI Portfolio",
        href: "/trading/portfolio",
        marker: "P",
      },
      {
        label: "Markets",
        href: "/trading/markets",
        marker: "M",
      },
      {
        label: "Watchlist",
        href: "/trading/watchlist",
        marker: "W",
      },
      {
        label: "Executive Brief",
        href: "/trading/briefing",
        marker: "E",
      },
      {
        label: "AI Council",
        href: "/trading/council",
        marker: "C",
      },
    ],
  },
  {
    label: "Real Estate Intelligence",
    items: [
      {
        label: "Property Dashboard",
        href: "/real-estate",
        marker: "R",
      },
      {
        label: "Analyze Property",
        href: "/analyze",
        marker: "A",
      },
      {
        label: "Saved Properties",
        href: "/saved",
        marker: "S",
      },
      {
        label: "Compare Deals",
        href: "/compare",
        marker: "D",
      },
      {
        label: "Reports",
        href: "/reports",
        marker: "R",
      },
    ],
  },
  {
    label: "Nestrova",
    items: [
      {
        label: "AI Brain",
        href: "/brain-console",
        marker: "B",
      },
      {
        label: "Notifications",
        href: "/notifications",
        marker: "N",
      },
      {
        label: "Billing",
        href: "/settings/billing",
        marker: "$",
      },
    ],
  },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getFirstName(
  userName?: string | null,
) {
  const normalized = String(userName ?? "")
    .trim()
    .split(/\s+/)[0];

  return normalized || "Investor";
}

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

type HeaderTheme = {
  eyebrowClasses: string;
  iconClasses: string;
  actionClasses: string;
  actionHref: string;
  actionLabel: string;
};

function getHeaderTheme(
  pathname: string,
): HeaderTheme {
  const isRealEstate =
    pathname.startsWith("/real-estate") ||
    pathname.startsWith("/analyze") ||
    pathname.startsWith("/saved") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/reports");

  if (isRealEstate) {
    return {
      eyebrowClasses: "text-emerald-200/70",
      iconClasses:
        "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
      actionClasses:
        "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/[0.16]",
      actionHref: "/analyze",
      actionLabel: "Analyze Property",
    };
  }

  const isTrading =
    pathname.startsWith("/trading");

  if (isTrading) {
    return {
      eyebrowClasses: "text-cyan-200/70",
      iconClasses:
        "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
      actionClasses:
        "border-cyan-300/20 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/[0.16]",
      actionHref: "/trading/markets",
      actionLabel: "Explore Markets",
    };
  }

  return {
    eyebrowClasses: "text-violet-200/70",
    iconClasses:
      "border-violet-300/20 bg-violet-300/10 text-violet-200",
    actionClasses:
      "border-violet-300/20 bg-violet-300/10 text-violet-100 hover:bg-violet-300/[0.16]",
    actionHref: "/trading",
    actionLabel: "Open Intelligence",
  };
}

export default function NestrovaHeader({
  userName,
  title = "Unified Intelligence",
  subtitle = "Trading and real estate intelligence in one workspace.",
}: NestrovaHeaderProps) {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const greeting = useMemo(
    () => getGreeting(),
    [],
  );

  const firstName = getFirstName(userName);
  const headerTheme = getHeaderTheme(pathname);

  const mobileActiveClasses =
    pathname.startsWith("/trading")
      ? "border-cyan-300/20 bg-cyan-300/[0.10] text-white"
      : (
          pathname.startsWith("/real-estate") ||
          pathname.startsWith("/analyze") ||
          pathname.startsWith("/saved") ||
          pathname.startsWith("/compare") ||
          pathname.startsWith("/reports")
        )
        ? "border-emerald-300/20 bg-emerald-300/[0.10] text-white"
        : "border-violet-300/20 bg-violet-300/[0.10] text-white";

  const mobileActiveIconClasses =
    pathname.startsWith("/trading")
      ? "border-cyan-300/20 bg-cyan-300/15 text-cyan-100"
      : (
          pathname.startsWith("/real-estate") ||
          pathname.startsWith("/analyze") ||
          pathname.startsWith("/saved") ||
          pathname.startsWith("/compare") ||
          pathname.startsWith("/reports")
        )
        ? "border-emerald-300/20 bg-emerald-300/15 text-emerald-100"
        : "border-violet-300/20 bg-violet-300/15 text-violet-100";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08080b]/82 backdrop-blur-2xl">
        <div className="flex min-h-[84px] min-w-0 items-center justify-between gap-4 px-4 py-4 md:px-7 xl:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current,
                )
              }
              aria-label="Open navigation"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white xl:hidden"
            >
              <span className="grid gap-1">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>

            <Link
              href="/dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-violet-400 via-fuchsia-500 to-indigo-500 text-sm font-black text-white shadow-[0_0_28px_rgba(168,85,247,0.28)] xl:hidden"
            >
              N
            </Link>

            <span
              className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border xl:flex ${headerTheme.iconClasses}`}
            >
              <SparkIcon className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p
                className={`truncate text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[11px] ${headerTheme.eyebrowClasses}`}
              >
                {greeting}, {firstName}
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-3">
                <h1 className="min-w-0 truncate text-base font-black tracking-[-0.04em] text-white sm:text-xl">
                  {title}
                </h1>

                <span className="hidden h-1 w-1 shrink-0 rounded-full bg-white/20 md:block" />

                <p className="hidden min-w-0 truncate text-xs text-white/30 md:block">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4 lg:gap-5">
            <div className="hidden items-center gap-2 rounded-[13px] border border-emerald-300/15 bg-emerald-300/[0.07] px-3.5 py-2.5 lg:flex">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.13em] text-emerald-200/70">
                  Nestrova AI
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-white/40">
                  Online · Read Only
                </p>
              </div>
            </div>

            <NotificationBell />

            <Link
              href={headerTheme.actionHref}
              className={`hidden items-center gap-2 rounded-[13px] border px-4 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 md:inline-flex ${headerTheme.actionClasses}`}
            >
              {headerTheme.actionLabel}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <div className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:ml-2">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <aside className="absolute bottom-0 left-0 top-0 w-[min(88vw,340px)] overflow-y-auto border-r border-white/10 bg-[#09090d] p-5 text-white shadow-[30px_0_100px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/dashboard"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center gap-3"
              >
                <NestrovaMark className="h-11 w-11 rounded-[14px] text-[14px]" />

                <div>
                  <p className="text-lg font-black tracking-[-0.04em]">
                    Nestrova
                  </p>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Intelligence OS
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                aria-label="Close navigation"
                className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.05] text-xl text-white/60"
              >
                ×
              </button>
            </div>

            <div className="mt-8 space-y-7">
              {mobileNavigation.map(
                (group, groupIndex) => (
                  <div
                    key={
                      group.label ??
                      groupIndex
                    }
                  >
                    {group.label ? (
                      <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                        {group.label}
                      </p>
                    ) : null}

                    <nav className="space-y-1">
                      {group.items.map(
                        (item) => {
                          const active =
                            isCurrentPath(
                              pathname,
                              item.href,
                            );

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() =>
                                setMobileMenuOpen(
                                  false,
                                )
                              }
                              className={`flex items-center gap-3 rounded-[15px] border px-3 py-2.5 text-sm font-semibold transition ${
                                active
                                  ? mobileActiveClasses
                                  : "border-transparent text-white/45 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border text-[11px] font-black ${
                                  active
                                    ? mobileActiveIconClasses
                                    : "border-white/10 bg-white/[0.04] text-white/35"
                                }`}
                              >
                                {item.marker}
                              </span>

                              {item.label}
                            </Link>
                          );
                        },
                      )}
                    </nav>
                  </div>
                ),
              )}
            </div>

            <div className="mt-8 rounded-[22px] border border-violet-300/15 bg-violet-300/[0.07] p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />

                <p className="text-xs font-semibold text-white/65">
                  Nestrova AI Online
                </p>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-white/30">
                Trading and property intelligence are available.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
