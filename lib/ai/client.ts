"use client";

export type DecisionRequest = {
  address: string;
  city?: string;
  state?: string;
  askingPrice?: number;
  fairValue?: number;
  estimatedRent?: number;
  yearBuilt?: number;
  daysOnMarket?: number;
  hoaMonthly?: number;
};

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
  risks: Array<{ label: string; level: "Low" | "Medium" | "High"; reason: string }>;
  offers: Array<{ name: "Aggressive" | "Balanced" | "Safe"; offer: number; acceptanceProbability: number; note: string }>;
  summary: string;
  reasons: string[];
  nextAction: string;
};

export type ExplanationResult = {
  executiveSummary: string;
  whyThisDecision: string[];
  riskSummary: string[];
  negotiationAdvice: string[];
  nextBestAction: string;
  confidenceExplanation: string;
};

export const defaultDecisionInput: DecisionRequest = {
  address: "123 Main St",
  city: "Dallas",
  state: "TX",
  askingPrice: 817500,
  fairValue: 885000,
  estimatedRent: 4200,
  yearBuilt: 2008,
  daysOnMarket: 28,
  hoaMonthly: 250,
};

export async function getDecision(input?: DecisionRequest): Promise<DecisionApiResult> {
  const response = await fetch("/api/ai-decision", {
    method: input ? "POST" : "GET",
    headers: input ? { "Content-Type": "application/json" } : undefined,
    body: input ? JSON.stringify(input) : undefined,
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to load AI decision.");
  const data = await response.json();
  if (!data.ok || !data.result) throw new Error("Invalid AI decision response.");
  return data.result as DecisionApiResult;
}

export async function getAnalyzeDecision(input: {
  address: string;
  city?: string;
  state?: string;
}): Promise<DecisionApiResult> {
  const response = await fetch("/api/analyze-decision", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to analyze property.");
  const data = await response.json();
  if (!data.ok || !data.decision) throw new Error(data.error || "Invalid analyze decision response.");
  return data.decision as DecisionApiResult;
}

export async function getExplanation(decision: DecisionApiResult): Promise<ExplanationResult> {
  const response = await fetch("/api/ai-explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(decision),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to generate explanation.");
  const data = await response.json();
  if (!data.ok || !data.explanation) throw new Error(data.error || "Invalid explanation response.");
  return data.explanation as ExplanationResult;
}
