"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
  id: string;
  category: "Trading" | "Real Estate" | "Market" | "Research";
  title: string;
  description: string;
  keywords: string[];
  href: string;
};

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "btc",
    category: "Trading",
    title: "BTC",
    description: "Bitcoin market intelligence and technical analysis",
    keywords: ["bitcoin", "btc", "crypto"],
    href: "/trading/assets/BTC",
  },
  {
    id: "eth",
    category: "Trading",
    title: "ETH",
    description: "Ethereum market intelligence and technical analysis",
    keywords: ["ethereum", "eth", "crypto"],
    href: "/trading/assets/ETH",
  },
  {
    id: "nvda",
    category: "Trading",
    title: "NVDA",
    description: "NVIDIA market intelligence and technical analysis",
    keywords: ["nvidia", "nvda", "stock"],
    href: "/trading/assets/NVDA",
  },
  {
    id: "aapl",
    category: "Trading",
    title: "AAPL",
    description: "Apple market intelligence and technical analysis",
    keywords: ["apple", "aapl", "stock"],
    href: "/trading/assets/AAPL",
  },
  {
    id: "property-analysis",
    category: "Real Estate",
    title: "Analyze a Property",
    description: "Estimate fair value, rent, risk, and investment quality",
    keywords: [
      "property",
      "address",
      "house",
      "home",
      "real estate",
      "analyze",
    ],
    href: "/analyze",
  },
  {
    id: "saved-properties",
    category: "Real Estate",
    title: "Saved Properties",
    description: "Review properties saved to your workspace",
    keywords: ["saved properties", "portfolio", "homes"],
    href: "/portfolio",
  },
  {
    id: "los-angeles",
    category: "Market",
    title: "Los Angeles Market",
    description: "Explore Los Angeles real estate market intelligence",
    keywords: ["los angeles", "la", "california", "market"],
    href: "/market/los-angeles",
  },
  {
    id: "irvine",
    category: "Market",
    title: "Irvine Market",
    description: "Explore Irvine real estate market intelligence",
    keywords: ["irvine", "orange county", "california", "market"],
    href: "/market/irvine",
  },
  {
    id: "trading-briefing",
    category: "Research",
    title: "Daily Trading Briefing",
    description: "Review the latest AI market briefing",
    keywords: ["briefing", "daily", "trading", "market"],
    href: "/trading/briefing",
  },
  {
    id: "research",
    category: "Research",
    title: "Nestrova Research",
    description: "Browse strategies, discoveries, and verified intelligence",
    keywords: ["research", "strategy", "verified", "discovery"],
    href: "/research",
  },
];

function looksLikeAddress(value: string) {
  const normalized = value.trim();

  return (
    /\d/.test(normalized) &&
    normalized.split(/\s+/).length >= 2
  );
}

function looksLikeTicker(value: string) {
  return /^[a-zA-Z]{1,6}$/.test(value.trim());
}

export default function UniversalSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const matchedItems = useMemo(() => {
    if (!normalizedQuery) {
      return SEARCH_ITEMS.slice(0, 6);
    }

    return SEARCH_ITEMS.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.category,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    }).slice(0, 8);
  }, [normalizedQuery]);

  const dynamicItems = useMemo<SearchItem[]>(() => {
    if (!query.trim()) {
      return [];
    }

    const items: SearchItem[] = [];

    if (looksLikeTicker(query)) {
      const symbol = query.trim().toUpperCase();

      const alreadyExists = matchedItems.some(
        (item) =>
          item.href ===
          `/trading/assets/${encodeURIComponent(symbol)}`,
      );

      if (!alreadyExists) {
        items.push({
          id: `ticker-${symbol}`,
          category: "Trading",
          title: symbol,
          description: `Open the ${symbol} asset intelligence page`,
          keywords: [symbol],
          href: `/trading/assets/${encodeURIComponent(symbol)}`,
        });
      }
    }

    if (looksLikeAddress(query)) {
      const address = query.trim();

      items.push({
        id: `address-${address}`,
        category: "Real Estate",
        title: `Analyze "${address}"`,
        description:
          "Open the property analyzer with this address prefilled",
        keywords: [address],
        href: `/analyze?address=${encodeURIComponent(address)}`,
      });
    }

    return items;
  }, [matchedItems, query]);

  const results = [...dynamicItems, ...matchedItems].slice(0, 8);

  const showResults =
    isFocused &&
    (query.trim().length > 0 || results.length > 0);

  function navigateToResult(item: SearchItem) {
    setQuery("");
    setIsFocused(false);
    setActiveIndex(0);
    router.push(item.href);
  }

  function handleSubmit() {
    const selectedItem = results[activeIndex] ?? results[0];

    if (selectedItem) {
      navigateToResult(selectedItem);
      return;
    }

    if (looksLikeAddress(query)) {
      router.push(
        `/analyze?address=${encodeURIComponent(query.trim())}`,
      );
      return;
    }

    if (looksLikeTicker(query)) {
      router.push(
        `/trading/assets/${encodeURIComponent(
          query.trim().toUpperCase(),
        )}`,
      );
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        Math.min(
          currentIndex + 1,
          Math.max(results.length - 1, 0),
        ),
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        Math.max(currentIndex - 1, 0),
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
      return;
    }

    if (event.key === "Escape") {
      setIsFocused(false);
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.055] shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-white/28">
          ⌕
        </div>

        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
            }, 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search a stock, crypto, address, market, or report..."
          autoComplete="off"
          aria-label="Search Nestrova"
          className="h-14 w-full bg-transparent pl-12 pr-28 text-sm text-white outline-none placeholder:text-white/28"
        />

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <span className="rounded-lg border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-semibold text-white/28">
            Enter
          </span>
        </div>
      </div>

      {showResults ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a]/98 p-2 shadow-[0_28px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          {results.length > 0 ? (
            <div className="grid gap-1">
              {results.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    navigateToResult(item);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between gap-5 rounded-[20px] px-4 py-3.5 text-left transition ${
                    index === activeIndex
                      ? "bg-white/[0.09]"
                      : "hover:bg-white/[0.055]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
                        {item.category}
                      </span>

                      <p className="truncate text-sm font-semibold text-white">
                        {item.title}
                      </p>
                    </div>

                    <p className="mt-2 truncate text-xs text-white/34">
                      {item.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-white/24">
                    →
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
              <p className="font-semibold">
                No matching result
              </p>

              <p className="mt-2 text-sm leading-6 text-white/35">
                Try a ticker such as NVDA, a cryptocurrency such as
                BTC, or a complete property address.
              </p>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between border-t border-white/10 px-4 py-3 text-[10px] text-white/24">
            <span>↑↓ Navigate</span>
            <span>Enter Open</span>
            <span>Esc Close</span>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[
          ["BTC", "/trading/assets/BTC"],
          ["NVDA", "/trading/assets/NVDA"],
          ["Analyze Property", "/analyze"],
          ["Daily Briefing", "/trading/briefing"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold text-white/32 transition hover:bg-white/[0.07] hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}