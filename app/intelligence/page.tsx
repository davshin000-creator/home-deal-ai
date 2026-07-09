"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@/components/auth/ClerkCompat";
import ProFeatureGate from "@/components/auth/ProFeatureGate";
import IntelligenceHero from "@/components/intelligence/IntelligenceHero";
import OpportunityFeed from "@/components/intelligence/OpportunityFeed";
import MarketRadar from "@/components/intelligence/MarketRadar";
import PortfolioIntelligence from "@/components/intelligence/PortfolioIntelligence";
import IntelligenceTimeline from "@/components/intelligence/IntelligenceTimeline";
import NextBestAction from "@/components/intelligence/NextBestAction";

function IntelligenceContent() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { if (user?.id) loadIntelligence(); }, [user?.id]);

  async function loadIntelligence() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/intelligence", { cache: "no-store" });
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

  return (
    <main className="min-h-screen bg-[#050505] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-white/50 hover:text-white">Back to Nestrova</a>
          <UserButton />
        </div>
        {loading && <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8">Building your Intelligence Feed...</div>}
        {message && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">{message}</div>}
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

export default function IntelligencePage() {
  return (
    <ProFeatureGate
      featureName="Nestrova Intelligence"
      title="Unlock your personalized AI investment intelligence feed."
      description="Get opportunities, market radar, next-best actions, and portfolio intelligence in one Pro workspace."
    >
      <IntelligenceContent />
    </ProFeatureGate>
  );
}


