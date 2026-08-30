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
    label: "Overview",
    href: "/real-estate",
  },
  {
    label: "Search",
    href: "/deals",
  },
  {
    label: "Analyze",
    href: "/analyze",
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

function isActivePath(
  pathname: string,
  item: ProductNavigationItem,
) {
  const paths = item.activePaths ?? [item.href];

  return paths.some((path) => {
    if (path === "/real-estate") {
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

export default function ProductNavigation() {
  const pathname = usePathname();

  if (!isRealEstatePath(pathname)) {
    return null;
  }

  return (
    <div className="sticky top-[72px] z-30 border-b border-white/10 bg-[#08080b]/90 backdrop-blur-2xl">
      <div className="overflow-x-auto">
        <nav
          aria-label="Real Estate navigation"
          className="mx-auto flex min-w-max items-center gap-1 px-4 py-2.5 md:px-7 xl:px-8"
        >
          {realEstateNavigation.map((item) => {
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
                  "shrink-0 rounded-[12px] border px-3.5 py-2",
                  "text-xs font-semibold transition",
                  active
                    ? "border-emerald-300/20 bg-emerald-300/[0.11] text-emerald-100"
                    : "border-transparent text-white/40 hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
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