"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";
import { supabase } from "@/lib/supabase";

type AnalysisResult = {
  address: string;
  listing_price: number;
  fair_value: number;
  fair_value_low?: number;
  fair_value_high?: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  status: string;
  deal_score: number;
  reasons?: string[];
  summary?: string;
  forecast_score?: number;
  forecast_outlook?: string;
  forecast_reasons?: string[];
  neighborhood_score?: number;
  neighborhood_grade?: string;
  neighborhood_reasons?: string[];
  expected_appreciation?: number;
  confidence_score?: number;
  overall_score?: number;
  down_payment?: number;
  loan_amount?: number;
  monthly_mortgage?: number;
  monthly_property_tax?: number;
  monthly_insurance?: number;
  monthly_maintenance?: number;
  estimated_monthly_cash_flow: number;
  usage?: { count?: number; limit?: number; remaining?: number; is_pro?: boolean } | null;
  server_verified_pro?: boolean;
  plan?: string;
};

function money(value: number | undefined) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function percent(value: number | undefined) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function getGrade(score: number) {
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

function getVerdictStyle(status: string) {
  const value = (status || "").toLowerCase();
  if (value.includes("under") || value.includes("buy")) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }
  if (value.includes("over") || value.includes("risk") || value.includes("pass")) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }
  return "border-amber-300/20 bg-amber-300/10 text-amber-200";
}

