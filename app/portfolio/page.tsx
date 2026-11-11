"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/components/auth/ClerkCompat";
import { supabase } from "@/lib/supabase";
import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";

// NESTROVA_V9F8B_UNIFIED
type PortfolioSavedRecord = {
  id: string;
  address?: string | null;
  listing_price?: number | null;
  fair_value?: number | null;
  estimated_rent?: number | null;
  brain_score?: number | null;
  recommendation?: string | null;
  created_at?: string | null;
};

function portfolioAddressKey(address: string) {
  return address.trim().replace(/\s+/g, " ").toLowerCase();
}
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
  portfolioSource?: "saved_properties" | "saved_deals";
};

function money(value: number) {
  if (!Number.isFinite(value)) return "—";
  const amount = Math.round(Number(value || 0));
  const absolute = Math.abs(amount).toLocaleString();

  return amount < 0 ? `-$${absolute}` : `$${absolute}`;
}

function cleanAddress(value: string) {
  return String(value || "")
    .replace(/\s*,?\s*(?:USA|United States|미국)\s*$/i, "")
    .trim();
}

// NESTROVA_V9F8C - Display formatting only.
function portfolioYield(value: number) {
  return Number.isFinite(value)
    ? `${value.toFixed(1)}%`
    : "—";
}

function portfolioCashFlow(value: number) {
  return Number.isFinite(value)
    ? `${money(value)}/mo`
    : "—";
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
  const { isLoaded, isSignedIn, user } = useUser();
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

    try {
      // Read both sources concurrently. No database migration or writes.
      const [savedResponse, legacyResult] = await Promise.all([
        fetch("/api/saved-properties", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        }),
        supabase
          .from("saved_deals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      const savedPayload: {
        properties?: PortfolioSavedRecord[];
      } | null = savedResponse.ok
        ? await savedResponse.json().catch(() => null)
        : null;

      const records = Array.isArray(savedPayload?.properties)
        ? savedPayload.properties
        : [];

      const currentDeals: SavedDeal[] = records
        .filter(
          (property) =>
            typeof property.id === "string" &&
            typeof property.address === "string" &&
            property.address.trim().length > 0
        )
        .map((property) => {
          const price =
            typeof property.listing_price === "number"
              ? property.listing_price
              : Number.NaN;

          const fairValue =
            typeof property.fair_value === "number"
              ? property.fair_value
              : Number.NaN;

          const rent =
            typeof property.estimated_rent === "number"
              ? property.estimated_rent
              : Number.NaN;

          return {
            id: property.id,
            user_id: user.id,
            address: property.address!.trim(),
            listing_price: price,
            fair_value: fairValue,
            estimated_monthly_rent: rent,
            deal_score:
              typeof property.brain_score === "number"
                ? property.brain_score
                : Number.NaN,
            status: property.recommendation || "Saved",
            discount_percent:
              fairValue > 0 && Number.isFinite(price)
                ? ((fairValue - price) / fairValue) * 100
                : Number.NaN,
            gross_rent_yield:
              price > 0 && Number.isFinite(rent)
                ? ((rent * 12) / price) * 100
                : Number.NaN,

            // Saved Properties does not store verified net cash flow.
            estimated_monthly_cash_flow: Number.NaN,

            created_at:
              property.created_at || "1970-01-01T00:00:00.000Z",
            portfolioSource: "saved_properties",
          };
        });

      const legacyDeals: SavedDeal[] = legacyResult.error
        ? []
        : ((legacyResult.data ?? []) as SavedDeal[]).map(
            (deal) => ({
              ...deal,
              portfolioSource: "saved_deals",
            })
          );

      if (!savedResponse.ok && legacyResult.error) {
        setDeals([]);
        setMessage("Could not load your saved properties.");
        return;
      }

      // Prefer the canonical Saved Properties entry if addresses overlap.
      // Retain legacy-only properties so older records remain accessible.
      const unique = new Map<string, SavedDeal>();

      for (const deal of legacyDeals) {
        unique.set(portfolioAddressKey(deal.address), deal);
      }

      for (const deal of currentDeals) {
        const key = portfolioAddressKey(deal.address);
        const older = unique.get(key);

        unique.set(key, {
          ...deal,
          gross_rent_yield:
            older && Number.isFinite(older.gross_rent_yield)
              ? older.gross_rent_yield
              : deal.gross_rent_yield,
          estimated_monthly_cash_flow:
            older &&
            Number.isFinite(older.estimated_monthly_cash_flow)
              ? older.estimated_monthly_cash_flow
              : deal.estimated_monthly_cash_flow,
        });
      }

      setDeals(
        [...unique.values()].sort(
          (a, b) =>
            (Date.parse(b.created_at) || 0) -
            (Date.parse(a.created_at) || 0)
        )
      );

      if (!savedResponse.ok) {
        setMessage(
          "Some recently saved properties could not be loaded."
        );
      } else if (legacyResult.error) {
        setMessage(
          "Some older portfolio records could not be loaded."
        );
      }
    } catch {
      setMessage("Could not load your property portfolio.");
    } finally {
      setLoading(false);
    }
  }

  async function removeDeal(dealId: string) {
    if (!user?.id) return;

    const deal = deals.find((item) => item.id === dealId);
    if (!deal) return;

    try {
      if (deal.portfolioSource === "saved_properties") {
        const response = await fetch("/api/saved-properties", {
          method: "DELETE",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: dealId }),
        });

        if (!response.ok) {
          throw new Error("Saved property removal failed.");
        }
      } else {
        const { error } = await supabase
          .from("saved_deals")
          .delete()
          .eq("id", dealId)
          .eq("user_id", user.id);

        if (error) throw error;
      }

      await loadPortfolio();
    } catch {
      setMessage("Could not remove this property.");
    }
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

    const validYields = deals.filter((deal) =>
      Number.isFinite(deal.gross_rent_yield)
    );

    const avgYield = validYields.length
      ? validYields.reduce(
          (sum, deal) => sum + deal.gross_rent_yield,
          0
        ) / validYields.length
      : Number.NaN;

    const validCashFlows = deals.filter((deal) =>
      Number.isFinite(deal.estimated_monthly_cash_flow)
    );

    const avgCashFlow = validCashFlows.length
      ? Math.round(
          validCashFlows.reduce(
            (sum, deal) =>
              sum + deal.estimated_monthly_cash_flow,
            0
          ) / validCashFlows.length
        )
      : Number.NaN;

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
    <UserAwareNestrovaShell
      title="Real Estate"
      subtitle="Manage saved properties and portfolio intelligence."
    >
      <div className="nestrova-v9f8-portfolio min-w-0 w-full">
      <main className="overflow-hidden text-white">

      <div className="relative mx-auto max-w-[1500px] px-5 py-6 md:px-8">

        {isLoaded && isSignedIn && (
        <section className="grid gap-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
              Portfolio
            </div>

            <h1 className="mt-4 max-w-5xl text-3xl font-semibold leading-[1.1] tracking-[-0.045em] md:text-5xl">
              Property portfolio
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
              Track saved investment properties, compare scores, review cash flow,
              and quickly identify your strongest opportunities.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/real-estate"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Explore properties
              </a>
              <a
                href="/saved"
                className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                View saved properties
              </a>
            </div>
          </div>


        </section>
        )}

        {!isLoaded && (
          <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-sm text-slate-300">
            Checking your account...
          </section>
        )}
        {isLoaded && !isSignedIn && (
          <section className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-white/10 bg-[#172636] p-8 sm:p-12">
  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#68d4c5]">
    Personal workspace
  </p>
  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
    Your property portfolio.
  </h1>
  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
    Sign in to view your saved properties, investment scores,
    and portfolio analysis.
  </p>
  <a
    href="/login"
    className="mt-7 inline-flex rounded-xl bg-[#68d4c5] px-6 py-3 text-sm font-semibold text-[#0d1724] hover:bg-[#91e6da]"
  >
    Sign in to continue
  </a>
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
                    ["Average Yield", Number.isFinite(stats.avgYield) ? `${stats.avgYield.toFixed(1)}%` : "—"],
                    ...(Number.isFinite(stats.avgCashFlow) ? [["Average Cash Flow", `${money(stats.avgCashFlow)}/mo`]] : []),
                    ["Combined listing estimates", money(stats.totalListingValue)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-2xl">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        {label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
                    </div>
                  ))}
                </section>

                {stats.bestDeal && deals.length > 1 && (
                  <section className="mt-8 rounded-[38px] border border-emerald-400/20 bg-emerald-400/[0.08] p-6 backdrop-blur-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/70">
                      Best Saved Opportunity
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{cleanAddress(stats.bestDeal.address)}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      Score {stats.bestDeal.deal_score}/100 &#183; Grade {getInvestmentGrade(Number(stats.bestDeal.deal_score || 0))} &#183; Yield {portfolioYield(stats.bestDeal.gross_rent_yield)} &#183; Cash Flow {portfolioCashFlow(stats.bestDeal.estimated_monthly_cash_flow)}
                    </p>
                  </section>
                )}

                {deals.length === 0 ? (
                  <section className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-10 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                    <h2 className="text-4xl font-semibold tracking-[-0.05em]">No saved properties yet</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/50">
                      Analyze or find properties, then save your favorite deals to build your portfolio.
                    </p>
                    <a
                      href="/real-estate"
                      className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                    >
                      Search Properties
                    </a>
                  </section>
                ) : (
                  <section className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
                    <div className="mb-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                        Saved Properties
                      </p>
                      <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                        Saved properties
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
                              <td className="rounded-l-2xl px-4 py-4 font-semibold text-white">{cleanAddress(deal.address)}</td>
                              <td className="px-4 py-4">
                                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                                  {getInvestmentGrade(Number(deal.deal_score || 0))}
                                </span>
                              </td>
                              <td className="px-4 py-4">{deal.deal_score}/100</td>
                              <td className="px-4 py-4">{money(deal.listing_price)}</td>
                              <td className="px-4 py-4">{money(deal.fair_value)}</td>
                              <td className="px-4 py-4">{portfolioYield(deal.gross_rent_yield)}</td>
                              <td className="px-4 py-4">{portfolioCashFlow(deal.estimated_monthly_cash_flow)}</td>
                              <td className="px-4 py-4">
                                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(deal.status)}`}>
                                  {deal.status}
                                </span>
                              </td>
                              <td className="rounded-r-2xl px-4 py-4">
                                <a
  href={`/analyze?address=${encodeURIComponent(deal.address)}&price=${encodeURIComponent(String(deal.listing_price))}&saved=1`}
  className="mr-2 inline-flex items-center rounded-lg border border-[#68d4c5]/30 px-3 py-2 text-xs font-medium text-[#a6e4dc] hover:bg-white/[0.06]"
>
  View analysis
</a><button
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
          </div>
</UserAwareNestrovaShell>
  );
}


