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
  gross_rent_yield: number;
  status: string;
  deal_score: number;
  summary: string;
  estimated_monthly_cash_flow: number;
};

type Deal = {
  address: string;
  listing_price: number;
  fair_value: number;
  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  status: string;
  estimated_monthly_cash_flow: number;
};

type FindDealsResult = {
  city: string;
  state: string;
  max_price: number;
  plan: string;
  result_limit: number;
  total_analyzed: number;
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

const API_URL = "https://home-deal-api.onrender.com";
const isPro = false;

function money(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
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

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadSavedDeals();
      loadAlerts();
    } else {
      setSavedDeals([]);
      setAlerts([]);
    }
  }, [isSignedIn, user?.id]);

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

    const deals = (data || []).map((row) =>
      savedRowToDeal(row as SavedDealRow)
    );

    setSavedDeals(deals);
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

    const userEmail =
      user.primaryEmailAddress?.emailAddress || "";

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
      setAnalyzeResult(data);
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

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900">Home Deal AI</h1>
          <p className="mt-3 text-gray-600">
            Analyze properties and find undervalued real estate deals.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-black bg-white p-5 shadow">
            <p className="text-sm font-semibold text-gray-500">CURRENT PLAN</p>
            <h2 className="mt-1 text-2xl font-bold">Free Plan</h2>
            <p className="mt-2 text-gray-600">5 deals per search</p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow opacity-70">
            <p className="text-sm font-semibold text-gray-500">COMING SOON</p>
            <h2 className="mt-1 text-2xl font-bold">Pro Plan</h2>
            <p className="mt-2 text-gray-600">Up to 50 deals per search</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Analyze Property</h2>
            <p className="mt-2 text-gray-600">
              Analyze a specific property by address.
            </p>

            <div className="mt-5 grid gap-4">
              <input
                className="rounded-lg border p-4"
                placeholder="Property Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Listing Price"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <input
                  className="rounded-lg border p-4"
                  placeholder="Down Payment %"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(e.target.value)}
                />

                <input
                  className="rounded-lg border p-4"
                  placeholder="Interest Rate %"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />

                <input
                  className="rounded-lg border p-4"
                  placeholder="Loan Term"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value)}
                />
              </div>

              {analyzeError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  {analyzeError}
                </div>
              )}

              <button
                className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
                onClick={() => analyzeProperty()}
                disabled={analyzeLoading}
              >
                {analyzeLoading ? "Analyzing..." : "Analyze Property"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Find Best Deals</h2>
            <p className="mt-2 text-gray-600">
              Free users can view the top 5 deals per search.
            </p>

            <div className="mt-5 grid gap-4">
              <input
                className="rounded-lg border p-4"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              {findDealsError && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  {findDealsError}
                </div>
              )}

              <button
                className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
                onClick={findDeals}
                disabled={findDealsLoading}
              >
                {findDealsLoading ? "Finding Deals..." : "Find Deals"}
              </button>
            </div>
          </div>
        </div>

        {analyzeResult && (
          <div className="mt-8 grid gap-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm text-gray-500">Deal Score</p>
              <h2 className="mt-2 text-6xl font-bold">
                {analyzeResult.deal_score}/100
              </h2>
              <p className="mt-3 text-xl font-semibold">
                {analyzeResult.status}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Listing Price</p>
                <p className="mt-2 text-2xl font-bold">
                  {money(analyzeResult.listing_price)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">AI Fair Value</p>
                <p className="mt-2 text-2xl font-bold">
                  {money(analyzeResult.fair_value)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Rent Yield</p>
                <p className="mt-2 text-2xl font-bold">
                  {analyzeResult.gross_rent_yield}%
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Cash Flow</p>
                <p className="mt-2 text-2xl font-bold">
                  {money(analyzeResult.estimated_monthly_cash_flow)} / mo
                </p>
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
            <p className="mt-2 text-gray-600">
              Save your search criteria and run alerts whenever you want.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <input
                className="rounded-lg border p-4"
                placeholder="City"
                value={alertCity}
                onChange={(e) => setAlertCity(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="State"
                value={alertState}
                onChange={(e) => setAlertState(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Max Price"
                value={alertMaxPrice}
                onChange={(e) => setAlertMaxPrice(e.target.value)}
              />

              <input
                className="rounded-lg border p-4"
                placeholder="Min Score"
                value={alertMinScore}
                onChange={(e) => setAlertMinScore(e.target.value)}
              />
            </div>

            <button
              className="mt-4 rounded-lg bg-black px-6 py-3 font-semibold text-white"
              onClick={createAlert}
            >
              Create Alert
            </button>

            {alertMessage && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4 text-gray-800">
                {alertMessage}
              </div>
            )}

            {alertsLoading && (
              <p className="mt-4 text-gray-600">Loading alerts...</p>
            )}

            <div className="mt-6 grid gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border bg-white p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {alert.city}, {alert.state}
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Max Price: {money(Number(alert.max_price))} · Min Score:{" "}
                        {alert.min_score}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
                        onClick={() => runAlertNow(alert)}
                      >
                        Run Alert Now
                      </button>

                      <button
                        className="rounded-lg border px-4 py-2 font-semibold"
                        onClick={() => deleteAlert(alert.id)}
                      >
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
              Showing {findDealsResult.result_limit} deals. Total analyzed:{" "}
              {findDealsResult.total_analyzed}.
            </p>

            {saveMessage && (
              <div className="mt-4 rounded-lg bg-gray-100 p-4 text-gray-800">
                {saveMessage}
              </div>
            )}

            <div className="mt-6 grid gap-5">
              {findDealsResult.deals.map((deal, index) => (
                <div
                  key={index}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        #{index + 1} Deal
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-gray-900">
                        {deal.address}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-gray-700">
                        {deal.status}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-100 p-5 text-center">
                      <p className="text-sm text-gray-500">Deal Score</p>
                      <p className="text-4xl font-bold">{deal.deal_score}</p>
                      <p className="text-sm text-gray-500">/100</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-5">
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
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="text-lg font-bold">
                        {deal.discount_percent}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Rent Yield</p>
                      <p className="text-lg font-bold">
                        {deal.gross_rent_yield}%
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
              ))}
            </div>

            {!isPro && (
              <div className="mt-6 rounded-2xl bg-gray-100 p-6 text-center">
                <h3 className="text-2xl font-bold">
                  Unlock 50 deals per search
                </h3>
                <p className="mt-2 text-gray-600">Pro plan coming soon.</p>
                <button className="mt-4 rounded-lg bg-black px-6 py-3 font-semibold text-white">
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        )}

        {isSignedIn && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="text-3xl font-bold">Saved Deals</h2>
            <p className="mt-2 text-gray-600">
              Properties you saved for later review.
            </p>

            {savedDealsLoading && (
              <p className="mt-4 text-gray-600">Loading saved deals...</p>
            )}

            {!savedDealsLoading && savedDeals.length === 0 && (
              <p className="mt-4 text-gray-600">No saved deals yet.</p>
            )}

            <div className="mt-6 grid gap-4">
              {savedDeals.map((deal, index) => (
                <div key={index} className="rounded-2xl border bg-white p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{deal.address}</h3>
                      <p className="mt-1 text-gray-600">
                        Score {deal.deal_score}/100 ·{" "}
                        {money(deal.listing_price)}
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
              ))}
            </div>
          </div>
        )}

        <footer className="mt-10 border-t pt-6 text-sm text-gray-500">
  <p>
    This analysis is for informational purposes only and is not financial
    advice.
  </p>

  <div className="mt-3 flex gap-4">
    <a href="/privacy" className="hover:text-gray-900">
      Privacy Policy
    </a>
    <a href="/terms" className="hover:text-gray-900">
      Terms of Service
    </a>
    <a href="mailto:support@nestrova.com" className="hover:text-gray-900">
      Contact
    </a>
  </div>
</footer>
      </div>
    </main>
  );
}