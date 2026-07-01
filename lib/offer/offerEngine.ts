export type OfferInput = {
  askingPrice?: number;
  fairValue?: number;
  estimatedRent?: number;
  daysOnMarket?: number;
  riskLevel?: "Low" | "Medium" | "High";
};

export type OfferResult = {
  recommendedOffer: number;
  aggressiveOffer: number;
  balancedOffer: number;
  safeOffer: number;
  acceptanceProbability: number;
  strategy: "Aggressive" | "Balanced" | "Safe";
  notes: string[];
};

function roundToNearest(value: number, nearest = 500) {
  return Math.round(value / nearest) * nearest;
}

export function calculateOffer(input: OfferInput = {}): OfferResult {
  const askingPrice = Number(input.askingPrice || 817500);
  const fairValue = Number(input.fairValue || Math.round(askingPrice * 1.08));
  const daysOnMarket = Number(input.daysOnMarket || 21);

  const discount =
    fairValue > 0 ? Math.max(0, (fairValue - askingPrice) / fairValue) : 0;

  const leverage = Math.max(0, Math.min(0.06, discount + daysOnMarket / 1000));

  const aggressiveOffer = roundToNearest(
    askingPrice * (1 - Math.min(0.07, leverage + 0.025))
  );
  const balancedOffer = roundToNearest(
    askingPrice * (1 - Math.min(0.045, leverage))
  );
  const safeOffer = roundToNearest(
    askingPrice * (1 - Math.min(0.025, leverage / 2))
  );

  const riskLevel = input.riskLevel || "Medium";
  const strategy: OfferResult["strategy"] =
    riskLevel === "High" ? "Safe" : discount > 0.05 ? "Balanced" : "Safe";

  const recommendedOffer =
    strategy === "Aggressive"
      ? aggressiveOffer
      : strategy === "Balanced"
      ? balancedOffer
      : safeOffer;

  const acceptanceProbability =
    strategy === "Aggressive"
      ? Math.max(45, Math.min(78, 58 + daysOnMarket * 0.4))
      : strategy === "Balanced"
      ? Math.max(62, Math.min(88, 72 + daysOnMarket * 0.35))
      : Math.max(78, Math.min(96, 86 + daysOnMarket * 0.2));

  return {
    recommendedOffer,
    aggressiveOffer,
    balancedOffer,
    safeOffer,
    acceptanceProbability,
    strategy,
    notes: [
      "Offer strategy is based on asking price, estimated fair value, and days on market.",
      "Use inspection, appraisal, and financing contingencies where appropriate.",
      "Have final terms reviewed by qualified real estate professionals.",
    ],
  };
}
