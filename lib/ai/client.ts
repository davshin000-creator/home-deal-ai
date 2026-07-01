"use client";

export type DecisionApiResult = {
  address: string;
  recommendation: "BUY" | "HOLD" | "PASS";
  confidence: number;
  scores: {
    investmentScore: number;
    fairValueScore: number;
    rentalScore: number;
    riskScore: number;
    negotiationScore: number;
    marketTimingScore: number;
  };
  risks: Array<{
    label: string;
    level: "Low" | "Medium" | "High";
    reason: string;
  }>;
  offers: Array<{
    name: "Aggressive" | "Balanced" | "Safe";
    offer: number;
    acceptanceProbability: number;
    note: string;
  }>;
  summary: string;
  reasons: string[];
  nextAction: string;
};

export async function getDecision(): Promise<DecisionApiResult> {
  const response = await fetch("/api/ai-decision", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load AI decision.");
  }

  const data = await response.json();

  if (!data.ok || !data.result) {
    throw new Error("Invalid AI decision response.");
  }

  return data.result as DecisionApiResult;
}
