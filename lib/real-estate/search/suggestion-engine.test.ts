import {
  evaluateSearchSuggestion,
  selectBestComparableAlternative,
  shouldWaitOnSearch,
} from "./suggestion-engine";

const originalSearch = {
  city: "Irvine",
  state: "CA",
  maxPrice: 1200000,
};

const alternativeSearch = {
  city: "Tustin",
  state: "CA",
  maxPrice: 1200000,
};

const caseA = evaluateSearchSuggestion({
  type: "nearby_market",
  title: "Consider Tustin",
  summary: "Stronger economics nearby.",
  originalSearch,
  originalCandidate: {
    address: "Original Property",
    listing_price: 1150000,
    fair_value: 1160000,
    estimated_monthly_rent: 4200,
    discount_percent: 1,
    gross_rent_yield: 3.8,
    deal_score: 70,
    overall_score: 70,
    confidence_score: 78,
    status: "Consider",
    estimated_monthly_cash_flow: -350,
  },
  alternativeSearch,
  alternativeCandidate: {
    address: "Alternative Property",
    listing_price: 980000,
    fair_value: 1050000,
    estimated_monthly_rent: 4400,
    discount_percent: 6.7,
    gross_rent_yield: 4.6,
    deal_score: 84,
    overall_score: 84,
    confidence_score: 82,
    status: "Strong",
    estimated_monthly_cash_flow: 180,
  },
});

const caseB = evaluateSearchSuggestion({
  type: "nearby_market",
  title: "Consider Tustin",
  summary: "Slightly stronger alternative.",
  originalSearch,
  originalCandidate: {
    address: "Original Property",
    listing_price: 1000000,
    fair_value: 1020000,
    estimated_monthly_rent: 4100,
    discount_percent: 2,
    gross_rent_yield: 4.1,
    deal_score: 78,
    overall_score: 78,
    confidence_score: 80,
    status: "Consider",
    estimated_monthly_cash_flow: 50,
  },
  alternativeSearch,
  alternativeCandidate: {
    address: "Alternative Property",
    listing_price: 990000,
    fair_value: 1020000,
    estimated_monthly_rent: 4150,
    discount_percent: 2.5,
    gross_rent_yield: 4.2,
    deal_score: 80,
    overall_score: 80,
    confidence_score: 80,
    status: "Consider",
    estimated_monthly_cash_flow: 90,
  },
});

console.log("===== CASE A =====");
console.log(JSON.stringify({
  recommended: caseA.recommended,
  label: caseA.label,
  decisionImprovement:
    caseA.evidence.decisionImprovement,
  similarityScore:
    caseA.evidence.similarityScore,
  confidenceScore:
    caseA.evidence.confidenceScore,
  reasons: caseA.reasons,
}, null, 2));

console.log("");

console.log("===== CASE B =====");
console.log(JSON.stringify({
  recommended: caseB.recommended,
  decisionImprovement:
    caseB.evidence.decisionImprovement,
  similarityScore:
    caseB.evidence.similarityScore,
  confidenceScore:
    caseB.evidence.confidenceScore,
  reasons: caseB.reasons,
}, null, 2));

const caseC = evaluateSearchSuggestion({
  type: "nearby_market",
  title: "Consider Tustin",
  summary: "Different property type.",
  originalSearch,
  originalCandidate: {
    address: "Manufactured Home",
    listing_price: 189000,
    fair_value: 253000,
    property_type: "Manufactured",
    bedrooms: 2,
    bathrooms: 2,
    square_footage: 1200,
    year_built: 2000,
    estimated_monthly_rent: 3610,
    discount_percent: 25.3,
    gross_rent_yield: 22.92,
    deal_score: 98,
    overall_score: 98,
    confidence_score: 95,
    status: "Strong",
    estimated_monthly_cash_flow: 1200,
  },
  alternativeSearch,
  alternativeCandidate: {
    address: "Single Family Home",
    listing_price: 849000,
    fair_value: 900000,
    property_type: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1800,
    year_built: 1995,
    estimated_monthly_rent: 5200,
    discount_percent: 5.7,
    gross_rent_yield: 7.35,
    deal_score: 96,
    overall_score: 96,
    confidence_score: 96,
    status: "Strong",
    estimated_monthly_cash_flow: 900,
  },
});

const caseD = evaluateSearchSuggestion({
  type: "nearby_market",
  title: "Consider Tustin",
  summary: "Comparable property type.",
  originalSearch,
  originalCandidate: {
    address: "Irvine Single Family",
    listing_price: 1100000,
    fair_value: 1120000,
    property_type: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1800,
    year_built: 1998,
    estimated_monthly_rent: 4700,
    discount_percent: 1.8,
    gross_rent_yield: 4.1,
    deal_score: 76,
    overall_score: 76,
    confidence_score: 82,
    status: "Consider",
    estimated_monthly_cash_flow: -100,
  },
  alternativeSearch,
  alternativeCandidate: {
    address: "Tustin Single Family",
    listing_price: 980000,
    fair_value: 1060000,
    property_type: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1750,
    year_built: 2001,
    estimated_monthly_rent: 5000,
    discount_percent: 7.5,
    gross_rent_yield: 5.1,
    deal_score: 86,
    overall_score: 86,
    confidence_score: 88,
    status: "Strong",
    estimated_monthly_cash_flow: 450,
  },
});

