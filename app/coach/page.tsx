"use client";

import { useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";

type CoachPlan = {
  plan_id?: string;
  strategy?: string;
  plan?: string;
};

export default function CoachPage() {
  const { isSignedIn, user } = useUser();

  const [budget, setBudget] = useState("900000");
  const [downPayment, setDownPayment] = useState("25");
  const [goal, setGoal] = useState("Long-term appreciation with moderate cash flow");
  const [riskLevel, setRiskLevel] = useState("Medium");
  const [timeHorizon, setTimeHorizon] = useState("5-10 years");
  const [preferredMarkets, setPreferredMarkets] = useState("Irvine, Austin, Dallas");
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState("1000");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coachPlan, setCoachPlan] = useState<CoachPlan | null>(null);

  async function generateCoachPlan() {
    setError("");
    setCoachPlan(null);

    if (!isSignedIn || !user?.id) {
      setError("Please sign in to use AI Investment Coach.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError("Please enter a valid budget.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          budget: Number(budget),
          down_payment_percent: Number(downPayment),
          goal,
          risk_level: riskLevel,
          time_horizon: timeHorizon,
          preferred_markets: preferredMarkets,
          monthly_income_goal: Number(monthlyIncomeGoal),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not generate investment coach plan.");
        setLoading(false);
        return;
      }

      setCoachPlan(data);
    } catch {
      setError("AI Coach connection failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            Back to Nestrova
          </a>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        <section className="mb-8 rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            AI Investment Coach
          </p>

          <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
            Build your real estate investment strategy
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Tell Nestrova your budget, goals, risk tolerance, and target markets.
            The AI coach will generate a practical investment plan and next steps.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">Investor Profile</h2>

            <div className="mt-5 grid gap-4">
              <label className="font-semibold">Budget</label>
              <input
                className="rounded-lg border p-4"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="900000"
              />

              <label className="font-semibold">Down Payment %</label>
              <input
                className="rounded-lg border p-4"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="25"
              />

              <label className="font-semibold">Investment Goal</label>
              <textarea
                className="min-h-[100px] rounded-lg border p-4"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />

              <label className="font-semibold">Risk Level</label>
              <select
                className="rounded-lg border p-4"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label className="font-semibold">Time Horizon</label>
              <select
                className="rounded-lg border p-4"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
              >
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5-10 years</option>
                <option>10+ years</option>
              </select>

              <label className="font-semibold">Preferred Markets</label>
              <input
                className="rounded-lg border p-4"
                value={preferredMarkets}
                onChange={(e) => setPreferredMarkets(e.target.value)}
                placeholder="Irvine, Austin, Dallas"
              />

              <label className="font-semibold">Monthly Income Goal</label>
              <input
                className="rounded-lg border p-4"
                value={monthlyIncomeGoal}
                onChange={(e) => setMonthlyIncomeGoal(e.target.value)}
                placeholder="1000"
              />

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={generateCoachPlan}
                disabled={loading}
                className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? "Building Plan..." : "Generate AI Investment Plan"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  PERSONALIZED STRATEGY
                </p>
                <h2 className="mt-1 text-3xl font-bold">
                  Your AI Investment Plan
                </h2>
              </div>

              <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                Pro Feature Candidate
              </div>
            </div>

            {!coachPlan && !loading && (
              <div className="mt-8 rounded-2xl bg-gray-50 p-8 text-center">
                <h3 className="text-2xl font-bold">No plan generated yet</h3>
                <p className="mt-2 text-gray-600">
                  Fill out your investor profile and generate your first AI plan.
                </p>
              </div>
            )}

            {loading && (
              <div className="mt-8 rounded-2xl bg-gray-50 p-8 text-center">
                <h3 className="text-2xl font-bold">Nestrova AI is thinking...</h3>
                <p className="mt-2 text-gray-600">
                  Building your market, budget, risk, and strategy plan.
                </p>
              </div>
            )}

            {coachPlan?.plan && (
              <div className="mt-8 whitespace-pre-wrap rounded-2xl bg-gray-50 p-6 text-gray-800">
                {coachPlan.plan}
              </div>
            )}

            {coachPlan?.plan_id && (
              <div className="mt-5 rounded-2xl border bg-white p-5">
                <p className="font-semibold">Plan saved.</p>
                <p className="mt-1 text-sm text-gray-600">
                  Plan ID: {coachPlan.plan_id}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


