"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const popularSymbols = [
  "NVDA",
  "AAPL",
  "BTC",
  "ETH",
  "ADA",
];

export default function ResearchQuickSearch() {
  const router = useRouter();
  const [symbol, setSymbol] = useState("");

  function openResearch(
    value: string,
  ) {
    const normalized = value
      .trim()
      .toUpperCase();

    if (!normalized) {
      return;
    }

    router.push(
      `/research/deep?symbol=${encodeURIComponent(
        normalized,
      )}`,
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    openResearch(symbol);
  }

  return (
    <div className="mt-9 max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.055] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
      >
        <input
          value={symbol}
          onChange={(event) =>
            setSymbol(event.target.value)
          }
          placeholder="Search NVDA, AAPL, BTC, ETH..."
          autoComplete="off"
          className="min-h-14 min-w-0 flex-1 bg-transparent px-4 text-base font-semibold uppercase text-white outline-none placeholder:normal-case placeholder:text-white/25"
        />

        <button
          type="submit"
          className="flex min-h-14 shrink-0 items-center justify-center rounded-[18px] bg-white px-5 text-sm font-bold text-black transition hover:bg-white/90"
        >
          Research
          <span className="ml-2">
            →
          </span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-white/28">
          Popular
        </span>

        {popularSymbols.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              openResearch(item)
            }
            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/45 transition hover:border-violet-300/25 hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
