"use client";

import {
  useMemo,
  useState,
} from "react";

export type ResearchSearchAsset = {
  symbol: string;
  name?: string;
  asset_type?: string;
  market?: string;
  exchange?: string;
  is_etf?: boolean;
};

type ResearchSymbolSearchProps = {
  value: string;
  onChange: (value: string) => void;
  assets: ResearchSearchAsset[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
};

export default function ResearchSymbolSearch({
  value,
  onChange,
  assets,
  placeholder = "Search symbol or company",
  disabled = false,
  label,
}: ResearchSymbolSearchProps) {
  const [focused, setFocused] =
    useState(false);

  const query =
    value.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!query) {
      return assets.slice(0, 8);
    }

    return assets
      .filter((asset) => {
        const symbol =
          asset.symbol.toLowerCase();

        const name =
          asset.name?.toLowerCase() ?? "";

        return (
          symbol.includes(query) ||
          name.includes(query)
        );
      })
      .sort((a, b) => {
        const aSymbol =
          a.symbol.toLowerCase();

        const bSymbol =
          b.symbol.toLowerCase();

        const aExact =
          aSymbol === query ? 0 : 1;

        const bExact =
          bSymbol === query ? 0 : 1;

        if (aExact !== bExact) {
          return aExact - bExact;
        }

        const aStarts =
          aSymbol.startsWith(query)
            ? 0
            : 1;

        const bStarts =
          bSymbol.startsWith(query)
            ? 0
            : 1;

        if (aStarts !== bStarts) {
          return aStarts - bStarts;
        }

        return a.symbol.localeCompare(
          b.symbol,
        );
      })
      .slice(0, 10);
  }, [assets, query]);

  return (
    <div className="relative">
      {label ? (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
          {label}
        </label>
      ) : null}

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setFocused(false);
          }, 120);
        }}
        onChange={(event) => {
          onChange(
            event.target.value.toUpperCase(),
          );
        }}
        className="
          w-full rounded-2xl
          border border-white/10
          bg-white/[0.05]
          px-4 py-3
          text-sm font-semibold text-white
          outline-none
          placeholder:text-white/30
          focus:border-white/25
          focus:bg-white/[0.07]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      />

      {focused &&
      matches.length > 0 ? (
        <div
          className="
            absolute left-0 right-0 top-full
            z-50 mt-2 max-h-80
            overflow-y-auto rounded-2xl
            border border-white/10
            bg-[#090909]
            p-2 shadow-2xl
          "
        >
          {matches.map((asset) => (
            <button
              key={[
                asset.market,
                asset.exchange,
                asset.symbol,
              ].join(":")}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();

                onChange(asset.symbol);

                setFocused(false);
              }}
              className="
                flex w-full items-center
                justify-between gap-4
                rounded-xl px-3 py-3
                text-left
                transition
                hover:bg-white/[0.07]
              "
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white">
                    {asset.symbol}
                  </span>

                  {asset.is_etf ? (
                    <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">
                      ETF
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 truncate text-xs text-white/45">
                  {asset.name ||
                    "U.S. listed security"}
                </p>
              </div>

              <div className="shrink-0 text-right text-[10px] font-semibold uppercase tracking-wider text-white/30">
                <p>{asset.market || "US"}</p>
                <p>
                  {asset.exchange || ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
