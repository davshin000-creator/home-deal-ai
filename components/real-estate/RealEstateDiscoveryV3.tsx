"use client";

import { useState } from "react";
import Link from "next/link";
import RealEstateQuickAnalyze from "@/components/real-estate/RealEstateQuickAnalyze";

type Mode = "explore" | "analyze";

const locations = [
  { city: "Irvine", state: "CA", price: "1500000" },
  { city: "Los Angeles", state: "CA", price: "1500000" },
  { city: "Austin", state: "TX", price: "750000" },
  { city: "Miami", state: "FL", price: "700000" },
];

export default function RealEstateDiscoveryV3() {
  const [mode, setMode] = useState<Mode>("explore");
  const [city, setCity] = useState("Irvine");
  const [state, setState] = useState("CA");
  const [maxPrice, setMaxPrice] = useState("1500000");
  const [showMap, setShowMap] = useState(true);

  const area = [city.trim(), state.trim().toUpperCase()]
    .filter(Boolean)
    .join(", ");

  const mapKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapEmbedEnabled = process.env.NEXT_PUBLIC_NESTROVA_AREA_MAP_EMBED === "true";
  const mapUrl = mapEmbedEnabled && mapKey && area
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
        mapKey
      )}&q=${encodeURIComponent(area)}&zoom=11`
    : null;

  const externalMapUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      area || "United States"
    )}`;

  return (
    <section
      aria-labelledby="nestrova-property-explorer"
      className="relative isolate w-full min-w-0 max-w-full overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#101720] text-white shadow-[0_32px_100px_rgba(0,0,0,0.25)] md:rounded-[36px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(70,200,181,0.13),transparent_55%)]"
      />

      <div className="relative p-5 sm:p-7 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#46C8B5]/25 bg-[#46C8B5]/[0.08] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#85e9db]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#46C8B5]" />
            Nestrova Real Estate
          </span>

          <nav
  aria-label="Nestrova navigation"
  className="flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/70"
>
  <Link href="/home" className="transition hover:text-[#85e9db]">
    Home
  </Link>
  <Link href="/trading" className="transition hover:text-[#85e9db]">
    Radar
  </Link>
  <Link href="/research" className="transition hover:text-[#85e9db]">
    Research
  </Link>
  <Link href="/login" className="transition hover:text-[#85e9db]">
    Sign in
  </Link>
</nav>
        </div>

        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-stretch">
          <div className="min-w-0">
            <h1
              id="nestrova-property-explorer"
              className="max-w-2xl break-words text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[1.09] tracking-[-0.055em]"
            >
              Find the right property.
              <span className="mt-2 block text-[#68d9c9]">
                Understand the numbers.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-[15px]">
              Explore property opportunities by location, examine
              the area, and use AI-powered analysis to make more
              informed real estate decisions.
            </p>

            <div className="mt-8 inline-flex w-full min-w-0 max-w-md gap-1 rounded-2xl border border-white/10 bg-black/25 p-1.5 sm:w-auto">
              <button
                type="button"
                aria-pressed={mode === "explore"}
                onClick={() => setMode("explore")}
                className={`min-w-0 flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition sm:flex-none ${
                  mode === "explore"
                    ? "bg-white text-[#101720] shadow-lg"
                    : "text-white/60 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                Explore Properties
              </button>

              <button
                type="button"
                aria-pressed={mode === "analyze"}
                onClick={() => setMode("analyze")}
                className={`min-w-0 flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition sm:flex-none ${
                  mode === "analyze"
                    ? "bg-white text-[#101720] shadow-lg"
                    : "text-white/60 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                Analyze an Address
              </button>
            </div>

            {mode === "explore" ? (
              <div className="mt-6">
                <form
                  action="/deals"
                  method="get"
                  role="search"
                  className="rounded-[24px] border border-white/10 bg-white/[0.055] p-4 sm:p-5"
                >
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_100px]">
                    <label className="block min-w-0">
                      <span className="mb-2 block text-xs font-semibold text-white/65">
                        City
                      </span>
                      <input
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Search a city"
                        autoComplete="address-level2"
                        required
                        maxLength={100}
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#0B1118] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#68d9c9] focus:ring-2 focus:ring-[#68d9c9]/15"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-white/65">
                        State
                      </span>
                      <input
                        name="state"
                        value={state}
                        onChange={(e) =>
                          setState(e.target.value.toUpperCase())
                        }
                        required
                        pattern="[A-Za-z]{2}"
                        title="Enter a two-letter US state code"
                        maxLength={2}
                        placeholder="CA"
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#0B1118] px-4 text-sm uppercase text-white outline-none placeholder:text-white/30 focus:border-[#68d9c9] focus:ring-2 focus:ring-[#68d9c9]/15"
                      />
                    </label>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-white/65">
                        Maximum price
                      </span>
                      <select
                        name="max_price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-12 w-full rounded-xl border border-white/10 bg-[#0B1118] px-4 text-sm text-white outline-none focus:border-[#68d9c9] focus:ring-2 focus:ring-[#68d9c9]/15"
                      >
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
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#68d9c9] px-6 text-sm font-bold text-[#092323] transition hover:bg-[#94eee1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#94eee1]"
                    >
                      Explore opportunities
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    Popular locations
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {locations.map((item) => (
                      <button
                        type="button"
                        key={`${item.city}-${item.state}`}
                        onClick={() => {
                          setCity(item.city);
                          setState(item.state);
                          setMaxPrice(item.price);
                        }}
                        className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 text-xs font-semibold text-white/65 transition hover:border-[#68d9c9]/40 hover:bg-[#68d9c9]/10 hover:text-white"
                      >
                        {item.city}, {item.state}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 pb-5 sm:px-5">
                <p className="pt-5 text-sm leading-6 text-white/55">
                  Enter a property address to start your existing
                  Nestrova AI investment analysis.
                </p>
                <RealEstateQuickAnalyze />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-white/50">
              <Link
                href="/analyze"
                className="transition hover:text-[#68d9c9]"
              >
                Full AI property analysis ↗
              </Link>
              <Link
                href="/compare"
                className="transition hover:text-[#68d9c9]"
              >
                Compare properties ↗
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#0B1118]">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Area overview
                </p>
                <p className="mt-1 text-xs text-white/40">
                  {area || "Choose a location"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMap((current) => !current)}
                className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/65 hover:bg-white/10"
              >
                {showMap ? "Hide map" : "Show map"}
              </button>
            </div>

            {showMap ? (
              mapUrl ? (
                <iframe
                  title={`Area map for ${area}`}
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="min-h-[320px] w-full flex-1 border-0 bg-[#18232b] lg:min-h-[410px]"
                />
              ) : (
                <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(70,200,181,0.13),transparent_65%)] px-6 text-center lg:min-h-[410px]">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#68d9c9]/20 bg-[#68d9c9]/10 text-3xl text-[#68d9c9]">
                    ◇
                  </span>
                  <p className="mt-5 text-base font-semibold">
                    Explore the neighborhood
                  </p>
                  <p className="mt-2 max-w-xs text-xs leading-6 text-white/45">
                    Open the selected area in Google Maps.
                    Embedded maps can be enabled after API key authorization is verified.
                  </p>
                </div>
              )
            ) : (
              <div className="flex min-h-[160px] flex-1 items-center justify-center px-6 text-sm text-white/45">
                Map hidden
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
              <p className="max-w-[260px] text-[11px] leading-5 text-white/40">
                Geographic context only. Map markers do not represent
                verified properties for sale.
              </p>

              <a
                href={externalMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#85e9db] hover:text-white"
              >
                Open Google Maps ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:grid-cols-3">
          <div>
            <span className="font-semibold text-white/85">
              01. Explore
            </span>
            <p className="mt-1">Start with a location and budget.</p>
          </div>
          <div>
            <span className="font-semibold text-white/85">
              02. Analyze
            </span>
            <p className="mt-1">Review investment estimates and risk.</p>
          </div>
          <div>
            <span className="font-semibold text-white/85">
              03. Compare
            </span>
            <p className="mt-1">Make decisions with clearer context.</p>
          </div>
        </div>
      </div>
    </section>
  );
}