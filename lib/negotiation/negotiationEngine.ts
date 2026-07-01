export type NegotiationInput = {
  askingPrice?: number;
  fairValue?: number;
  recommendedOffer?: number;
  daysOnMarket?: number;
  riskLevel?: "Low" | "Medium" | "High";
};

export type NegotiationResult = {
  leverageScore: number;
  openingPosition: string;
  counterStrategy: string;
  sellerCreditStrategy: string;
  talkingPoints: string[];
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function calculateNegotiation(input: NegotiationInput = {}): NegotiationResult {
  const askingPrice = Number(input.askingPrice || 817500);
  const fairValue = Number(input.fairValue || Math.round(askingPrice * 1.08));
  const recommendedOffer = Number(input.recommendedOffer || Math.round(askingPrice * 0.955));
  const daysOnMarket = Number(input.daysOnMarket || 21);

  const discountPercent =
    fairValue > 0 ? ((fairValue - askingPrice) / fairValue) * 100 : 0;

  const offerGapPercent =
    askingPrice > 0 ? ((askingPrice - recommendedOffer) / askingPrice) * 100 : 0;

  const leverageScore = clamp(50 + discountPercent * 4 + daysOnMarket * 0.8);

  return {
    leverageScore,
    openingPosition: `Open around ${offerGapPercent.toFixed(1)}% below asking while emphasizing clean terms.`,
    counterStrategy:
      leverageScore >= 75
        ? "Counter slowly and protect inspection leverage."
        : "Use a balanced counter and avoid over-negotiating if seller interest is strong.",
    sellerCreditStrategy:
      "Prefer seller credits for inspection items, rate buydown, or closing costs when price reduction is resisted.",
    talkingPoints: [
      "Reference comparable sales and current market conditions.",
      "Emphasize certainty of closing and clean communication.",
      "Keep inspection and financing protections in place.",
      "Avoid emotional bidding beyond the calculated offer range.",
    ],
  };
}
