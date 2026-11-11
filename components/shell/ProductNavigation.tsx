"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProductNavigationItem = {
  label: string;
  href: string;
  activePaths?: string[];
};

const realEstateNavigation: ProductNavigationItem[] = [
  {
    label: "Explore",
    href: "/real-estate",
  },
  {
    label: "Saved",
    href: "/saved",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
];

const tradingNavigation: ProductNavigationItem[] = [
  {
    label: "Overview",
    href: "/trading",
  },
  {
    label: "Markets",
    href: "/trading/markets",
  },
  {
    label: "Watchlist",
    href: "/trading/watchlist",
  },
  {
    label: "Portfolio",
    href: "/trading/portfolio",
  },
  {
    label: "Briefing",
    href: "/trading/briefing",
  },
];

function isActivePath(
  pathname: string,
  item: ProductNavigationItem,
) {
  const paths = item.activePaths ?? [item.href];

  return paths.some((path) => {
    if (
      path === "/real-estate" ||
      path === "/trading"
    ) {
      return pathname === path;
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  });
}

function isRealEstatePath(pathname: string) {
  return (
    pathname === "/real-estate" ||
    pathname.startsWith("/real-estate/") ||
    pathname === "/deals" ||
    pathname.startsWith("/deals/") ||
    pathname === "/analyze" ||
    pathname.startsWith("/analyze/") ||
    pathname === "/saved" ||
    pathname.startsWith("/saved/") ||
    pathname === "/portfolio" ||
    pathname.startsWith("/portfolio/")
  );
}

function isTradingPath(pathname: string) {
  return (
    pathname === "/trading" ||
    pathname.startsWith("/trading/")
  );
}

export default function ProductNavigation() {
  const pathname = usePathname();

  const realEstate = isRealEstatePath(pathname);
  const trading = isTradingPath(pathname);

  if (!realEstate && !trading) {
    return null;
  }

  const navigation = trading
    ? tradingNavigation
    : realEstateNavigation;

  const navigationLabel = trading
    ? "Trading navigation"
    : "Real Estate navigation";

  const activeClassName = trading
    ? "border-cyan-300/25 bg-cyan-300/[0.085] text-cyan-50"
    : "border-[#68d4c5]/25 bg-[#68d4c5]/[0.085] text-[#eafffa]";

  return (
    <div className="sticky top-[72px] z-30 nestrova-premium-tabs border-b border-[#34475a]/55 bg-[#101d2b]/95 backdrop-blur-2xl">
      <div className="overflow-x-auto">
        <nav
          aria-label={navigationLabel}
          className="mx-auto flex min-w-max items-center gap-1.5 px-4 py-2.5 md:px-7 xl:px-8"
        >
          {navigation.map((item) => {
            const active = isActivePath(
              pathname,
              item,
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active ? "page" : undefined
                }
                className={[
                  "nestrova-segment-tab inline-flex min-h-10 shrink-0 items-center rounded-[10px] border px-4 py-2",
                  "text-xs font-medium tracking-[-0.01em] transition-colors duration-150",
                  active
                    ? activeClassName
                    : "border-transparent text-slate-300/75 hover:border-white/10 hover:bg-white/[0.045] hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}