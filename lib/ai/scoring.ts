export type ScoreInput = {
  fairValue: number;
  askingPrice: number;
  estimatedRent: number;
  yearBuilt?: number;
  daysOnMarket?: number;
};

export type ScoreResult = {
  investmentScore: number;
  fairValueScore: number;
  rentalScore: number;
  riskScore: number;
  negotiationScore: number;
  marketTimingScore: number;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function calculateScores(input: ScoreInput): ScoreResult {
  const discountPercent =
    input.fairValue > 0 ? ((input.fairValue - input.askingPrice) / input.fairValue) * 100 : 0;

  const grossYield =
    input.askingPrice > 0 ? ((input.estimatedRent * 12) / input.askingPrice) * 100 : 0;

  const age = input.yearBuilt ? new Date().getFullYear() - input.yearBuilt : 25;
  const days = input.daysOnMarket ?? 21;

  const fairValueScore = clamp(55 + discountPercent * 6);
  const rentalScore = clamp(45 + grossYield * 9);
  const riskScore = clamp(92 - age * 0.9);
  const negotiationScore = clamp(45 + days * 1.2 + discountPercent * 3);
  const marketTimingScore = clamp(70 + Math.min(days, 45) * 0.35);

  const investmentScore = clamp(
    fairValueScore * 0.28 +
      rentalScore * 0.22 +
      riskScore * 0.18 +
      negotiationScore * 0.2 +
      marketTimingScore * 0.12
  );

  return {
    investmentScore,
    fairValueScore,
    rentalScore,
    riskScore,
    negotiationScore,
    marketTimingScore,
  };
}
