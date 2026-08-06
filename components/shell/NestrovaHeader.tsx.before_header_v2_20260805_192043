"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";
import { UserButton } from "@/components/auth/ClerkCompat";

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

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08080b]/85 backdrop-blur-2xl">
        <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current,
                )
              }
              aria-label="Open navigation"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.05] text-white/70 transition hover:bg-white/[0.09] hover:text-white xl:hidden"
            >
              <span className="grid gap-1">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>

            <Link
              href="/dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-400 to-fuchsia-500 text-sm font-black text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] xl:hidden"
            >
              N
            </Link>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/65 sm:text-[11px]">
                {greeting}, {firstName}
              </p>

              <h1 className="mt-1 truncate text-base font-bold tracking-[-0.035em] text-white sm:text-xl">
                {title}
              </h1>

              <p className="mt-1 hidden truncate text-xs text-white/30 md:block">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-[11px] font-semibold text-white/45 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
              AI Systems Online
            </div>

            <NotificationBell />

            <Link
              href="/analyze"
              className="hidden rounded-[14px] bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_14px_40px_rgba(139,92,246,0.25)] transition hover:brightness-110 md:inline-flex"
            >
              New Analysis
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
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
                <div className="relative flex h-11 w-11 items-center justify-center rounded-[16px] bg-gradient-to-br from-violet-400 to-fuchsia-500 text-lg font-black">
                  N

                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#09090d] bg-emerald-400" />
                </div>

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
                              className={`flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-semibold transition ${
                                active
                                  ? "bg-violet-400/15 text-white ring-1 ring-violet-300/20"
                                  : "text-white/45 hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border text-[11px] font-black ${
                                  active
                                    ? "border-violet-300/20 bg-violet-300/15 text-violet-200"
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
