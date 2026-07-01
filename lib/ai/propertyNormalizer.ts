export type AnalyzeOutput = {
  address?: string;
  city?: string;
  state?: string;
  askingPrice?: number;
  listingPrice?: number;
  price?: number;
  fairValue?: number;
  aiFairValue?: number;
  estimatedValue?: number;
  estimatedRent?: number;
  rentEstimate?: number;
  yearBuilt?: number;
  daysOnMarket?: number;
  hoaMonthly?: number;
};

export type NormalizedDecisionInput = {
  address: string;
  city?: string;
  state?: string;
  askingPrice: number;
  fairValue: number;
  estimatedRent: number;
  yearBuilt?: number;
  daysOnMarket?: number;
  hoaMonthly?: number;
};

function numberOrFallback(value: unknown, fallback: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

export function normalizeAnalyzeOutput(
  analysis: AnalyzeOutput,
  fallbackAddress = "Unknown Property"
): NormalizedDecisionInput {
  const askingPrice = numberOrFallback(
    analysis.askingPrice ?? analysis.listingPrice ?? analysis.price,
    817500
  );

  const fairValue = numberOrFallback(
    analysis.fairValue ?? analysis.aiFairValue ?? analysis.estimatedValue,
    Math.round(askingPrice * 1.08)
  );

  const estimatedRent = numberOrFallback(
    analysis.estimatedRent ?? analysis.rentEstimate,
    Math.round((askingPrice * 0.045) / 12)
  );

  return {
    address: analysis.address || fallbackAddress,
    city: analysis.city,
    state: analysis.state,
    askingPrice,
    fairValue,
    estimatedRent,
    yearBuilt: analysis.yearBuilt,
    daysOnMarket: analysis.daysOnMarket,
    hoaMonthly: analysis.hoaMonthly,
  };
}
