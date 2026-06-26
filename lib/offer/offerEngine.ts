export type OfferInput = {
  propertyAddress: string;
  listingPrice: number;
  fairValue: number;
  estimatedRent?: number;
  dealScore?: number;
  daysOnMarket?: number;
  priceReduction?: number;
  repairCredit?: number;
};

export type OfferResult = {
  recommendedOffer: number;
  maxOffer: number;
  walkAwayPrice: number;
  discountToList: number;
  discountToFairValue: number;
  offerStrength: number;
  confidence: number;
  leverage: "Low" | "Medium" | "Strong";
  why: string[];
  risks: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function calculateOffer(input: OfferInput): OfferResult {
  const listingPrice = Number(input.listingPrice || 0);
  const fairValue = Number(input.fairValue || listingPrice || 0);
  const dealScore = Number(input.dealScore || 70);
  const daysOnMarket = Number(input.daysOnMarket || 21);
  const priceReduction = Number(input.priceReduction || 0);
  const repairCredit = Number(input.repairCredit || 0);

  const baseDiscount = dealScore >= 90 ? 0.035 : dealScore >= 80 ? 0.025 : dealScore >= 70 ? 0.015 : 0.005;
  const domDiscount = daysOnMarket >= 45 ? 0.02 : daysOnMarket >= 30 ? 0.012 : 0;
  const reductionDiscount = priceReduction > 0 ? 0.008 : 0;
  const repairDiscount = listingPrice > 0 ? repairCredit / listingPrice : 0;
  const totalDiscount = clamp(baseDiscount + domDiscount + reductionDiscount + repairDiscount, 0.005, 0.09);

  const anchorPrice = Math.min(listingPrice, fairValue || listingPrice);
  const recommendedOffer = Math.round(anchorPrice * (1 - totalDiscount));
  const maxOffer = Math.round(Math.min(listingPrice, fairValue * 0.99));
  const walkAwayPrice = Math.round(Math.min(listingPrice * 1.015, fairValue * 1.02));

  const discountToList = listingPrice ? ((listingPrice - recommendedOffer) / listingPrice) * 100 : 0;
  const discountToFairValue = fairValue ? ((fairValue - recommendedOffer) / fairValue) * 100 : 0;

  const offerStrength = clamp(Math.round(70 + discountToFairValue * 2 + (daysOnMarket >= 30 ? 8 : 0) + (priceReduction > 0 ? 6 : 0)), 50, 98);
  const confidence = clamp(Math.round(72 + (dealScore - 70) * 0.6 + (fairValue > 0 ? 8 : 0)), 55, 98);

  const leverage: "Low" | "Medium" | "Strong" =
    daysOnMarket >= 45 || priceReduction > 0 || discountToFairValue >= 6
      ? "Strong"
      : daysOnMarket >= 25 || discountToFairValue >= 3
      ? "Medium"
      : "Low";

  return {
    recommendedOffer,
    maxOffer,
    walkAwayPrice,
    discountToList,
    discountToFairValue,
    offerStrength,
    confidence,
    leverage,
    why: [
      `${discountToList.toFixed(1)}% below listing price`,
      `${discountToFairValue.toFixed(1)}% below estimated fair value`,
      daysOnMarket >= 30 ? "Longer days on market may create negotiation leverage" : "Offer remains competitive while preserving downside protection",
      priceReduction > 0 ? "Price reduction suggests seller may be open to negotiation" : "No major price reduction assumed",
      repairCredit > 0 ? "Repair credit included in offer logic" : "No repair credit included yet",
    ],
    risks: [
      "Verify comparable sales with a licensed real estate professional",
      "Confirm repairs, insurance, tax, HOA, and inspection findings",
      "Offer strategy should be reviewed by your agent and attorney where required",
    ],
  };
}

export function formatMoney(value: number) {
  return `$${Math.round(value || 0).toLocaleString()}`;
}