export default function AnalyzePage() {
  const { isSignedIn, user } = useUser();

  const [address, setAddress] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("25");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");
  const [isPro, setIsPro] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryAddress = params.get("address");
    const queryPrice = params.get("listing_price") || params.get("price");

    if (queryAddress) setAddress(queryAddress);
    if (queryPrice) setListingPrice(queryPrice);
  }, []);

  useEffect(() => {
    async function loadProStatus() {
      const response = await fetch("/api/me/pro-status", { cache: "no-store" });
      const data = await response.json();
      setIsPro(Boolean(data?.is_pro));
    }

    loadProStatus();
  }, [user?.id]);

  async function analyzeProperty() {
    setMessage("");
    setResult(null);

    if (!isSignedIn) {
      setMessage("Please sign in to analyze properties.");
      return;
    }

    if (!address.trim()) return setMessage("Property address is required.");
    if (!listingPrice || Number(listingPrice) <= 0) {
      return setMessage("Listing price must be greater than 0.");
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.trim(),
          listing_price: Number(listingPrice),
          down_payment_percent: Number(downPaymentPercent || 25),
          interest_rate: Number(interestRate || 6.5),
          loan_term_years: Number(loanTermYears || 30),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429) {
          setMessage(data.detail || "Monthly analysis limit reached. Upgrade to Pro to continue.");
        } else if (response.status === 401) {
          setMessage(data.detail || "Please sign in to analyze properties.");
        } else {
          setMessage(data.detail || "Could not analyze this property.");
        }

        setLoading(false);
        return;
      }

      setResult(data);
      setIsPro(Boolean(data.server_verified_pro));
    } catch {
      setMessage("Server connection failed.");
    }

    setLoading(false);
  }

  async function saveToPortfolio() {
    setMessage("");
    if (!result) return;
    if (!isSignedIn || !user?.id) return setMessage("Please sign in to save this property.");

    setSaving(true);

    const { data: existingDeal } = await supabase
      .from("saved_deals")
      .select("id")
      .eq("user_id", user.id)
      .eq("address", result.address)
      .maybeSingle();

    if (existingDeal) {
      setSaving(false);
      return setMessage("This property is already in your portfolio.");
    }

    const { error } = await supabase.from("saved_deals").insert({
      user_id: user.id,
      address: result.address,
      listing_price: result.listing_price,
      fair_value: result.fair_value,
      estimated_monthly_rent: result.estimated_monthly_rent,
      discount_percent: result.discount_percent,
      gross_rent_yield: result.gross_rent_yield,
      deal_score: result.deal_score,
      status: result.status,
      estimated_monthly_cash_flow: result.estimated_monthly_cash_flow,
    });

    setSaving(false);
    setMessage(error ? "Could not save this property." : "Property saved to your portfolio.");
  }

  async function generateReport() {
    setMessage("");
    if (!result) return;
    if (!isSignedIn || !user?.id) return setMessage("Please sign in to generate an investment report.");

    setReportLoading(true);

    try {
      const response = await fetch("/api/ask-ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, property: result, investor_type: "Modern investor", is_pro: isPro }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not generate report.");
        setReportLoading(false);
        return;
      }

      if (data.report_id) {
        window.location.href = `/report/${data.report_id}`;
        return;
      }

      setMessage("Report generated.");
    } catch {
      setMessage("Report generation failed.");
    }

    setReportLoading(false);
  }

  const overallScore = useMemo(
    () => Number(result?.overall_score ?? result?.deal_score ?? 0),
    [result]
  );

  const grade = getGrade(overallScore);

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
          <a href="/" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white">
            Back to Nestrova
          </a>

          <div className="flex items-center gap-3">
            <a href="/deals" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white">
              Deal Finder
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
              Secure Executive Analysis
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              Analyze one property with server-verified access.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
              Your Pro status is verified on the server before Nestrova calls the investment analysis engine.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-6">
              <input className="h-14 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25 md:col-span-3" placeholder="Property address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <input className="h-14 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25" placeholder="Listing price" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} />
              <button onClick={analyzeProperty} disabled={loading} className="h-14 rounded-2xl bg-white px-5 text-sm font-semibold text-black shadow-[0_24px_80px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/30 md:col-span-2">
                {loading ? "Analyzing..." : "Run Analysis"}
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <input className="h-12 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25" placeholder="Down payment %" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)} />
              <input className="h-12 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25" placeholder="Interest rate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
              <input className="h-12 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25" placeholder="Loan term years" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} />
            </div>

            {message && <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm text-white/70">{message}</div>}
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Verified Analysis Brain</p>
            <h2 className="mt-3 text-6xl font-semibold tracking-[-0.07em]">{result ? grade : isPro ? "PRO" : "FREE"}</h2>
            <p className="mt-5 text-sm leading-6 text-white/55">
              {result
                ? `${result.address} received an overall investment score of ${overallScore}/100.`
                : isPro
                  ? "Pro access verified. Monthly Pro limit applies."
                  : "Free access verified. Upgrade when you need more analyses."}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Plan</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{isPro ? "Pro" : "Free"}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Remaining</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{result?.usage?.remaining ?? "--"}</p>
              </div>
            </div>

            <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Security Layer</p>
                <p className="text-xs font-semibold text-emerald-300">Server</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.75)] ${loading ? "w-[58%]" : result ? "w-[92%]" : "w-[40%]"}`} />
              </div>
              <div className="mt-5 grid gap-3 text-sm text-white/58">
                <p>Clerk user verified</p>
                <p>Supabase Pro status checked</p>
                <p>Server proxy calls analysis API</p>
                <p>Usage limit enforced by plan</p>
              </div>
            </div>
          </aside>
        </section>

        {loading && <section className="mt-8 grid gap-4">{[1,2,3].map((item) => <div key={item} className="animate-pulse rounded-[34px] border border-white/10 bg-white/[0.055] p-6"><div className="h-5 w-48 rounded-full bg-white/10" /><div className="mt-5 h-8 w-2/3 rounded-full bg-white/10" /><div className="mt-6 grid gap-4 md:grid-cols-5">{[1,2,3,4,5].map((metric) => <div key={metric} className="h-16 rounded-2xl bg-white/10" />)}</div></div>)}</section>}

        {result && (
          <section className="mt-8 grid gap-6">
            <div className="rounded-[44px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Executive Decision</p>
                  <h2 className="mt-2 text-5xl font-semibold tracking-[-0.06em]">{result.status}</h2>
                  <p className="mt-4 max-w-4xl text-sm leading-6 text-white/55">{result.summary}</p>
                </div>
                <div className={`rounded-[30px] border p-5 text-center ${getVerdictStyle(result.status)}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">Investment Grade</p>
                  <p className="mt-2 text-6xl font-semibold tracking-[-0.07em]">{grade}</p>
                  <p className="mt-1 text-xl font-semibold">{overallScore}/100</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-5">
                {[["Listing Price", money(result.listing_price)], ["AI Fair Value", money(result.fair_value)], ["Discount / Premium", percent(result.discount_percent)], ["Monthly Rent", money(result.estimated_monthly_rent)], ["Cash Flow", `${money(result.estimated_monthly_cash_flow)}/mo`]].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={saveToPortfolio} disabled={saving} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:bg-white/30">
                  {saving ? "Saving..." : "Save to Portfolio"}
                </button>
                <button onClick={generateReport} disabled={reportLoading} className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">
                  {reportLoading ? "Generating..." : "Generate AI Report"}
                </button>
                {!isPro && <a href="/pricing" className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-center text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15">Upgrade for More Analyses</a>}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[38px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Forecast</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{result.forecast_outlook || "Forecast Ready"}</h3>
                <div className="mt-5 grid gap-3 text-sm text-white/55">
                  <p>Forecast Score: {result.forecast_score || 0}/100</p>
                  <p>Expected Appreciation: {result.expected_appreciation || 0}%</p>
                  {(result.forecast_reasons || []).map((reason) => <p key={reason}>??{reason}</p>)}
                </div>
              </div>

              <div className="rounded-[38px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Neighborhood</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{result.neighborhood_grade || "Neighborhood Profile"}</h3>
                <div className="mt-5 grid gap-3 text-sm text-white/55">
                  <p>Neighborhood Score: {result.neighborhood_score || 0}/100</p>
                  {(result.neighborhood_reasons || []).map((reason) => <p key={reason}>??{reason}</p>)}
                </div>
              </div>

              <div className="rounded-[38px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Financing</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Monthly Stack</h3>
                <div className="mt-5 grid gap-3 text-sm text-white/55">
                  <p>Down Payment: {money(result.down_payment)}</p>
                  <p>Loan Amount: {money(result.loan_amount)}</p>
                  <p>Mortgage: {money(result.monthly_mortgage)}/mo</p>
                  <p>Tax: {money(result.monthly_property_tax)}/mo</p>
                  <p>Insurance: {money(result.monthly_insurance)}/mo</p>
                  <p>Maintenance: {money(result.monthly_maintenance)}/mo</p>
                </div>
              </div>
            </div>

            <div className="rounded-[38px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Why this score?</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {(result.reasons || []).map((reason) => (
                  <div key={reason} className="rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm text-white/60">??{reason}</div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


