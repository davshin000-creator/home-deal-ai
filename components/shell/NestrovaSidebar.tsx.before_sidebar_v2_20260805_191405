"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
  icon: string;
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
        icon: "⌂",
      },
    ],
  },
  {
    label: "Trading Intelligence",
    items: [
      {
        label: "Trading Dashboard",
        href: "/trading",
        icon: "T",
      },
      {
        label: "AI Portfolio",
        href: "/trading/portfolio",
        icon: "P",
      },
      {
        label: "Markets",
        href: "/trading/markets",
        icon: "M",
      },
      {
        label: "Watchlist",
        href: "/trading/watchlist",
        icon: "W",
      },
      {
        label: "Executive Brief",
        href: "/trading/briefing",
        icon: "E",
      },
      {
        label: "AI Council",
        href: "/trading/council",
        icon: "C",
      },
    ],
  },
  {
    label: "Real Estate Intelligence",
    items: [
      {
        label: "Property Dashboard",
        href: "/real-estate",
        icon: "R",
      },
      {
        label: "Analyze Property",
        href: "/analyze",
        icon: "A",
      },
      {
        label: "Saved Properties",
        href: "/saved",
        icon: "S",
      },
      {
        label: "Compare Deals",
        href: "/compare",
        icon: "D",
      },
      {
        label: "Reports",
        href: "/reports",
        icon: "R",
      },
    ],
  },
  {
    label: "Nestrova",
    items: [
      {
        label: "AI Brain",
        href: "/brain-console",
        icon: "B",
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: "N",
      },
      {
        label: "Billing",
        href: "/settings/billing",
        icon: "$",
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

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function NestrovaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-white/10 bg-[#07070a]/95 px-4 py-5 text-white backdrop-blur-2xl xl:flex xl:flex-col">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-[22px] px-3 py-3"
      >
        <div className="relative flex h-11 w-11 items-center justify-center rounded-[16px] bg-gradient-to-br from-violet-400 to-fuchsia-500 text-lg font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)]">
          N

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#07070a] bg-emerald-400" />
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

      <div className="mt-6 flex-1 space-y-7 overflow-y-auto pr-1">
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex}>
            {group.label ? (
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
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
                    className={`group flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-violet-400/15 text-white ring-1 ring-violet-300/20"
                        : "text-white/42 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] border text-[11px] font-black ${
                        active
                          ? "border-violet-300/20 bg-violet-300/15 text-violet-200"
                          : "border-white/10 bg-white/[0.04] text-white/35 group-hover:text-white/70"
                      }`}
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
        ))}
      </div>

      <div className="mt-5 rounded-[22px] border border-violet-300/15 bg-violet-300/[0.07] p-4">
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
  );
}
