export type SearchDealCandidate = {
  address: string;
  listing_price: number;
  fair_value: number;

  property_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_footage?: number | null;
  year_built?: number | null;

  estimated_monthly_rent: number;
  discount_percent: number;
  gross_rent_yield: number;
  deal_score: number;
  overall_score?: number;
  forecast_score?: number;
  forecast_outlook?: string;
  neighborhood_score?: number;
  neighborhood_grade?: string;
  expected_appreciation?: number;
  confidence_score?: number;
  status: string;
  estimated_monthly_cash_flow: number;
};

export type SearchContext = {
  city: string;
  state: string;
  maxPrice: number;
};

export type SuggestionType =
  | "nearby_market"
  | "lower_budget"
  | "budget_expansion"
  | "better_tradeoff"
  | "wait";

export type SuggestionEvidence = {
  decisionImprovement: number;
  priceDifference: number;
  priceDifferencePercent: number;
  yieldImprovement: number;
  cashFlowImprovement: number;
  discountImprovement: number;
  similarityScore: number;
  comparabilityScore: number;
  confidenceScore: number;
};

export type SuggestionLabel =
  | "better_match"
  | "better_tradeoff"
  | "wait";

export type SearchSuggestion = {
  type: SuggestionType;
  label: SuggestionLabel;

  title: string;
  summary: string;

  original: {
    search: SearchContext;
    candidate: SearchDealCandidate | null;
    score: number;
  };

  alternative: {
    search: SearchContext;
    candidate: SearchDealCandidate | null;
    score: number;
  };

  evidence: SuggestionEvidence;

  reasons: string[];

  recommended: boolean;
};
