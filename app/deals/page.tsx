"use client";

import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";
import { supabase } from "@/lib/supabase";

type Deal = {
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  overall_score?: number;
  forecast_score?: number;
  forecast_outlook?: string;
  neighborhood_score?: number;
  neighborhood_grade?: string;
  expected_appreciation?: number;
  confidence_score?: number;
  status: string;
  estimated_monthly_cash_flow: number;
};

type FindDealsResult = {
  city: string;
  state: string;
  max_price: number;
  plan?: string;
  result_limit?: number;
  total_analyzed?: number;
  count?: number;
  deals: Deal[];
};

const STARTER_MARKETS = [
  { city: "Irvine", state: "CA", maxPrice: "1500000" },
  { city: "Austin", state: "TX", maxPrice: "750000" },
  { city: "Miami", state: "FL", maxPrice: "700000" },
  { city: "Phoenix", state: "AZ", maxPrice: "650000" },
  { city: "Dallas", state: "TX", maxPrice: "650000" },
];

const brainModules = ["Valuation", "Rent", "Risk", "Forecast", "Negotiation", "Portfolio"];

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function getDealOverallScore(deal: Deal) {
  if (deal.overall_score !== undefined && deal.overall_score !== null) {
    return Number(deal.overall_score);
  }

  const dealScore = Number(deal.deal_score || 0);
  const forecastScore = Number(deal.forecast_score || 50);
  const neighborhoodScore = Number(deal.neighborhood_score || 50);

  return Math.round(
    dealScore * 0.4 + forecastScore * 0.35 + neighborhoodScore * 0.25
  );
}

function getInvestmentGrade(score: number) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  return "D";
}

function getVerdictColor(status: string) {
  const value = status.toLowerCase();
  if (value.includes("under") || value.includes("buy") || value.includes("strong")) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }
  if (value.includes("over") || value.includes("risk") || value.includes("pass")) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }
  return "border-amber-300/20 bg-amber-300/10 text-amber-200";
}

