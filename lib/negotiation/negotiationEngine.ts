export type NegotiationInput = {
  propertyAddress: string;
  listingPrice: number;
  recommendedOffer: number;
  fairValue: number;
  daysOnMarket: number;
  priceReduction: number;
  sellerCounter?: number;
  inspectionConcern?: string;
};

export function formatMoney(value: number) {
  return `$${Math.round(value || 0).toLocaleString()}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function calculateNegotiation(input: NegotiationInput) {
  const listingPrice = Number(input.listingPrice || 0);
  const recommendedOffer = Number(input.recommendedOffer || 0);
  const fairValue = Number(input.fairValue || listingPrice || 0);
  const daysOnMarket = Number(input.daysOnMarket || 0);
  const priceReduction = Number(input.priceReduction || 0);
  const sellerCounter = Number(input.sellerCounter || 0);

  const domScore = daysOnMarket >= 60 ? 30 : daysOnMarket >= 45 ? 24 : daysOnMarket >= 30 ? 17 : daysOnMarket >= 14 ? 9 : 4;
  const reductionScore = priceReduction > 0 ? 22 : 0;
  const overValueScore = listingPrice > fairValue ? 18 : 6;
  const offerGapScore = listingPrice && recommendedOffer ? clamp(((listingPrice - recommendedOffer) / listingPrice) * 180, 0, 25) : 8;

  const motivationScore = clamp(Math.round(30 + domScore + reductionScore + overValueScore + offerGapScore), 35, 98);
  const leverageLevel = motivationScore >= 78 ? "Strong" : motivationScore >= 58 ? "Medium" : "Low";
  const recommendedCounter = sellerCounter > 0
    ? Math.round((recommendedOffer * 0.65 + sellerCounter * 0.35) / 500) * 500
    : Math.round(recommendedOffer / 500) * 500;

  const strategy = leverageLevel === "Strong"
    ? "Use a confident but respectful anchor. Lead with data, keep contingencies, and ask for seller concessions."
    : leverageLevel === "Medium"
    ? "Use a balanced strategy. Stay close enough to remain competitive while asking for credits or repairs."
    : "Use a relationship-focused strategy. Keep the offer clean, reduce friction, and avoid over-negotiating early.";

  const talkingPoints = [
    `Recommended offer is ${listingPrice ? (((listingPrice - recommendedOffer) / listingPrice) * 100).toFixed(1) : "0.0"}% below list price.`,
    `Estimated fair value is $${Math.round(fairValue).toLocaleString()}.`,
    daysOnMarket >= 30 ? `The property has been on market for ${daysOnMarket} days, which may support negotiation.` : "Days on market is still relatively low, so the offer should remain competitive.",
    priceReduction > 0 ? `The listing has already had a price reduction of $${Math.round(priceReduction).toLocaleString()}.` : "No prior price reduction is assumed.",
  ];

  const emailDraft = `Subject: Purchase Offer for ${input.propertyAddress}

Hello,

Thank you for the opportunity to review ${input.propertyAddress}.

After analyzing the listing price, estimated fair value, market conditions, and investment assumptions, we would like to submit an offer of $${Math.round(recommendedOffer).toLocaleString()}.

Key points:
- Offer price: $${Math.round(recommendedOffer).toLocaleString()}
- Estimated fair value reviewed: $${Math.round(fairValue).toLocaleString()}
- Days on market considered: ${daysOnMarket}
- Requested consideration: standard inspection and due diligence protections

We are open to discussing terms that create a fair outcome for both sides.

Best,
`;

  return {
    motivationScore,
    leverageLevel,
    recommendedCounter,
    strategy,
    talkingPoints,
    concessionsToAsk: [
      "Seller credit toward closing costs",
      "Repair credit after inspection",
      "Home warranty if appropriate",
      "Flexible closing timeline",
    ],
    inspectionFocus: [
      "Roof age and condition",
      "HVAC condition",
      "Foundation and drainage",
      "Electrical and plumbing systems",
      "Insurance-related issues",
      input.inspectionConcern || "Deferred maintenance or visible repairs",
    ],
    riskSummary: [
      "Do not rely on AI output alone for legal or contractual decisions.",
      "Confirm comparable sales and local market conditions with a licensed agent.",
      "Verify tax, insurance, HOA, inspection, and financing assumptions.",
      "Have any offer documents reviewed by qualified professionals.",
    ],
    emailDraft,
  };
}
