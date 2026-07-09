"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";
import UniversalSearch from "@/components/search/UniversalSearch";
import FloatingAIAssistant from "@/components/assistant/FloatingAIAssistant";

type DashboardData = {
  user_name: string;
  portfolio_count: number;
  avg_deal_score: number;
  saved_deals: number;
  ai_reports: number;
  coach_plans: number;
  watchlist_count: number;
  weekly_reports: number;
  ai_brief: string;
  recent_activity: Array<{
    title: string;
    description: string;
    href: string;
  }>;
};

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadDashboard();
    }
  }, [isSignedIn, user?.id]);

  async function loadDashboard() {
    if (!user?.id) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/dashboard?user_id=${encodeURIComponent(user.id)}`);
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not load dashboard.");
        setLoading(false);
        return;
      }

      setData(result);
    } catch {
      setMessage("Dashboard connection failed.");
    }

    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold">Welcome to Nestrova</h1>
          <p className="mt-3 text-gray-600">
            Sign in to open your AI real estate investment dashboard.
          </p>
          <SignInButton mode="modal">
            <button className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white">
              Sign In
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <FloatingAIAssistant />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ??Back to Nestrova
          </a>
          <UserButton />
        </div>

        <UniversalSearch />

        {message && (
          <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">
            {message}
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow">
            Loading your dashboard...
          </div>
        )}

        {data && (
          <>
            <DashboardHero data={data} />
            <DashboardWidgets data={data} />
          </>
        )}

        {!loading && !data && !message && (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow">
            Preparing your dashboard...
          </div>
        )}
      </div>
    </main>
  );
}