export default function DealsPage() {
  const { isSignedIn, user } = useUser();

  const [city, setCity] = useState("Irvine");
  const [state, setState] = useState("CA");
  const [maxPrice, setMaxPrice] = useState("1500000");
  const [sortBy, setSortBy] = useState("overall");

  const [result, setResult] = useState<FindDealsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function findDeals(customCity?: string, customState?: string, customMaxPrice?: string) {
    const finalCity = customCity || city;
    const finalState = customState || state;
    const finalMaxPrice = customMaxPrice || maxPrice;

    setMessage("");
    setLoading(true);
    setResult(null);

    if (!finalCity.trim()) {
      setMessage("City is required.");
      setLoading(false);
      return;
    }

    if (!finalState.trim()) {
      setMessage("State is required.");
      setLoading(false);
      return;
    }

    if (!finalMaxPrice || Number(finalMaxPrice) <= 0) {
      setMessage("Please enter a valid max price.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/find-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: finalCity,
          state: finalState,
          max_price: Number(finalMaxPrice),
          limit: 20,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.detail || "Could not find deals.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setMessage("Server connection failed.");
    }

    setLoading(false);
  }

  async function saveDeal(deal: Deal) {
    setMessage("");

    if (!isSignedIn || !user?.id) {
      setMessage("Please sign in to save deals.");
      return;
    }

    const { data: existingDeal } = await supabase
      .from("saved_deals")
      .select("id")
      .eq("user_id", user.id)
      .eq("address", deal.address)
      .maybeSingle();

    if (existingDeal) {
      setMessage("This property is already in your portfolio.");
      return;
    }

    const { error } = await supabase.from("saved_deals").insert({
      user_id: user.id,
      address: deal.address,
      listing_price: deal.listing_price,
      fair_value: deal.fair_value,
      estimated_monthly_rent: deal.estimated_monthly_rent,
      discount_percent: deal.discount_percent,
      gross_rent_yield: deal.gross_rent_yield,
      deal_score: deal.deal_score,
      status: deal.status,
      estimated_monthly_cash_flow: deal.estimated_monthly_cash_flow,
    });

    if (error) {
      setMessage("Could not save this deal.");
      return;
    }

    setMessage("Deal saved to your portfolio.");
  }

  function useStarterMarket(market: { city: string; state: string; maxPrice: string }) {
    setCity(market.city);
    setState(market.state);
    setMaxPrice(market.maxPrice);
    findDeals(market.city, market.state, market.maxPrice);
  }

  const sortedDeals = [...(result?.deals || [])].sort((a, b) => {
    if (sortBy === "yield") {
      return Number(b.gross_rent_yield || 0) - Number(a.gross_rent_yield || 0);
    }

    if (sortBy === "cashflow") {
      return (
        Number(b.estimated_monthly_cash_flow || 0) -
        Number(a.estimated_monthly_cash_flow || 0)
      );
    }

    if (sortBy === "discount") {
      return Number(b.discount_percent || 0) - Number(a.discount_percent || 0);
    }

    return getDealOverallScore(b) - getDealOverallScore(a);
  });

  const topDeal = sortedDeals[0];
  const topScore = topDeal ? getDealOverallScore(topDeal) : 94;
  const totalAnalyzed = result?.total_analyzed || result?.count || sortedDeals.length || 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-white/[0.075] blur-3xl" />
        <div className="absolute right-[-260px] top-10 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[780px] w-[780px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-6 md:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <a
            href="/"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            ??Back to Nestrova
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/portfolio"
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              Portfolio
            </a>

            {isSignedIn ? (
              <div className="rounded-full border border-white/10 bg-white/[0.06] p-1">
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
          <div className="rounded-[44px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
              Secure Deal Finder
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              Find high-potential real estate deals before the market notices.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
              Search a market, rank properties by investment quality, and save the strongest opportunities to your portfolio.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-5">
              <input
                className="h-14 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                className="h-14 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
              />

              <input
                className="h-14 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <select
                className="h-14 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none focus:border-white/25"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="overall">Overall Score</option>
                <option value="yield">Rent Yield</option>
                <option value="cashflow">Cash Flow</option>
                <option value="discount">Discount</option>
              </select>

              <button
                onClick={() => findDeals()}
                disabled={loading}
                className="h-14 rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-[0_24px_80px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/30"
              >
                {loading ? "Scanning..." : "Find Deals"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {STARTER_MARKETS.map((market) => (
                <button
                  key={`${market.city}-${market.state}`}
                  onClick={() => useStarterMarket(market)}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
                >
                  {market.city}, {market.state}
                </button>
              ))}
            </div>

            {message && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm text-white/70">
                {message}
              </div>
            )}
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  Live Deal Brain
                </p>
                <h2 className="mt-3 text-6xl font-semibold tracking-[-0.07em]">
                  {topDeal ? getInvestmentGrade(topScore) : "AI"}
                </h2>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Online
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-white/55">
              {topDeal
                ? `${topDeal.address} is currently the strongest match in this search.`
                : "Nestrova is ready to scan valuation, rent, risk, forecast, and negotiation signals."}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Top Score
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{topScore}</p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Analyzed
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{totalAnalyzed}</p>
              </div>
            </div>

            <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Agent Stack
                </p>
                <p className="text-xs font-semibold text-emerald-300">
                  {loading ? "Scanning" : "Synchronized"}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.75)] ${
                    loading ? "w-[58%]" : "w-[86%]"
                  }`}
                />
              </div>

              <div className="mt-5 grid gap-3">
                {brainModules.map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3 text-sm text-white/58">
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.85)]" />
                      {item}
                    </span>
                    <span className="text-xs text-white/30">ready</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {loading && (
          <section className="mt-8 grid gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse rounded-[34px] border border-white/10 bg-white/[0.055] p-6">
                <div className="h-5 w-48 rounded-full bg-white/10" />
                <div className="mt-5 h-8 w-2/3 rounded-full bg-white/10" />
                <div className="mt-6 grid gap-4 md:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((metric) => (
                    <div key={metric} className="h-16 rounded-2xl bg-white/10" />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {result && (
          <section className="mt-8 rounded-[44px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  {sortedDeals.length} results
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                  Best deals in {result.city}, {result.state}
                </h2>
                <p className="mt-3 text-sm text-white/45">
                  Total analyzed: {totalAnalyzed}
                </p>
              </div>

              <a
                href="/portfolio"
                className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                View Portfolio
              </a>
            </div>

            <div className="grid gap-5">
              {sortedDeals.map((deal, index) => {
                const overallScore = getDealOverallScore(deal);
                const grade = getInvestmentGrade(overallScore);

                return (
                  <div
                    key={`${deal.address}-${index}`}
                    className="rounded-[34px] border border-white/10 bg-black/20 p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.055]"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                          #{index + 1} Investment Match
                        </p>

                        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                          {deal.address}
                        </h3>

                        <div
                          className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${getVerdictColor(
                            deal.status
                          )}`}
                        >
                          {deal.status}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-semibold text-white/55">
                            Yield {deal.gross_rent_yield}%
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-semibold text-white/55">
                            Discount {Number(deal.discount_percent || 0).toFixed(2)}%
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-semibold text-white/55">
                            Cash Flow {money(deal.estimated_monthly_cash_flow)}/mo
                          </span>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/[0.075] p-5 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                          Overall Score
                        </p>
                        <p className="mt-2 text-6xl font-semibold tracking-[-0.07em]">
                          {grade}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-white/70">
                          {overallScore}/100
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-5">
                      {[
                        ["Price", money(deal.listing_price)],
                        ["Fair Value", money(deal.fair_value)],
                        ["Monthly Rent", money(deal.estimated_monthly_rent)],
                        ["Deal Score", `${deal.deal_score}/100`],
                        ["Cash Flow", `${money(deal.estimated_monthly_cash_flow)}/mo`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                            {label}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => saveDeal(deal)}
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                      >
                        Save to Portfolio
                      </button>

                      <a
                        href={`/analyze?address=${encodeURIComponent(deal.address)}&listing_price=${encodeURIComponent(String(deal.listing_price))}`}
                        className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-center text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        Analyze Property
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

