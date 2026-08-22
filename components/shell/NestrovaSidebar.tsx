"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NestrovaMark from "@/components/brand/NestrovaMark";

import {
  BellIcon,
  BillingIcon,
  HomeIcon,
  MarketsIcon,
  PropertyIcon,
  BrainIcon,
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
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    items: [
      {
        label: "Home",
        href: "/dashboard",
        icon: <HomeIcon className="h-4 w-4" />,
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
        icon: <PropertyIcon className="h-4 w-4" />,
        tone: "emerald",
      },
      {
        label: "Trading",
        href: "/trading",
        icon: <MarketsIcon className="h-4 w-4" />,
        tone: "cyan",
      },
      {
        label: "Research",
        href: "/research",
        icon: <BrainIcon className="h-4 w-4" />,
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
        icon: <BellIcon className="h-4 w-4" />,
        tone: "neutral",
      },
      {
        label: "Settings",
        href: "/settings/billing",
        icon: <BillingIcon className="h-4 w-4" />,
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
      pathname.startsWith("/analyze") ||
      pathname.startsWith("/saved") ||
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
    "border-white/15 bg-white/[0.08] text-white",
  cyan:
    "border-cyan-300/20 bg-cyan-300/[0.10] text-white",
  emerald:
    "border-emerald-300/20 bg-emerald-300/[0.10] text-white",
  violet:
    "border-violet-300/20 bg-violet-300/[0.10] text-white",
};

const iconClasses: Record<
  NavigationTone,
  string
> = {
  neutral:
    "border-white/10 bg-white/[0.05] text-white/55",
  cyan:
    "border-cyan-300/15 bg-cyan-300/10 text-cyan-200",
  emerald:
    "border-emerald-300/15 bg-emerald-300/10 text-emerald-200",
  violet:
    "border-violet-300/15 bg-violet-300/10 text-violet-200",
};

export default function NestrovaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[244px] shrink-0 border-r border-white/10 bg-[#07070a]/95 px-4 py-5 text-white backdrop-blur-2xl xl:flex xl:flex-col">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-[18px] px-3 py-3"
      >
        <NestrovaMark className="h-10 w-10 rounded-[13px] text-[13px]" />

        <div className="min-w-0 flex-1 overflow-visible">
          <p className="whitespace-nowrap text-lg font-black tracking-[-0.045em]">
            Nestrova
          </p>

          <p className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.11em] text-white/28">
            Intelligence Platform
          </p>
        </div>
      </Link>

      <div className="mt-8 flex-1 space-y-8">
        {navigationGroups.map(
          (group, groupIndex) => (
            <div key={group.label ?? groupIndex}>
              {group.label ? (
                <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/22">
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
        <div className="flex items-center gap-2 text-[11px] text-white/28">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Nestrova AI available
        </div>
      </div>
    </aside>
  );
}
