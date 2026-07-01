export type OfferInput = {
  askingPrice: number;
  fairValue: number;
  daysOnMarket?: number;
};

export type OfferStrategy = {
  name: "Aggressive" | "Balanced" | "Safe";
  offer: number;
  acceptanceProbability: number;
  note: string;
};

function roundToNearest(value: number, nearest = 500) {
  return Math.round(value / nearest) * nearest;
}

export function generateOfferStrategies(input: OfferInput): OfferStrategy[] {
  const days = input.daysOnMarket ?? 21;
  const discount =
    input.fairValue > 0
      ? (input.fairValue - input.askingPrice) / input.fairValue
      : 0;

  const base = input.askingPrice;
  const leverage = Math.max(0, Math.min(0.06, discount + days / 1000));

  const aggressive = roundToNearest(
    base * (1 - Math.min(0.07, leverage + 0.025))
  );
  const balanced = roundToNearest(
    base * (1 - Math.min(0.045, leverage))
  );
  const safe = roundToNearest(
    base * (1 - Math.min(0.025, leverage / 2))
  );

  return [
    {
      name: "Aggressive",
      offer: aggressive,
      acceptanceProbability: Math.max(45, Math.min(78, 58 + days * 0.4)),
      note: "Maximizes upside, but may require stronger negotiation tolerance.",
    },
    {
      name: "Balanced",
      offer: balanced,
      acceptanceProbability: Math.max(62, Math.min(88, 72 + days * 0.35)),
      note: "Best balance between upside and acceptance probability.",
    },
    {
      name: "Safe",
      offer: safe,
      acceptanceProbability: Math.max(78, Math.min(96, 86 + days * 0.2)),
      note: "Higher acceptance probability, but lower potential upside.",
    },
  ];
}
