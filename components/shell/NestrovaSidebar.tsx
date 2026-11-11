"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NestrovaMark from "@/components/brand/NestrovaDiagonalMark";

type PremiumSidebarIconKind =
  | "home"
  | "property"
  | "radar"
  | "research"
  | "bell"
  | "settings";

function PremiumSidebarIcon({
  kind,
}: {
  kind: PremiumSidebarIconKind;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      {kind === "home" && (
        <>
          <path d="M3.5 10 12 3.5 20.5 10v9.5h-17V10Z" />
          <path d="M9.3 19.5v-6h5.4v6" />
        </>
      )}
      {kind === "property" && (
        <>
          <rect x="4" y="3.5" width="11" height="17" rx="1.5" />
          <path d="M15 9h5v11.5H4" />
          <path d="M7.5 7.5h4M7.5 11h4M7.5 14.5h4" />
          <path d="M9.5 20.5v-3h2v3M17.5 12.5v1.5M17.5 17v1" />
        </>
      )}
      {kind === "radar" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="1.5" />
          <path d="m12 12 5.8-5.8" />
          <path d="M12 4.5V3M20.5 12H22" />
        </>
      )}
      {kind === "research" && (
        <>
          <circle cx="10.5" cy="10.5" r="6.8" />
          <path d="m15.5 15.5 4.8 4.8" />
          <path d="M10.5 7.2v6.6M7.2 10.5h6.6" />
        </>
      )}
      {kind === "bell" && (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8.5-3 8.5h18S18 15 18 8Z" />
          <path d="M10 20h4" />
        </>
      )}
      {kind === "settings" && (
        <>
          <path d="M3 6h18M3 12h18M3 18h18" />
          <circle cx="8" cy="6" r="2" fill="#101d2b" />
          <circle cx="16" cy="12" r="2" fill="#101d2b" />
          <circle cx="10" cy="18" r="2" fill="#101d2b" />
        </>
      )}
    </svg>
  );
}

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
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    items: [
      {
        label: "Home",
        href: "/dashboard",
        icon: <PremiumSidebarIcon kind="home" />,
        tone: "neutral",
      },
    ],
  },
  {
    label: "Explore",
    items: [
      {
        label: "Real Estate",
        href: "/real-estate",
        icon: <PremiumSidebarIcon kind="property" />,
        tone: "emerald",
      },
      {
        label: "Radar",
        href: "/trading",
        icon: <PremiumSidebarIcon kind="radar" />,
        tone: "cyan",
      },
      {
        label: "Research",
        href: "/research",
        icon: <PremiumSidebarIcon kind="research" />,
        tone: "violet",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Notifications",
        href: "/notifications",
        icon: <PremiumSidebarIcon kind="bell" />,
        tone: "neutral",
      },
      {
        label: "Settings",
        href: "/settings/billing",
        icon: <PremiumSidebarIcon kind="settings" />,
        tone: "neutral",
      },
    ],
  },
];

function isCurrentPath(
  pathname: string,
  href: string,
) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  if (href === "/trading") {
    return pathname.startsWith("/trading");
  }

  if (href === "/real-estate") {
    return (
      pathname.startsWith("/real-estate") ||
      pathname.startsWith("/deals") ||
      pathname.startsWith("/analyze") ||
      pathname.startsWith("/saved") ||
      pathname.startsWith("/portfolio") ||
      pathname.startsWith("/compare") ||
      pathname.startsWith("/reports")
    );
  }

  if (href === "/research") {
    return (
      pathname.startsWith("/research") ||
      pathname.startsWith("/brain-console")
    );
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

const activeClasses: Record<
  NavigationTone,
  string
> = {
  neutral:
    "border-[#68d4c5]/25 bg-[#68d4c5]/[0.085] text-white shadow-[inset_2px_0_0_rgba(104,212,197,0.62)]",
  cyan:
    "border-[#68d4c5]/25 bg-[#68d4c5]/[0.085] text-white shadow-[inset_2px_0_0_rgba(104,212,197,0.62)]",
  emerald:
    "border-[#68d4c5]/25 bg-[#68d4c5]/[0.085] text-white shadow-[inset_2px_0_0_rgba(104,212,197,0.62)]",
  violet:
    "border-[#68d4c5]/25 bg-[#68d4c5]/[0.085] text-white shadow-[inset_2px_0_0_rgba(104,212,197,0.62)]",
};

const iconClasses: Record<
  NavigationTone,
  string
> = {
  neutral:
    "border-white/10 bg-white/[0.035] text-slate-300",
  cyan:
    "border-cyan-300/15 bg-cyan-300/[0.065] text-cyan-200",
  emerald:
    "border-emerald-300/15 bg-emerald-300/[0.065] text-emerald-200",
  violet:
    "border-violet-300/15 bg-violet-300/[0.065] text-violet-200",
};

export default function NestrovaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[228px] shrink-0 nestrova-premium-sidebar border-r border-[#34475a]/55 bg-[#101d2b]/95 px-4 py-5 text-white backdrop-blur-2xl xl:flex xl:flex-col">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-[14px] px-2.5 py-2.5 transition-colors hover:bg-white/[0.035]"
      >
        <NestrovaMark className="h-10 w-10 rounded-[13px] text-[13px]" />

        <div className="min-w-0 flex-1 overflow-visible">
          <p className="whitespace-nowrap text-[17px] font-semibold tracking-[-0.04em]">
            Nestrova
          </p>

          <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.11em] text-white/50">
            Intelligence
          </p>
        </div>
      </Link>

      <div className="mt-8 flex-1 space-y-8">
        {navigationGroups.map(
          (group, groupIndex) => (
            <div key={group.label ?? groupIndex}>
              {group.label ? (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
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
                        "group flex items-center gap-3",
                        "rounded-[14px] border px-3 py-2.5",
                        "text-sm font-semibold transition",
                        active
                          ? activeClasses[item.tone]
                          : "border-transparent text-white/42 hover:bg-white/[0.05] hover:text-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border",
                          iconClasses[item.tone],
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>

                      <span className="truncate">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ),
        )}
      </div>

      <div className="border-t border-white/10 px-3 pt-5">
        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Nestrova AI available
        </div>
      </div>
    </aside>
  );
}
