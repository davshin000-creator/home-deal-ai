export type CompareRecommendation = "BUY" | "NEGOTIATE" | "WAIT" | "SKIP";

export type CompareProperty = {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  fairValue: number;
  estimatedRent: number;
  brainScore: number;
  riskScore: number;
  rentalScore: number;
  negotiationScore: number;
  forecastScore: number;
  cashflowScore: number;
  roiScore: number;
  recommendation: CompareRecommendation;
  summary: string;
  strengths: string[];
  risks: string[];
};

export type CompareResult = {
  properties: CompareProperty[];
  ranking: CompareProperty[];
  winner: {
    property: CompareProperty;
    reasons: string[];
    confidence: number;
  };
  executiveSummary: string;
};
