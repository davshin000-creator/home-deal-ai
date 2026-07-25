"use client";

import { useMemo } from "react";

type Props = {
  symbol: string;
  assetType: "stock" | "crypto" | "etf";
};

export default function TradingViewChart({
  symbol,
  assetType,
}: Props) {
  const tradingViewSymbol = useMemo(() => {
    const s = symbol.toUpperCase();

    if (assetType === "crypto") {
      return `BINANCE:${s}USDT`;
    }

    if (assetType === "etf") {
      return `AMEX:${s}`;
    }

    return `NASDAQ:${s}`;
  }, [symbol, assetType]);

  const url =
    `https://s.tradingview.com/widgetembed/?` +
    `symbol=${encodeURIComponent(tradingViewSymbol)}` +
    `&interval=240` +
    `&theme=dark` +
    `&style=1` +
    `&toolbarbg=1f2937` +
    `&hide_top_toolbar=0` +
    `&hide_side_toolbar=0` +
    `&allow_symbol_change=1` +
    `&save_image=0`;

  return (
    <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300/70">
            Live Market Chart
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {symbol}
          </h2>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
          TradingView
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <iframe
          src={url}
          title="TradingView"
          width="100%"
          height="620"
          frameBorder="0"
        />
      </div>
    </section>
  );
}