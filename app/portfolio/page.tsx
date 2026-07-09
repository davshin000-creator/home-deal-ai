"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";
import { supabase } from "@/lib/supabase";

type SavedDeal = {
  id: string;
  user_id: string;
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
  created_at: string;
};

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
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

function getStatusClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes("under") || value.includes("buy") || value.includes("strong")) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }
  if (value.includes("over") || value.includes("risk") || value.includes("pass")) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }
  return "border-amber-300/20 bg-amber-300/10 text-amber-200";
}

export default function PortfolioPage() {
  const { isSignedIn, user } = useUser();
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadPortfolio();
    } else {
      setDeals([]);
    }
  }, [isSignedIn, user?.id]);

  async function loadPortfolio() {
    if (!user?.id) return;
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("saved_deals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load your portfolio.");
      setLoading(false);
      return;
    }

    setDeals((data || []) as SavedDeal[]);
    setLoading(false);
  }

  async function removeDeal(dealId: string) {
    if (!user?.id) return;

    const { error } = await supabase
      .from("saved_deals")
      .delete()
      .eq("id", dealId)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Could not remove this property.");
      return;
    }

    setMessage("Property removed from portfolio.");
    await loadPortfolio();
  }

  const stats = useMemo(() => {
    if (deals.length === 0) {
      return {
        count: 0,
        avgScore: 0,
        avgYield: 0,
        avgCashFlow: 0,
        totalListingValue: 0,
        bestDeal: null as SavedDeal | null,
      };
    }

    const avgScore = Math.round(
      deals.reduce((sum, deal) => sum + Number(deal.deal_score || 0), 0) /
        deals.length
    );

    const avgYield =
      deals.reduce((sum, deal) => sum + Number(deal.gross_rent_yield || 0), 0) /
      deals.length;

    const avgCashFlow = Math.round(
      deals.reduce(
        (sum, deal) => sum + Number(deal.estimated_monthly_cash_flow || 0),
        0
      ) / deals.length
    );

    const totalListingValue = deals.reduce(
      (sum, deal) => sum + Number(deal.listing_price || 0),
      0
    );

    const bestDeal = deals.reduce((best, current) =>
      Number(current.deal_score || 0) > Number(best.deal_score || 0)
        ? current
        : best
    );

    return {
      count: deals.length,
      avgScore,
      avgYield,
      avgCashFlow,
      totalListingValue,
      bestDeal,
    };
  }, [deals]);

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
        </header>

        <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
          <div className="rounded-[44px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
              Portfolio
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              Your saved property portfolio, ranked by AI conviction.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
              Track saved investment properties, compare scores, review cash flow,
              and quickly identify your strongest opportunities.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/deals"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Find More Deals
              </a>
              <a
                href="/pricing"
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Upgrade Pro
              </a>
            </div>
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Portfolio Brain
            </p>
            <h2 className="mt-3 text-6xl font-semibold tracking-[-0.07em]">
              {stats.bestDeal ? getInvestmentGrade(Number(stats.bestDeal.deal_score || 0)) : "AI"}
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/55">
              {stats.bestDeal
                ? `${stats.bestDeal.address} is currently your strongest saved opportunity.`
                : "Save properties from Deal Finder to activate your portfolio intelligence."}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Saved
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{stats.count}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  Avg Score
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{stats.avgScore}</p>
              </div>
            </div>

            <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Health Stream
                </p>
                <p className="text-xs font-semibold text-emerald-300">
                  {loading ? "Loading" : "Synchronized"}
                </p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.75)]" />
              </div>
              <div className="mt-5 grid gap-3 text-sm text-white/58">
                <p>??Saved deal tracking</p>
                <p>??Portfolio score monitoring</p>
                <p>??Yield and cash flow review</p>
                <p>??Best opportunity detection</p>
              </div>
            </div>
          </aside>
        </section>

        {!isSignedIn && (
          <section className="mt-8 rounded-[40px] border border-amber-300/20 bg-amber-300/10 p-8 text-amber-100">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">Sign in to view your portfolio.</h2>
            <p className="mt-3 text-sm leading-6 text-amber-100/70">
              Your saved properties are connected to your account.
            </p>
          </section>
        )}

        {isSignedIn && (
          <>
            {message && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm text-white/70">
                {message}
              </div>
            )}

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

            {!loading && (
              <>
                <section className="mt-8 grid gap-4 md:grid-cols-5">
                  {[
                    ["Saved Properties", stats.count],
                    ["Average Score", `${stats.avgScore}/100`],
                    ["Average Yield", `${stats.avgYield.toFixed(2)}%`],
                    ["Average Cash Flow", `${money(stats.avgCashFlow)}/mo`],
                    ["Portfolio Value", money(stats.totalListingValue)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        {label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
                    </div>
                  ))}
                </section>

                {stats.bestDeal && (
                  <section className="mt-8 rounded-[38px] border border-emerald-400/20 bg-emerald-400/[0.08] p-6 backdrop-blur-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/70">
                      Best Saved Opportunity
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{stats.bestDeal.address}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      Score {stats.bestDeal.deal_score}/100 · Grade {getInvestmentGrade(Number(stats.bestDeal.deal_score || 0))} · Yield {stats.bestDeal.gross_rent_yield}% · Cash Flow {money(stats.bestDeal.estimated_monthly_cash_flow)}/mo
                    </p>
                  </section>
                )}

                {deals.length === 0 ? (
                  <section className="mt-8 rounded-[44px] border border-white/10 bg-white/[0.06] p-10 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                    <h2 className="text-4xl font-semibold tracking-[-0.05em]">No saved properties yet</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/50">
                      Analyze or find properties, then save your favorite deals to build your portfolio.
                    </p>
                    <a
                      href="/deals"
                      className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                    >
                      Find Deals
                    </a>
                  </section>
                ) : (
                  <section className="mt-8 rounded-[44px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
                    <div className="mb-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                        Saved Properties
                      </p>
                      <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                        Portfolio table
                      </h2>
                      <p className="mt-2 text-sm text-white/45">
                        Review your saved properties and remove anything you no longer want to track.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-[0.18em] text-white/30">
                            <th className="px-4 py-2">Property</th>
                            <th className="px-4 py-2">Grade</th>
                            <th className="px-4 py-2">Score</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Fair Value</th>
                            <th className="px-4 py-2">Yield</th>
                            <th className="px-4 py-2">Cash Flow</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deals.map((deal) => (
                            <tr key={deal.id} className="rounded-2xl bg-black/20 text-sm text-white/70">
                              <td className="rounded-l-2xl px-4 py-4 font-semibold text-white">{deal.address}</td>
                              <td className="px-4 py-4">
                                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                                  {getInvestmentGrade(Number(deal.deal_score || 0))}
                                </span>
                              </td>
                              <td className="px-4 py-4">{deal.deal_score}/100</td>
                              <td className="px-4 py-4">{money(deal.listing_price)}</td>
                              <td className="px-4 py-4">{money(deal.fair_value)}</td>
                              <td className="px-4 py-4">{deal.gross_rent_yield}%</td>
                              <td className="px-4 py-4">{money(deal.estimated_monthly_cash_flow)}/mo</td>
                              <td className="px-4 py-4">
                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(deal.status)}`}>
                                  {deal.status}
                                </span>
                              </td>
                              <td className="rounded-r-2xl px-4 py-4">
                                <button
                                  onClick={() => removeDeal(deal.id)}
                                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

