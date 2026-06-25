"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import IntelligenceHero from "@/components/intelligence/IntelligenceHero";
import OpportunityFeed from "@/components/intelligence/OpportunityFeed";
import MarketRadar from "@/components/intelligence/MarketRadar";
import PortfolioIntelligence from "@/components/intelligence/PortfolioIntelligence";
import IntelligenceTimeline from "@/components/intelligence/IntelligenceTimeline";
import NextBestAction from "@/components/intelligence/NextBestAction";

export default function IntelligencePage() {
  const { isSignedIn, user } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) loadIntelligence();
  }, [isSignedIn, user?.id]);

  async function loadIntelligence() {
    if (!user?.id) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/intelligence?user_id=${encodeURIComponent(user.id)}`);
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not load Nestrova Intelligence.");
        setLoading(false);
        return;
      }

      setData(result);
    } catch {
      setMessage("Nestrova Intelligence connection failed.");
    }

    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold">Nestrova Intelligence</h1>
          <p className="mt-3 text-gray-600">
            Sign in to open your personalized AI investment intelligence feed.
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ← Back to Nestrova
          </a>
          <UserButton />
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 shadow">
            Building your Intelligence Feed...
          </div>
        )}

        {message && (
          <div className="rounded-3xl bg-red-50 p-8 text-red-700">
            {message}
          </div>
        )}

        {data && (
          <div className="grid gap-8">
            <IntelligenceHero data={data} />
            <NextBestAction action={data.next_best_action} />
            <OpportunityFeed opportunities={data.opportunities} />
            <div className="grid gap-8 lg:grid-cols-2">
              <PortfolioIntelligence data={data.portfolio_intelligence} />
              <MarketRadar markets={data.market_radar} />
            </div>
            <IntelligenceTimeline items={data.timeline} />
          </div>
        )}
      </div>
    </main>
  );
}
