import type { CompareProperty, CompareResult } from "@/types/comparison";

export function getWeightedScore(property: CompareProperty) {
  return Math.round(
    property.brainScore * 0.35 +
      property.riskScore * 0.15 +
      property.rentalScore * 0.12 +
      property.negotiationScore * 0.14 +
      property.forecastScore * 0.1 +
      property.cashflowScore * 0.07 +
      property.roiScore * 0.07
  );
}

export function compareProperties(properties: CompareProperty[]): CompareResult {
  const ranking = [...properties].sort((a, b) => getWeightedScore(b) - getWeightedScore(a));
  const winner = ranking[0];

  return {
    properties,
    ranking,
    winner: {
      property: winner,
      confidence: Math.max(78, Math.min(97, getWeightedScore(winner) + 4)),
      reasons: [
        `Highest weighted comparison score: ${getWeightedScore(winner)}/100.`,
        `Brain score is ${winner.brainScore}/100.`,
        `Recommendation is ${winner.recommendation}.`,
        winner.strengths[0] || "Best overall investment profile.",
      ],
    },
    executiveSummary: `${winner.address} is the current winner because it has the strongest blended score across valuation, risk, rent, negotiation, forecast, cashflow, and ROI signals.`,
  };
}