console.log("");
console.log("===== CASE C PROPERTY TYPE MISMATCH =====");
console.log(JSON.stringify({
  recommended: caseC.recommended,
  decisionImprovement:
    caseC.evidence.decisionImprovement,
  similarityScore:
    caseC.evidence.similarityScore,
  confidenceScore:
    caseC.evidence.confidenceScore,
}, null, 2));

console.log("");
console.log("===== CASE D COMPARABLE PROPERTY =====");
console.log(JSON.stringify({
  recommended: caseD.recommended,
  label: caseD.label,
  decisionImprovement:
    caseD.evidence.decisionImprovement,
  similarityScore:
    caseD.evidence.similarityScore,
  confidenceScore:
    caseD.evidence.confidenceScore,
  reasons: caseD.reasons,
}, null, 2));

const selectorOriginal = {
  address: "Irvine Manufactured",
  listing_price: 189000,
  fair_value: 253000,
  property_type: "Manufactured",
  bedrooms: 2,
  bathrooms: 2,
  square_footage: 1120,
  year_built: 2001,
  estimated_monthly_rent: 3610,
  discount_percent: 25.3,
  gross_rent_yield: 22.92,
  deal_score: 98,
  overall_score: 98,
  confidence_score: 95,
  status: "Strong",
  estimated_monthly_cash_flow: 2304,
};

const selectorAlternatives = [
  {
    address: "Tustin Land",
    listing_price: 849000,
    fair_value: 950000,
    property_type: "Land",
    bedrooms: null,
    bathrooms: null,
    square_footage: 65340,
    year_built: null,
    estimated_monthly_rent: 6680,
    discount_percent: 10,
    gross_rent_yield: 9.44,
    deal_score: 96,
    overall_score: 96,
    confidence_score: 96,
    status: "Strong",
    estimated_monthly_cash_flow: 815,
  },
  {
    address: "Tustin Single Family",
    listing_price: 900000,
    fair_value: 970000,
    property_type: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1750,
    year_built: 1998,
    estimated_monthly_rent: 5100,
    discount_percent: 7.2,
    gross_rent_yield: 6.8,
    deal_score: 94,
    overall_score: 94,
    confidence_score: 92,
    status: "Strong",
    estimated_monthly_cash_flow: 600,
  },
  {
    address: "Tustin Manufactured",
    listing_price: 235000,
    fair_value: 285000,
    property_type: "Manufactured",
    bedrooms: 2,
    bathrooms: 2,
    square_footage: 1180,
    year_built: 2003,
    estimated_monthly_rent: 3350,
    discount_percent: 17.5,
    gross_rent_yield: 17.1,
    deal_score: 88,
    overall_score: 88,
    confidence_score: 90,
    status: "Strong",
    estimated_monthly_cash_flow: 1700,
  },
];

const selectedComparable =
  selectBestComparableAlternative(
    selectorOriginal,
    selectorAlternatives,
  );

console.log("");
console.log("===== TOP COMPARABLE SELECTOR =====");
console.log(
  JSON.stringify(
    {
      selectedAddress:
        selectedComparable?.address ?? null,
      propertyType:
        selectedComparable?.property_type ?? null,
      overallScore:
        selectedComparable?.overall_score ?? null,
    },
    null,
    2,
  ),
);

const caseE = evaluateSearchSuggestion({
  type: "better_tradeoff",
  title: "Lower-cost alternative",
  summary: "Similar decision quality with stronger economics.",
  originalSearch,
  originalCandidate: {
    address: "Original Comparable Home",
    listing_price: 1000000,
    fair_value: 1030000,
    property_type: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1800,
    year_built: 2000,
    estimated_monthly_rent: 4300,
    discount_percent: 2.9,
    gross_rent_yield: 4.2,
    deal_score: 82,
    overall_score: 82,
    confidence_score: 84,
    status: "Consider",
    estimated_monthly_cash_flow: -150,
  },
  alternativeSearch,
  alternativeCandidate: {
    address: "Lower Cost Comparable Home",
    listing_price: 850000,
    fair_value: 900000,
    property_type: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1750,
    year_built: 2002,
    estimated_monthly_rent: 4500,
    discount_percent: 5.6,
    gross_rent_yield: 5.0,
    deal_score: 85,
    overall_score: 85,
    confidence_score: 87,
    status: "Consider",
    estimated_monthly_cash_flow: 300,
  },
});

console.log("");
console.log("===== CASE E BETTER TRADE-OFF =====");
console.log(JSON.stringify({
  recommended: caseE.recommended,
  label: caseE.label,
  decisionImprovement:
    caseE.evidence.decisionImprovement,
  priceDifferencePercent:
    caseE.evidence.priceDifferencePercent,
  yieldImprovement:
    caseE.evidence.yieldImprovement,
  cashFlowImprovement:
    caseE.evidence.cashFlowImprovement,
  comparabilityScore:
    caseE.evidence.comparabilityScore,
  reasons: caseE.reasons,
}, null, 2));

const caseF = {
  address: "Wait Candidate",
  listing_price: 950000,
  fair_value: 900000,
  property_type: "Single Family",
  bedrooms: 3,
  bathrooms: 2,
  square_footage: 1800,
  year_built: 2001,
  estimated_monthly_rent: 4100,
  discount_percent: -5.6,
  gross_rent_yield: 4.1,
  deal_score: 78,
  overall_score: 78,
  confidence_score: 82,
  status: "Consider",
  estimated_monthly_cash_flow: -300,
};

console.log("");
console.log("===== CASE F WAIT =====");
console.log(JSON.stringify({
  shouldWait:
    shouldWaitOnSearch(caseF),
}, null, 2));
