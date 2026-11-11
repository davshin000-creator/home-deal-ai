"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/components/auth/ClerkCompat";
import RealEstateAreaMapV9 from "@/components/real-estate/RealEstateAreaMapV9";
import NestrovaRealEstateSEO from "@/components/seo/NestrovaRealEstateSEO";

type Deal = {
  address: string;
  listing_price?: number | null;
  fair_value?: number | null;
  estimated_monthly_rent?: number | null;
  estimated_monthly_cash_flow?: number | null;
  gross_rent_yield?: number | null;
  deal_score?: number | null;
  status?: string | null;
};

type SearchResponse = {
  deals?: Deal[];
  detail?: string;
  count?: number;
  total_analyzed?: number;
};

type Phase = "idle" | "loading" | "results" | "error" | "signin";

function usd(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    : "—";
}

function percent(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(1)}%`
    : "—";
}

// NESTROVA_V9F4B_LINK
// Automatically start only when a positive price is available.
function propertyAnalysisHref(deal: Deal): string {
  const params = new URLSearchParams({
    address: deal.address,
    country: "US",
  });

  const price = deal.listing_price;

  if (
    typeof price === "number" &&
    Number.isFinite(price) &&
    price > 0
  ) {
    params.set("price", String(price));
    params.set("autostart", "1");
  }

  return `/analyze?${params.toString()}`;
}

export default function RealEstateWorkspaceV9() {
  const { isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<"explore" | "guide">("explore");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [mapLocation, setMapLocation] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selected, setSelected] = useState<Deal | null>(null);

  // NESTROVA_V9F3_SAVE
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [savingAddress, setSavingAddress] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState("");
  const [searchSeconds, setSearchSeconds] = useState<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [notice, setNotice] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setSavedAddresses([]);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/saved-properties", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = (await response.json()) as {
          properties?: Array<{ address?: string | null }>;
        };

        if (!cancelled && Array.isArray(payload.properties)) {
          setSavedAddresses(
            payload.properties
              .map((property) =>
                typeof property.address === "string"
                  ? property.address.trim().toLowerCase()
                  : ""
              )
              .filter(Boolean)
          );
        }
      } catch {
        // Saving remains available if the initial list fails to load.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  async function saveDeal(deal: Deal) {
    if (!isSignedIn) {
      setSaveNotice("Sign in to save this property.");
      return;
    }

    if (savingAddress !== null) return;

    const key = deal.address.trim().toLowerCase();

    if (savedAddresses.includes(key)) {
      setSaveNotice("This property is already saved.");
      return;
    }

    setSavingAddress(deal.address);
    setSaveNotice("");

    try {
      const response = await fetch("/api/saved-properties", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: deal.address,
          city: city.trim(),
          state: state.trim().toUpperCase(),
          price: deal.listing_price ?? null,
          fairValue: deal.fair_value ?? null,
          estimatedRent: deal.estimated_monthly_rent ?? null,
          brainScore: deal.deal_score ?? null,
          recommendation: deal.status ?? null,
          summary:
            "AI-analyzed investment estimates. Verify the property and current listing details independently.",
          strengths: [],
          risks: [],
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.error ?? "Could not save this property."
        );
      }

      setSavedAddresses((previous) =>
        previous.includes(key) ? previous : [...previous, key]
      );
      setSaveNotice("Property saved. Open Saved to review it.");
    } catch (error) {
      setSaveNotice(
        error instanceof Error
          ? error.message
          : "Unable to save this property."
      );
    } finally {
      setSavingAddress(null);
    }
  }

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const startedAt = performance.now();
    setSearchSeconds(null);

    const nextCity = city.trim();
    const nextState = state.trim().toUpperCase();

    if (!nextCity || !/^[A-Z]{2}$/.test(nextState)) {
      setNotice("Enter a city and two-letter state code.");
      setPhase("error");
      return;
    }

    const budget = Number(maxPrice);

    if (!Number.isFinite(budget) || budget <= 0) {
      setNotice("Select a valid maximum price.");
      setPhase("error");
      return;
    }

    requestRef.current?.abort();
    setDeals([]);
    setSelected(null);
    setMapLocation(`${nextCity}, ${nextState}`);
    setNotice("");

    if (!isSignedIn) {
      setPhase("signin");
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setPhase("loading");

    try {
      const response = await fetch("/api/find-deals", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          city: nextCity,
          state: nextState,
          max_price: budget,
          limit: 20,
        }),
      });

      const payload = (await response.json()) as SearchResponse;

      if (controller.signal.aborted) return;

      if (!response.ok) {
        setNotice(
          typeof payload.detail === "string"
            ? payload.detail
            : "Search is unavailable right now."
        );
        setPhase(response.status === 401 ? "signin" : "error");
        return;
      }

      if (!Array.isArray(payload.deals)) {
        throw new Error("Search response did not include a result list.");
      }

      const validDeals = payload.deals.filter(
        (deal): deal is Deal =>
          Boolean(deal && typeof deal.address === "string" && deal.address.trim())
      );

      setDeals(validDeals);
      setSelected(validDeals[0] ?? null);
      setSearchSeconds((performance.now() - startedAt) / 1000);
      setPhase("results");
    } catch (error) {
      if (controller.signal.aborted) return;
      setNotice(
        error instanceof Error ? error.message : "Search connection failed."
      );
      setPhase("error");
    }
  }

  return (
    <section
      aria-labelledby="nestrova-property-workspace-title"
      className="w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d151f] text-white shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
    >
      <div className="px-5 pb-8 pt-6 sm:px-8 sm:pt-8 lg:px-10">
        {!isSignedIn && (
          <div className="mb-9 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/brand/nestrova-diagonal-icon.svg"
                alt="Nestrova"
                width={32}
                height={32}
              />
              <span className="text-base font-semibold tracking-tight">
                Nestrova
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-xs font-medium text-slate-300">
              <Link href="/pricing" className="hover:text-white">
                Plans
              </Link>
              <Link href="/login" className="hover:text-white">
                Sign in
              </Link>
            </nav>
          </div>
        )}

        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7edfd1]">
            Real Estate Intelligence
          </p>
          <h1
            id="nestrova-property-workspace-title"
            className="mt-3 text-[clamp(2rem,3.5vw,3.2rem)] font-semibold leading-[1.13] tracking-[-0.05em]"
          >
            Find the right property.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Explore AI-analyzed opportunities, understand the neighborhood,
            and compare investment estimates in one workspace.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Real Estate workspace"
          className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4"
        >
          <button
            id="nestrova-explore-tab"
            role="tab"
            type="button"
            aria-selected={activeTab === "explore"}
            aria-controls="nestrova-explore-panel"
            onClick={() => setActiveTab("explore")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "explore"
                ? "bg-[#70d6c6] text-[#102523]"
                : "bg-white/[0.045] text-slate-400 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            Explore Properties
          </button>

          <button
            id="nestrova-guide-tab"
            role="tab"
            type="button"
            aria-selected={activeTab === "guide"}
            aria-controls="nestrova-guide-panel"
            onClick={() => setActiveTab("guide")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "guide"
                ? "bg-[#70d6c6] text-[#102523]"
                : "bg-white/[0.045] text-slate-400 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            Guide
          </button>
        </div>

        <div
          id="nestrova-explore-panel"
          role="tabpanel"
          aria-labelledby="nestrova-explore-tab"
          hidden={activeTab !== "explore"}
          className={activeTab === "explore" ? "block" : "hidden"}
        >
        <form
          onSubmit={(event) => void search(event)}
          role="search"
          className="mt-8 grid gap-3 rounded-[20px] border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_110px_minmax(0,0.9fr)_auto] xl:items-end"
        >
          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-medium text-slate-300">
              City
            </span>
            <input
              name="city"
              required
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter a city"
              maxLength={100}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#101a25] px-4 text-sm text-white outline-none focus:border-[#6dd6c7]"
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-medium text-slate-300">
              State
            </span>
            <input
              name="state"
               placeholder="e.g. CA"
              required
              maxLength={2}
              pattern="[a-zA-Z]{2}"
              value={state}
              onChange={(event) => setState(event.target.value.toUpperCase())}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#101a25] px-4 text-sm uppercase text-white outline-none focus:border-[#6dd6c7]"
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-medium text-slate-300">
              Maximum price
            </span>
            <select
              name="max_price"
               required
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#101a25] px-3 text-sm text-white outline-none focus:border-[#6dd6c7]"
            >
              <option value="" disabled>Select maximum price</option>
              <option value="500000">$500,000</option>
              <option value="750000">$750,000</option>
              <option value="1000000">$1,000,000</option>
              <option value="1500000">$1,500,000</option>
              <option value="2000000">$2,000,000</option>
              <option value="3000000">$3,000,000</option>
              <option value="5000000">$5,000,000</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={phase === "loading"}
            className="h-12 rounded-xl bg-[#6ed6c6] px-7 text-sm font-semibold text-[#102523] transition hover:bg-[#92e8dc] disabled:cursor-wait disabled:opacity-60"
          >
            {phase === "loading" ? "Searching..." : "Search"}
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-400">
          AI-analyzed research, not verified live MLS listings.
        </p>

        <div className="mt-8 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <section
            aria-label="Property research results"
            aria-live="polite"
            className="min-w-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#121d29]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold">Property research</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {phase === "results"
                    ? `${deals.length} analyzed results${searchSeconds !== null ? ` · ${searchSeconds.toFixed(1)}s` : ""}`
                    : "Search results appear here"}
                </p>
              </div>
            </div>

            {saveNotice && (
              <p
                role="status"
                className="border-b border-white/10 bg-[#152a36] px-5 py-3 text-xs text-[#b8e9e1]"
              >
                {saveNotice}
              </p>
            )}

            {phase === "idle" && (
              <div className="px-6 py-14 text-center text-sm leading-7 text-slate-400">
                Choose a location and search to explore investment estimates.
              </div>
            )}

            {phase === "loading" && (
              <div className="px-6 py-14 text-center text-sm text-slate-300">
                Analyzing available opportunities...
              </div>
            )}

            {phase === "signin" && (
              <div className="px-6 py-10">
                <h3 className="font-semibold">Continue with your account</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Sign in to run property research with your existing plan.
                </p>
                <Link
                  href="/login"
                  className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#101820]"
                >
                  Sign in
                </Link>
              </div>
            )}

            {phase === "error" && (
              <div className="px-6 py-10">
                <p className="text-sm font-semibold text-white">
                  Search could not be completed
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {notice}
                </p>
                <Link href="/pricing" className="mt-4 inline-block text-xs text-[#86ded2]">
                  View plan details
                </Link>
              </div>
            )}

            {phase === "results" && deals.length === 0 && (
              <div className="px-6 py-12 text-center text-sm leading-7 text-slate-400">
                No analyzed opportunities were returned for this search.
                Try another location or price range.
              </div>
            )}

            {phase === "results" && deals.length > 0 && (
              <div className="max-h-[370px] space-y-2 overflow-y-auto p-3">
                {deals.map((deal, index) => (
                  <div
                    key={`${deal.address}-${index}`}
                    className="space-y-2"
                  >
                    <button
                      type="button"
                    onClick={() => setSelected(deal)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected === deal
                        ? "border-[#67d3c3]/50 bg-[#67d3c3]/[0.09]"
                        : "border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="break-words text-sm font-semibold">
                        {deal.address}
                      </span>
                      <span className="shrink-0 text-xs text-[#8ce3d6]">
                        {typeof deal.deal_score === "number"
                          ? `Score ${Math.round(deal.deal_score)}`
                          : "Analysis"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                      <span>Price {usd(deal.listing_price)}</span>
                      <span>Rent {usd(deal.estimated_monthly_rent)}/mo</span>
                      <span>Yield {percent(deal.gross_rent_yield)}</span>
                    </div>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 px-1 pb-1">
                    <button
                      type="button"
                      onClick={() => void saveDeal(deal)}
                      disabled={
                        savingAddress !== null ||
                        savedAddresses.includes(
                          deal.address.trim().toLowerCase()
                        )
                      }
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#68d4c5]/35 bg-[#68d4c5]/[0.08] px-3 text-xs font-semibold text-[#91e8db] transition hover:bg-[#68d4c5]/[0.16] disabled:cursor-default disabled:opacity-60"
                    >
                      {savingAddress === deal.address
                        ? "Saving..."
                        : savedAddresses.includes(
                            deal.address.trim().toLowerCase()
                          )
                          ? "Saved"
                          : "Save property"}
                    </button>

                    <Link
                      href={propertyAnalysisHref(deal)}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.07]"
                    >
                      View analysis ↗
                    </Link>
                  </div>
                  </div>
                ))}
              </div>
            )}

            {selected && phase === "results" && (
              <div className="border-t border-white/10 bg-[#0f1924] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7edfd1]">
                  Selected property
                </p>
                <h3 className="mt-2 text-sm font-semibold">{selected.address}</h3>

                <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <dt className="text-slate-400">Estimated fair value</dt>
                    <dd className="mt-1 text-base font-semibold">
                      {usd(selected.fair_value)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Estimated monthly cash flow</dt>
                    <dd className="mt-1 text-base font-semibold">
                      {usd(selected.estimated_monthly_cash_flow)}
                    </dd>
                  </div>
                </dl>

                <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <summary className="cursor-pointer text-sm font-medium text-slate-200">
                    View property metrics
                  </summary>
                  <dl className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <dt className="text-slate-400">Listing price estimate</dt>
                      <dd className="mt-1 font-semibold">{usd(selected.listing_price)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Estimated monthly rent</dt>
                      <dd className="mt-1 font-semibold">{usd(selected.estimated_monthly_rent)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Gross rental yield</dt>
                      <dd className="mt-1 font-semibold">{percent(selected.gross_rent_yield)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Deal score</dt>
                      <dd className="mt-1 font-semibold">{selected.deal_score ?? "—"}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    These are research estimates, not verified listing data.
                  </p>
                </details>

                <Link
                  href={propertyAnalysisHref(selected)}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#68d4c5] px-5 py-3 text-sm font-semibold text-[#0d1724] transition hover:bg-[#91e6da]"
                >
                  Open detailed analysis ↗
                </Link>
              </div>
            )}
          </section>

          <RealEstateAreaMapV9
            location={mapLocation}
            selectedAddress={selected?.address}
          />
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-500">
          Estimates are informational and depend on available data and assumptions.
          Verify property details, current pricing, rents, and financing independently.
        </p>
        </div>

        <div
          id="nestrova-guide-panel"
          role="tabpanel"
          aria-labelledby="nestrova-guide-tab"
          hidden={activeTab !== "guide"}
          className={activeTab === "guide" ? "block" : "hidden"}
        >
          <NestrovaRealEstateSEO />
        </div>
      </div>
    </section>
  );
}