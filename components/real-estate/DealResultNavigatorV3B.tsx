"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type DealSummary = {
  address: string;
  listing_price: number;
  estimated_monthly_cash_flow: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  overall_score?: number;
  forecast_score?: number;
  neighborhood_score?: number;
};

type SortBy = "score" | "cashflow" | "discount" | "yield";

type Props = {
  deals: DealSummary[];
  selectedAddress: string | null;
  onSelect: (address: string) => void;
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function currency(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? usd.format(value)
    : "—";
}

function percent(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(1)}%`
    : "—";
}

function overall(deal: DealSummary): number {
  if (
    typeof deal.overall_score === "number" &&
    Number.isFinite(deal.overall_score)
  ) {
    return deal.overall_score;
  }

  return Math.round(
    Number(deal.deal_score || 0) * 0.4 +
      Number(deal.forecast_score ?? 50) * 0.35 +
      Number(deal.neighborhood_score ?? 50) * 0.25
  );
}

export default function DealResultNavigatorV3B({
  deals,
  selectedAddress,
  onSelect,
}: Props) {
  const [addressFilter, setAddressFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const needle = addressFilter.trim().toLowerCase();

    return [...(Array.isArray(deals) ? deals : [])]
      .filter((deal) =>
        deal.address.toLowerCase().includes(needle)
      )
      .sort((a, b) => {
        if (sortBy === "cashflow") {
          return (
            b.estimated_monthly_cash_flow -
            a.estimated_monthly_cash_flow
          );
        }

        if (sortBy === "discount") {
          return b.discount_percent - a.discount_percent;
        }

        if (sortBy === "yield") {
          return b.gross_rent_yield - a.gross_rent_yield;
        }

        return overall(b) - overall(a);
      });
  }, [deals, addressFilter, sortBy]);

  if (!deals?.length) return null;

  const visible = showAll ? filtered : filtered.slice(0, 4);

  return (
    <section
      aria-labelledby="deal-result-navigator-title"
      className="mb-8 rounded-[28px] border border-white/10 bg-[#101821] p-5 text-white shadow-[0_26px_70px_rgba(0,0,0,0.23)] sm:p-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-[#8ce6d8]">
            Nestrova Property Intelligence
          </p>

          <h2
            id="deal-result-navigator-title"
            className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl"
          >
            Compare opportunities, simply.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
            Compare AI estimates, then open a property's
            existing map and detailed analysis.
          </p>
        </div>

        <p className="rounded-xl border border-[#46C8B5]/30 bg-[#46C8B5]/10 px-4 py-3 text-sm font-semibold text-[#8ce6d8]">
          {filtered.length} results
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="block text-xs font-semibold text-white/60">
          Filter by address

          <input
            value={addressFilter}
            type="search"
            onChange={(event) => {
              setAddressFilter(event.target.value);
              setShowAll(false);
            }}
            placeholder="Street or address"
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#46C8B5]"
          />
        </label>

        <label className="block text-xs font-semibold text-white/60">
          Sort by

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortBy)
            }
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0B1118] px-4 text-sm text-white outline-none focus:border-[#46C8B5]"
          >
            <option value="score">AI overall score</option>
            <option value="cashflow">Estimated cash flow</option>
            <option value="discount">Potential discount</option>
            <option value="yield">Gross rent yield</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {visible.map((deal, index) => (
          <article
            key={`${deal.address}-${index}`}
            className={`rounded-[22px] border p-5 transition ${
              selectedAddress === deal.address
                ? "border-[#46C8B5]/70 bg-[#46C8B5]/[0.10]"
                : "border-white/10 bg-white/[0.035] hover:border-white/25"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                  Analyzed opportunity
                </p>

                <h3 className="mt-2 break-words text-base font-semibold leading-snug">
                  {deal.address}
                </h3>

                <p className="mt-3 text-xl font-semibold">
                  {currency(deal.listing_price)}
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-[#46C8B5]/20 bg-[#46C8B5]/10 px-3 py-2 text-center">
                <p className="text-xl font-bold text-[#8ce6d8]">
                  {overall(deal)}
                </p>

                <p className="text-[10px] text-white/45">
                  AI score
                </p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <dt className="text-[11px] text-white/45">
                  Est. cash flow / mo
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {currency(deal.estimated_monthly_cash_flow)}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] text-white/45">
                  Potential discount
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {percent(deal.discount_percent)}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] text-white/45">
                  Est. monthly rent
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {currency(deal.estimated_monthly_rent)}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] text-white/45">
                  Gross rent yield
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {percent(deal.gross_rent_yield)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelect(deal.address)}
                className="rounded-xl bg-[#71dfcf] px-4 py-3 text-xs font-bold text-[#092421] transition hover:bg-[#a1f0e5]"
              >
                View map &amp; details
              </button>

              <Link
                href={`/analyze?address=${encodeURIComponent(
                  deal.address
                )}&listing_price=${encodeURIComponent(
                  String(deal.listing_price)
                )}`}
                className="rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                AI property analysis
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="mt-5 rounded-xl border border-white/10 p-5 text-center text-sm text-white/50">
          No matching addresses. Clear the filter to see all results.
        </div>
      )}

      {filtered.length > 4 && (
        <button
          type="button"
          className="mt-5 w-full rounded-xl border border-white/10 p-3 text-sm font-semibold text-white/70 hover:bg-white/5"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll
            ? "Show fewer"
            : `Show all ${filtered.length} results`}
        </button>
      )}

      <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-white/40">
        AI-assisted research results; not verified live MLS
        inventory. Confirm availability, prices, and projected
        returns independently.
      </p>
    </section>
  );
}