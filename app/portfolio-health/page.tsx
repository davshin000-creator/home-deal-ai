"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";

export default function PortfolioHealthPage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadHealth();
    }
  }, [isSignedIn, user?.id]);

  async function loadHealth() {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/portfolio-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load portfolio health.");
        setLoading(false);
        return;
      }

      setHealth(data);
    } catch {
      setError("Portfolio health connection failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ??Back to Nestrova
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

        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            AI Portfolio Health
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Understand your portfolio quality
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Nestrova AI reviews your saved deals and scores diversification,
            cash flow, risk, and overall investment quality.
          </p>
        </section>

        {!isSignedIn && (
          <div className="mt-8 rounded-2xl bg-yellow-50 p-6 text-yellow-900">
            Please sign in to view your portfolio health.
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow">
            Loading AI portfolio health...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {health && (
          <section className="mt-8 grid gap-6">
            <div className="rounded-3xl border-2 border-black bg-white p-8 shadow">
              <p className="text-sm font-semibold text-gray-500">
                PORTFOLIO HEALTH SCORE
              </p>
              <h2 className="mt-2 text-7xl font-bold">
                {health.health_score}/100
              </h2>
              <p className="mt-3 text-xl font-semibold">
                {health.grade}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Saved Deals</p>
                <p className="mt-2 text-3xl font-bold">{health.saved_count}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="mt-2 text-3xl font-bold">{health.avg_score}/100</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Average Yield</p>
                <p className="mt-2 text-3xl font-bold">{health.avg_yield}%</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Avg Cash Flow</p>
                <p className="mt-2 text-3xl font-bold">${health.avg_cash_flow}/mo</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-3xl font-bold">AI Recommendation</h2>
              <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 text-gray-800">
                {health.ai_recommendation}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

