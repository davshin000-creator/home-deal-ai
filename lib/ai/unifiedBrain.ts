"use server";

export type UnifiedBrainInput = {
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

export async function runUnifiedBrain(input: UnifiedBrainInput) {
  const askingPrice = Number(input.askingPrice || 817500);
  const fairValue = Number(input.fairValue || 885000);
  const estimatedRent = Number(input.estimatedRent || 4200);
  const discount = ((fairValue - askingPrice) / fairValue) * 100;
  const annualRent = estimatedRent * 12;
  const grossYield = (annualRent / askingPrice) * 100;

  const fairValueScore = Math.max(40, Math.min(100, Math.round(70 + discount * 3)));
  const rentalScore = Math.max(40, Math.min(100, Math.round(55 + grossYield * 7)));
  const riskScore = Math.max(45, Math.min(95, Math.round(82 - Math.max(0, Number(input.hoaMonthly || 250) - 250) / 20)));
  const negotiationScore = Math.max(45, Math.min(100, Math.round(68 + discount * 2)));

  const brainScore = Math.round(
    fairValueScore * 0.35 +
      rentalScore * 0.2 +
      riskScore * 0.2 +
      negotiationScore * 0.25
  );

  const action =
    brainScore >= 85 ? "BUY" : brainScore >= 72 ? "NEGOTIATE" : brainScore >= 62 ? "WAIT" : "SKIP";

  const unifiedAction =
    action === "BUY"
      ? "Proceed with disciplined offer"
      : action === "NEGOTIATE"
      ? "Negotiate before commitment"
      : action === "WAIT"
      ? "Wait for better signal"
      : "Skip and reallocate attention";

  const confidence = Math.max(70, Math.min(98, Math.round(brainScore + 6)));

  const agentConsensus = [
    { agent: "Valuation Agent", signal: fairValueScore >= 75 ? "Positive" : "Neutral", confidence: fairValueScore },
    { agent: "Rental Agent", signal: rentalScore >= 75 ? "Positive" : "Caution", confidence: rentalScore },
    { agent: "Risk Agent", signal: riskScore >= 70 ? "Controlled" : "Elevated", confidence: riskScore },
    { agent: "Negotiation Agent", signal: negotiationScore >= 75 ? "Leverage" : "Limited", confidence: negotiationScore },
  ];

  const averageConsensus = Math.round(
    agentConsensus.reduce((sum, item) => sum + item.confidence, 0) / agentConsensus.length
  );

  const headline =
    action === "BUY"
      ? "Strong buy candidate"
      : action === "NEGOTIATE"
      ? "Negotiate before moving forward"
      : action === "WAIT"
      ? "Wait and monitor"
      : "Skip this opportunity";

  const executiveSummary = `${input.address} shows a ${discount.toFixed(
    1
  )}% valuation spread and an estimated ${grossYield.toFixed(
    1
  )}% gross rental yield. The unified brain score is ${brainScore}, so Nestrova recommends: ${unifiedAction}.`;

  return {
    address: input.address,
    action,
    headline,
    brainScore,
    confidence,
    averageConsensus,
    unifiedAction,
    finalMemo: `${headline}. ${executiveSummary}`,
    agentConsensus,
  };
}