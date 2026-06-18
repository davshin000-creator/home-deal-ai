"use client";

import { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type AnalyzeResult = {
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  gross_rent_yield: number;
  status: string;
  deal_score: number;
  summary: string;
  estimated_monthly_cash_flow: number;
  forecast_score: number;
  forecast_outlook: string;
  forecast_reasons: string[];
  neighborhood_score: number;
  neighborhood_grade: string;
  neighborhood_reasons: string[];
  expected_appreciation: number;
  confidence_score: number;
};

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

type SavedDealRow = {
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

type DealAlert = {
  id: string;
  user_id: string;
  city: string;
  state: string;
  max_price: number;
  min_score: number;
  is_active: boolean;
  created_at: string;
};

type AnalysisHistory = {
  id: string;
  user_id: string;
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
  summary: string;
  neighborhood_score?: number;
  neighborhood_grade?: string;
  neighborhood_reasons?: string[];
  expected_appreciation?: number;
  confidence_score?: number;
  created_at: string;
};

const API_URL = "https://home-deal-api.onrender.com";
const isPro = false;
const FREE_ANALYZE_LIMIT = 10;

function money(value: number) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`;
}

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getOverallScore(result: AnalyzeResult) {
  const dealScore = Number(result.deal_score || 0);
  const forecastScore = Number(result.forecast_score || 50);
  const neighborhoodScore = Number(result.neighborhood_score || 50);

  return Math.round(
    dealScore * 0.4 + forecastScore * 0.35 + neighborhoodScore * 0.25
  );
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

function getAverageOverallScore(deals: Deal[]) {
  if (deals.length === 0) return 0;

  const total = deals.reduce((sum, deal) => sum + getDealOverallScore(deal), 0);
  return Math.round(total / deals.length);
}

function getAverageCashFlow(deals: Deal[]) {
  if (deals.length === 0) return 0;

  const total = deals.reduce(
    (sum, deal) => sum + Number(deal.estimated_monthly_cash_flow || 0),
    0
  );

  return Math.round(total / deals.length);
}

function getAverageAppreciation(deals: Deal[]) {
  if (deals.length === 0) return 0;

  const total = deals.reduce(
    (sum, deal) => sum + Number(deal.expected_appreciation ?? 0),
    0
  );

  return Number((total / deals.length).toFixed(1));
}

function getBestSavedDeal(deals: Deal[]) {
  if (deals.length === 0) return null;

  return deals.reduce((bestDeal, currentDeal) => {
    return getDealOverallScore(currentDeal) > getDealOverallScore(bestDeal)
      ? currentDeal
      : bestDeal;
  }, deals[0]);
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

function savedRowToDeal(row: SavedDealRow): Deal {
  return {
    address: row.address,
    listing_price: Number(row.listing_price),
    fair_value: Number(row.fair_value),
    estimated_monthly_rent: Number(row.estimated_monthly_rent),
    discount_percent: Number(row.discount_percent),
    gross_rent_yield: Number(row.gross_rent_yield),
    deal_score: Number(row.deal_score),
    status: row.status,
    estimated_monthly_cash_flow: Number(row.estimated_monthly_cash_flow),
  };
}

export default function Home() {
  const { isSignedIn, user } = useUser();

  const [address, setAddress] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [downPaymentPercent, setDownPaymentPercent] = useState("25");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");

  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");

  const [city, setCity] = useState("Irvine");
  const [state, setState] = useState("CA");
  const [maxPrice, setMaxPrice] = useState("1500000");

  const [findDealsResult, setFindDealsResult] =
    useState<FindDealsResult | null>(null);
  const [findDealsLoading, setFindDealsLoading] = useState(false);
  const [findDealsError, setFindDealsError] = useState("");

  const [savedDeals, setSavedDeals] = useState<Deal[]>([]);
  const [savedDealsLoading, setSavedDealsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [alerts, setAlerts] = useState<DealAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [alertCity, setAlertCity] = useState("Irvine");
  const [alertState, setAlertState] = useState("CA");
  const [alertMaxPrice, setAlertMaxPrice] = useState("1500000");
  const [alertMinScore, setAlertMinScore] = useState("60");

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyMessage, setHistoryMessage] = useState("");

  const [analyzeCount, setAnalyzeCount] = useState(0);
  const [findDealsCount, setFindDealsCount] = useState(0);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadSavedDeals();
      loadAlerts();
      loadAnalysisHistory();
      loadUsage();
    } else {
      setSavedDeals([]);
      setAlerts([]);
      setAnalysisHistory([]);
      setAnalyzeCount(0);
      setFindDealsCount(0);
    }
  }, [isSignedIn, user?.id]);

  async function loadUsage() {
    if (!user?.id) return;

    const monthKey = getMonthKey();

    const { data } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", user.id)
      .eq("month_key", monthKey)
      .maybeSingle();

    if (data) {
      setAnalyzeCount(Number(data.analyze_count || 0));
      setFindDealsCount(Number(data.find_deals_count || 0));
    } else {
      setAnalyzeCount(0);
      setFindDealsCount(0);
    }
  }

  async function incrementAnalyzeUsage() {
    if (!user?.id) return;

    const monthKey = getMonthKey();
    const nextAnalyzeCount = analyzeCount + 1;

    const { error } = await supabase.from("usage_limits").upsert(
      {
        user_id: user.id,
        month_key: monthKey,
        analyze_count: nextAnalyzeCount,
        find_deals_count: findDealsCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,month_key" }
    );

    if (!error) setAnalyzeCount(nextAnalyzeCount);
  }

  async function loadSavedDeals() {
    if (!user?.id) return;

    setSavedDealsLoading(true);

    const { data, error } = await supabase
      .from("saved_deals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setSaveMessage("Could not load saved deals.");
      setSavedDealsLoading(false);
      return;
    }

    setSavedDeals((data || []).map((row) => savedRowToDeal(row as SavedDealRow)));
    setSavedDealsLoading(false);
  }

  async function loadAlerts() {
    if (!user?.id) return;

    setAlertsLoading(true);

    const { data, error } = await supabase
      .from("deal_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setAlertMessage("Could not load alerts.");
      setAlertsLoading(false);
      return;
    }

    setAlerts((data || []) as DealAlert[]);
    setAlertsLoading(false);
  }

  async function loadAnalysisHistory() {
    if (!user?.id) return;

    setHistoryLoading(true);

    const { data, error } = await supabase
      .from("analysis_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setHistoryMessage("Could not load analysis history.");
      setHistoryLoading(false);
      return;
    }

    setAnalysisHistory((data || []) as AnalysisHistory[]);
    setHistoryLoading(false);
  }

  async function saveAnalysisHistory(result: AnalyzeResult) {
    if (!isSignedIn || !user?.id) return;

    await supabase.from("analysis_history").insert({
      user_id: user.id,
      address: result.address,
      listing_price: result.listing_price,
      fair_value: result.fair_value,
      estimated_monthly_rent: result.estimated_monthly_rent,
      gross_rent_yield: result.gross_rent_yield,
      deal_score: result.deal_score,
      status: result.status,
      estimated_monthly_cash_flow: result.estimated_monthly_cash_flow,
      summary: result.summary,
    });

    await loadAnalysisHistory();
  }

  async function deleteAnalysisHistory(historyId: string) {
    if (!user?.id) return;

    const { error } = await supabase
      .from("analysis_history")
      .delete()
      .eq("id", historyId)
      .eq("user_id", user.id);

    if (error) {
      setHistoryMessage("Could not delete analysis.");
      return;
    }

    setHistoryMessage("Analysis deleted.");
    await loadAnalysisHistory();
  }

  async function createAlert() {
    setAlertMessage("");

    if (!isSignedIn || !user?.id) {
      setAlertMessage("Please sign in to create alerts.");
      return;
    }

    if (!alertCity.trim()) {
      setAlertMessage("City is required.");
      return;
    }

    if (!alertState.trim()) {
      setAlertMessage("State is required.");
      return;
    }

    if (!alertMaxPrice || Number(alertMaxPrice) <= 0) {
      setAlertMessage("Max price must be greater than 0.");
      return;
    }

    const userEmail = user.primaryEmailAddress?.emailAddress || "";

    const { error } = await supabase.from("deal_alerts").insert({
      user_id: user.id,
      email: userEmail,
      city: alertCity.trim(),
      state: alertState.trim().toUpperCase(),
      max_price: Number(alertMaxPrice),
      min_score: Number(alertMinScore),
      is_active: true,
    });

    if (error) {
      setAlertMessage("Could not create alert.");
      return;
    }

    setAlertMessage("Alert created successfully.");
    await loadAlerts();
  }

  async function deleteAlert(alertId: string) {
    if (!user?.id) return;

    const { error } = await supabase
      .from("deal_alerts")
      .delete()
      .eq("id", alertId)
      .eq("user_id", user.id);

    if (error) {
      setAlertMessage("Could not delete alert.");
      return;
    }

    setAlertMessage("Alert deleted.");
    await loadAlerts();
  }

  async function saveDeal(deal: Deal) {
    setSaveMessage("");

    if (!isSignedIn || !user?.id) {
      setSaveMessage("Please sign in to save deals.");
      return;
    }

    const alreadySaved = savedDeals.some(
      (savedDeal) => savedDeal.address === deal.address
    );

    if (alreadySaved) {
      setSaveMessage("This deal is already saved.");
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
      setSaveMessage("Could not save this deal.");
      return;
    }

    setSaveMessage("Deal saved successfully.");
    await loadSavedDeals();
  }

  async function removeSavedDeal(addressToRemove: string) {
    if (!user?.id) return;

    const { error } = await supabase
      .from("saved_deals")
      .delete()
      .eq("user_id", user.id)
      .eq("address", addressToRemove);

    if (error) {
      setSaveMessage("Could not remove this deal.");
      return;
    }

    setSaveMessage("Deal removed.");
    await loadSavedDeals();
  }

  async function analyzeProperty(customAddress?: string, customPrice?: number) {
    setAnalyzeError("");
    setAnalyzeResult(null);

    if (!isSignedIn || !user?.id) {
      setAnalyzeError("Please sign in to analyze properties.");
      return;
    }

    if (!isPro && analyzeCount >= FREE_ANALYZE_LIMIT) {
      setAnalyzeError(
        "You have reached your free monthly analysis limit. Upgrade to Pro to continue."
      );
      return;
    }

    const finalAddress = customAddress || address;
    const finalPrice = customPrice || Number(listingPrice);

    if (!finalAddress.trim()) {
      setAnalyzeError("Please enter a property address.");
      return;
    }

    if (!finalPrice || finalPrice <= 0) {
      setAnalyzeError("Please enter a valid listing price.");
      return;
    }

    setAnalyzeLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: finalAddress,
          listing_price: finalPrice,
          down_payment_percent: Number(downPaymentPercent),
          interest_rate: Number(interestRate),
          loan_term_years: Number(loanTermYears),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAnalyzeError(errorData.detail || "Could not analyze this property.");
        setAnalyzeLoading(false);
        return;
      }

      const data = await response.json();
      setAnalyzeResult({
        ...data,
        forecast_score: data.forecast_score ?? 50,
        forecast_outlook: data.forecast_outlook ?? "Stable Outlook",
        forecast_reasons: data.forecast_reasons ?? [],
        neighborhood_score: data.neighborhood_score ?? 50,
        neighborhood_grade: data.neighborhood_grade ?? "Stable Neighborhood Profile",
        neighborhood_reasons: data.neighborhood_reasons ?? [],
        expected_appreciation: data.expected_appreciation ?? 0,
        confidence_score: data.confidence_score ?? 50,
      });
      await saveAnalysisHistory({
        ...data,
        forecast_score: data.forecast_score ?? 50,
        forecast_outlook: data.forecast_outlook ?? "Stable Outlook",
        forecast_reasons: data.forecast_reasons ?? [],
        neighborhood_score: data.neighborhood_score ?? 50,
        neighborhood_grade: data.neighborhood_grade ?? "Stable Neighborhood Profile",
        neighborhood_reasons: data.neighborhood_reasons ?? [],
        expected_appreciation: data.expected_appreciation ?? 0,
        confidence_score: data.confidence_score ?? 50,
      });
      await incrementAnalyzeUsage();
    } catch {
      setAnalyzeError("Server connection failed.");
    }

    setAnalyzeLoading(false);
  }

  async function findDeals() {
    setFindDealsError("");
    setFindDealsResult(null);
    setSaveMessage("");

    if (!city.trim()) {
      setFindDealsError("Please enter a city.");
      return;
    }

    if (!state.trim()) {
      setFindDealsError("Please enter a state.");
      return;
    }

    if (!maxPrice.trim() || Number(maxPrice) <= 0) {
      setFindDealsError("Please enter a valid max price.");
      return;
    }

    setFindDealsLoading(true);

    try {
      const response = await fetch(`${API_URL}/find-deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          state,
          max_price: Number(maxPrice),
          limit: isPro ? 50 : 5,
          is_pro: isPro,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFindDealsError(errorData.detail || "Could not find deals.");
        setFindDealsLoading(false);
        return;
      }

      const data = await response.json();
      setFindDealsResult(data);
    } catch {
      setFindDealsError("Server connection failed.");
    }

    setFindDealsLoading(false);
  }

  async function runAlertNow(alert: DealAlert) {
    setCity(alert.city);
    setState(alert.state);
    setMaxPrice(String(alert.max_price));
    setFindDealsError("");
    setFindDealsResult(null);
    setSaveMessage("");
    setFindDealsLoading(true);

    try {
      const response = await fetch(`${API_URL}/find-deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: alert.city,
          state: alert.state,
          max_price: Number(alert.max_price),
          limit: isPro ? 50 : 5,
          is_pro: isPro,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFindDealsError(errorData.detail || "Could not run this alert.");
        setFindDealsLoading(false);
        return;
      }

      const data = await response.json();

      const filteredDeals = data.deals.filter(
        (deal: Deal) => deal.deal_score >= Number(alert.min_score)
      );

      setFindDealsResult({
        ...data,
        deals: filteredDeals,
        result_limit: filteredDeals.length,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFindDealsError("Server connection failed.");
    }

    setFindDealsLoading(false);
  }

  function analyzeFullProperty(deal: Deal) {
    setAddress(deal.address);
    setListingPrice(String(deal.listing_price));
    analyzeProperty(deal.address, deal.listing_price);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex justify-end gap-4">
          {!isSignedIn && (
            <>
              <SignInButton mode="modal">
                <button className="rounded-lg border px-4 py-2 font-semibold">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}

          {isSignedIn && <UserButton />}
        </div>

        <section className="mb-10 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white">
                  ◢
                </div>

                <div>
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    NESTROVA
                  </p>
                  <p className="text-sm font-medium text-gray-500">
                    AI Real Estate Intelligence
                  </p>
                </div>
              </div>

              <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
                Find Properties With Real Investment Potential
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-gray-600">
                Not every house is a good investment. Nestrova helps you identify
                the ones that are with AI-powered valuation, cash flow analysis,
                appreciation forecasts, and neighborhood scoring.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
                  onClick={() => {
                    document
                      .getElementById("analyze-property")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Analyze Property
                </button>

                <button
                  className="rounded-xl border px-6 py-4 font-semibold hover:bg-gray-50"
                  onClick={() => {
                    document
                      .getElementById("find-deals")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Find Deals
                </button>
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl bg-gray-50 p-5 md:min-w-[320px]">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">AI Fair Value</p>
                <p className="mt-1 text-lg font-bold">Estimate true property value</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Cash Flow Projection</p>
                <p className="mt-1 text-lg font-bold">Model monthly returns</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">12-Month Appreciation</p>
                <p className="mt-1 text-lg font-bold">See future value potential</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Neighborhood Analysis</p>
                <p className="mt-1 text-lg font-bold">Score local investment quality</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-black bg-white p-5 shadow">
            <p className="text-sm font-semibold text-gray-500">CURRENT PLAN</p>
            <h2 className="mt-1 text-2xl font-bold">Free Plan</h2>
            <p className="mt-2 text-gray-600">5 deals per search</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow">
            <p className="text-sm font-semibold text-gray-500">MONTHLY USAGE</p>
            <h2 className="mt-1 text-2xl font-bold">
              {analyzeCount}/{FREE_ANALYZE_LIMIT}
            </h2>
            <p className="mt-2 text-gray-600">Free analyses used this month</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow opacity-70">
            <p className="text-sm font-semibold text-gray-500">COMING SOON</p>
            <h2 className="mt-1 text-2xl font-bold">Pro Plan</h2>
            <p className="mt-2 text-gray-600">More searches, alerts, and forecasts</p>
          </div>
        </div>

        {!isSignedIn && (
          <div className="mb-8 rounded-2xl bg-yellow-50 p-5 text-yellow-900">
            Please sign in to analyze properties and save your history.
          </div>
        )}

        {isSignedIn && !isPro && analyzeCount >= FREE_ANALYZE_LIMIT && (
          <div className="mb-8 rounded-2xl bg-gray-900 p-6 text-white">
            <h2 className="text-2xl font-bold">Free limit reached</h2>
            <p className="mt-2 text-gray-200">
              You have used all {FREE_ANALYZE_LIMIT} free property analyses this month.
              Upgrade to Pro to continue.
            </p>
            <button className="mt-4 rounded-lg bg-white px-6 py-3 font-semibold text-black">
              Upgrade to Pro
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div id="analyze-property" className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Analyze Property</h2>
            <p className="mt-2 text-gray-600">Analyze a specific property by address.</p>

            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border p-4" placeholder="Property Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="Listing Price" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} />

              <div className="grid gap-4 md:grid-cols-3">
                <input className="rounded-lg border p-4" placeholder="Down Payment %" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)} />
                <input className="rounded-lg border p-4" placeholder="Interest Rate %" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                <input className="rounded-lg border p-4" placeholder="Loan Term" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} />
              </div>

              {analyzeError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">{analyzeError}</div>
              )}

              <button className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400" onClick={() => analyzeProperty()} disabled={analyzeLoading}>
                {analyzeLoading ? "Analyzing..." : "Analyze Property"}
              </button>
            </div>
          </div>

          <div id="find-deals" className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Find Best Deals</h2>
            <p className="mt-2 text-gray-600">Free users can view the top 5 deals per search.</p>

            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border p-4" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

              {findDealsError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">{findDealsError}</div>
              )}

              <button className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400" onClick={findDeals} disabled={findDealsLoading}>
                {findDealsLoading ? "Finding Deals..." : "Find Deals"}
              </button>
            </div>
          </div>
        </div>

        {analyzeResult && (
          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl border-2 border-black bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Overall Investment Score</p>

              <h2 className="mt-2 text-6xl font-bold">
                {getInvestmentGrade(getOverallScore(analyzeResult))}
              </h2>

              <p className="mt-2 text-2xl font-semibold">
                {getOverallScore(analyzeResult)}/100
              </p>

              <p className="mt-3 text-gray-600">
                Weighted from Deal Score, Home Appreciation Outlook, and Neighborhood Score.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Deal Score</p>
              <h2 className="mt-2 text-6xl font-bold">{analyzeResult.deal_score}/100</h2>
              <p className="mt-3 text-xl font-semibold">{analyzeResult.status}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Home Appreciation Outlook</p>

              <h2 className="mt-2 text-4xl font-bold">
                {analyzeResult.forecast_outlook || "Stable Outlook"}
              </h2>

              <p className="mt-2 text-xl font-semibold">
                Forecast Score: {analyzeResult.forecast_score || 50}/100
              </p>

              <div className="mt-4 space-y-2">
                {analyzeResult.forecast_reasons?.map((reason, index) => (
                  <p key={index} className="text-sm text-gray-700">
                    ✓ {reason}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Neighborhood Score</p>

              <h2 className="mt-2 text-4xl font-bold">
                {analyzeResult.neighborhood_grade || "Stable Neighborhood Profile"}
              </h2>

              <p className="mt-2 text-xl font-semibold">
                Neighborhood Score: {analyzeResult.neighborhood_score || 50}/100
              </p>

              <div className="mt-4 space-y-2">
                {analyzeResult.neighborhood_reasons?.map((reason, index) => (
                  <p key={index} className="text-sm text-gray-700">
                    ✓ {reason}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Expected 12-Month Appreciation</p>

              <h2 className="mt-2 text-5xl font-bold">
                {Number(analyzeResult.expected_appreciation || 0) > 0 ? "+" : ""}
                {Number(analyzeResult.expected_appreciation || 0).toFixed(1)}%
              </h2>

              <p className="mt-3 text-xl font-semibold">
                Confidence: {analyzeResult.confidence_score || 50}%
              </p>

              <p className="mt-3 text-gray-600">
                AI estimate based on valuation, rental demand, cash flow, and neighborhood profile.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-bold">Property Location</h2>

              <iframe
                title="property-map"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  analyzeResult.address
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />

              <p className="mt-4 text-gray-600">{analyzeResult.address}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Listing Price</p>
                <p className="mt-2 text-2xl font-bold">{money(analyzeResult.listing_price)}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">AI Fair Value</p>
                <p className="mt-2 text-2xl font-bold">{money(analyzeResult.fair_value)}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Rent Yield</p>
                <p className="mt-2 text-2xl font-bold">{analyzeResult.gross_rent_yield}%</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Cash Flow</p>
                <p className="mt-2 text-2xl font-bold">{money(analyzeResult.estimated_monthly_cash_flow)} / mo</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-xl font-bold">AI Summary</h3>
              <p className="mt-3 text-gray-700">{analyzeResult.summary}</p>
            </div>
          </div>
        )}

        {isSignedIn && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="text-3xl font-bold">Deal Alerts</h2>
            <p className="mt-2 text-gray-600">Save your search criteria and run alerts whenever you want.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <input className="rounded-lg border p-4" placeholder="City" value={alertCity} onChange={(e) => setAlertCity(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="State" value={alertState} onChange={(e) => setAlertState(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="Max Price" value={alertMaxPrice} onChange={(e) => setAlertMaxPrice(e.target.value)} />
              <input className="rounded-lg border p-4" placeholder="Min Score" value={alertMinScore} onChange={(e) => setAlertMinScore(e.target.value)} />
            </div>

            <button className="mt-4 rounded-lg bg-black px-6 py-3 font-semibold text-white" onClick={createAlert}>
              Create Alert
            </button>

            {alertMessage && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4 text-gray-800">{alertMessage}</div>
            )}

            {alertsLoading && <p className="mt-4 text-gray-600">Loading alerts...</p>}

            <div className="mt-6 grid gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border bg-white p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{alert.city}, {alert.state}</h3>
                      <p className="mt-1 text-gray-600">
                        Max Price: {money(Number(alert.max_price))} · Min Score: {alert.min_score}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white" onClick={() => runAlertNow(alert)}>
                        Run Alert Now
                      </button>
                      <button className="rounded-lg border px-4 py-2 font-semibold" onClick={() => deleteAlert(alert.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {findDealsResult && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <p className="text-sm font-semibold text-gray-500">🏆 TOP DEALS</p>
            <h2 className="text-3xl font-bold">
              Best Deals in {findDealsResult.city}, {findDealsResult.state}
            </h2>

            <p className="mt-2 text-gray-600">
              Ranked by Overall Investment Score. Showing {" "}
              {findDealsResult.result_limit || findDealsResult.deals.length} deals.
              Total analyzed: {" "}
              {findDealsResult.total_analyzed ||
                findDealsResult.count ||
                findDealsResult.deals.length}
              .
            </p>

            {saveMessage && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4 text-gray-800">
                {saveMessage}
              </div>
            )}

            <div className="mt-6 grid gap-5">
              {findDealsResult.deals.map((deal, index) => {
                const overallScore = getDealOverallScore(deal);
                const grade = getInvestmentGrade(overallScore);
                const appreciation = Number(deal.expected_appreciation ?? 0);
                const confidence = Number(deal.confidence_score ?? 50);

                return (
                  <div
                    key={index}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          #{index + 1} Investment Match
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-gray-900">
                          {deal.address}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-gray-700">
                          {deal.status}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                            Appreciation {appreciation > 0 ? "+" : ""}
                            {appreciation.toFixed(1)}%
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                            Confidence {confidence}%
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                            {deal.neighborhood_grade || "Neighborhood Profile"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border-2 border-black bg-white p-5 text-center">
                        <p className="text-sm text-gray-500">Overall Score</p>
                        <p className="text-5xl font-bold">{grade}</p>
                        <p className="mt-1 text-2xl font-semibold">
                          {overallScore}/100
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-6">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-bold">
                          {money(deal.listing_price)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Fair Value</p>
                        <p className="text-lg font-bold">
                          {money(deal.fair_value)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Deal Score</p>
                        <p className="text-lg font-bold">{deal.deal_score}/100</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Forecast</p>
                        <p className="text-lg font-bold">
                          {deal.forecast_score ?? 50}/100
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Neighborhood</p>
                        <p className="text-lg font-bold">
                          {deal.neighborhood_score ?? 50}/100
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Cash Flow</p>
                        <p className="text-lg font-bold">
                          {money(deal.estimated_monthly_cash_flow)}/mo
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <button
                        className="rounded-lg bg-black p-3 font-semibold text-white hover:bg-gray-800"
                        onClick={() => analyzeFullProperty(deal)}
                      >
                        Analyze Full Property
                      </button>

                      <button
                        className="rounded-lg border p-3 font-semibold hover:bg-gray-50"
                        onClick={() => saveDeal(deal)}
                      >
                        Save Deal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isSignedIn && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="text-3xl font-bold">Analysis History</h2>
            <p className="mt-2 text-gray-600">Properties you analyzed recently.</p>

            {historyMessage && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4 text-gray-800">{historyMessage}</div>
            )}

            {historyLoading && <p className="mt-4 text-gray-600">Loading analysis history...</p>}

            {!historyLoading && analysisHistory.length === 0 && (
              <p className="mt-4 text-gray-600">No analysis history yet.</p>
            )}

            <div className="mt-6 grid gap-4">
              {analysisHistory.map((item) => (
                <div key={item.id} className="rounded-2xl border bg-white p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{item.address}</h3>
                      <p className="mt-1 text-gray-600">
                        Score {item.deal_score}/100 · {money(Number(item.listing_price))} · {item.status}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Cash Flow: {money(Number(item.estimated_monthly_cash_flow))}/mo · Rent Yield: {item.gross_rent_yield}%
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
                        onClick={() => {
                          setAddress(item.address);
                          setListingPrice(String(item.listing_price));
                          setAnalyzeResult({
                            address: item.address,
                            listing_price: Number(item.listing_price),
                            fair_value: Number(item.fair_value),
                            estimated_monthly_rent: Number(item.estimated_monthly_rent),
                            gross_rent_yield: Number(item.gross_rent_yield),
                            status: item.status,
                            deal_score: Number(item.deal_score),
                            summary: item.summary,
                            estimated_monthly_cash_flow: Number(item.estimated_monthly_cash_flow),
                            forecast_score: Number(item.neighborhood_score) ? Number(item.neighborhood_score) : 50,
                            forecast_outlook: "Stable Outlook",
                            forecast_reasons: ["Historical analysis"],
                            neighborhood_score: item.neighborhood_score ?? 50,
                            neighborhood_grade: item.neighborhood_grade ?? "Stable Neighborhood Profile",
                            neighborhood_reasons: item.neighborhood_reasons ?? ["Historical neighborhood analysis"],
                            expected_appreciation: item.expected_appreciation ?? 0,
                            confidence_score: item.confidence_score ?? 50,
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        View
                      </button>

                      <button className="rounded-lg border px-4 py-2 font-semibold" onClick={() => deleteAnalysisHistory(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isSignedIn && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  ❤️ WATCHLIST
                </p>
                <h2 className="text-3xl font-bold">Saved Deals Dashboard</h2>
                <p className="mt-2 text-gray-600">
                  Track the properties you saved and compare their investment potential.
                </p>
              </div>

              {savedDeals.length > 0 && (
                <div className="rounded-2xl border-2 border-black bg-white px-5 py-4 text-center">
                  <p className="text-sm text-gray-500">Best Saved Deal</p>
                  <p className="text-3xl font-bold">
                    {getInvestmentGrade(
                      getDealOverallScore(getBestSavedDeal(savedDeals) as Deal)
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {getDealOverallScore(getBestSavedDeal(savedDeals) as Deal)}/100
                  </p>
                </div>
              )}
            </div>

            {savedDealsLoading && (
              <p className="mt-4 text-gray-600">Loading saved deals...</p>
            )}

            {!savedDealsLoading && savedDeals.length === 0 && (
              <p className="mt-4 text-gray-600">No saved deals yet.</p>
            )}

            {savedDeals.length > 0 && (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border bg-gray-50 p-5">
                    <p className="text-sm font-semibold text-gray-500">
                      Saved Deals
                    </p>
                    <p className="mt-2 text-3xl font-bold">{savedDeals.length}</p>
                  </div>

                  <div className="rounded-2xl border bg-gray-50 p-5">
                    <p className="text-sm font-semibold text-gray-500">
                      Average Score
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {getAverageOverallScore(savedDeals)}/100
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-gray-50 p-5">
                    <p className="text-sm font-semibold text-gray-500">
                      Average Cash Flow
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {money(getAverageCashFlow(savedDeals))}/mo
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-gray-50 p-5">
                    <p className="text-sm font-semibold text-gray-500">
                      Average Appreciation
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {getAverageAppreciation(savedDeals) > 0 ? "+" : ""}
                      {getAverageAppreciation(savedDeals).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {savedDeals.map((deal, index) => {
                    const overallScore = getDealOverallScore(deal);
                    const grade = getInvestmentGrade(overallScore);
                    const appreciation = Number(deal.expected_appreciation ?? 0);

                    return (
                      <div
                        key={index}
                        className="rounded-2xl border bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-500">
                              Saved Property
                            </p>
                            <h3 className="mt-1 text-xl font-bold">
                              {deal.address}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                                Overall {overallScore}/100
                              </span>

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                                Cash Flow {money(deal.estimated_monthly_cash_flow)}/mo
                              </span>

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                                Rent Yield {deal.gross_rent_yield}%
                              </span>

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                                Appreciation {appreciation > 0 ? "+" : ""}
                                {appreciation.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 md:items-end">
                            <div className="rounded-2xl border-2 border-black bg-white px-5 py-4 text-center">
                              <p className="text-sm text-gray-500">Grade</p>
                              <p className="text-4xl font-bold">{grade}</p>
                              <p className="text-sm font-semibold text-gray-700">
                                {overallScore}/100
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <button
                                className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
                                onClick={() => analyzeFullProperty(deal)}
                              >
                                Analyze
                              </button>

                              <button
                                className="rounded-lg border px-4 py-2 font-semibold"
                                onClick={() => removeSavedDeal(deal.address)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        <footer className="mt-10 border-t pt-6 text-sm text-gray-500">
          <p>This analysis is for informational purposes only and is not financial advice.</p>

          <div className="mt-3 flex gap-4">
            <a href="/privacy" className="hover:text-gray-900">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-900">Terms of Service</a>
            <a href="mailto:support@nestrova.com" className="hover:text-gray-900">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
