import { calculateScores, ScoreInput } from "./scoring";
import { analyzeRisks, RiskInput } from "./riskEngine";
import { generateOfferStrategies, OfferInput } from "./offerEngine";

export type DecisionInput = ScoreInput &
  RiskInput &
  OfferInput & {
    address: string;
    city?: string;
    state?: string;
  };

export function runDecisionEngine(input: DecisionInput) {
  const scores = calculateScores(input);
  const risks = analyzeRisks(input);
  const offers = generateOfferStrategies(input);
  const highRiskCount = risks.filter((risk) => risk.level === "High").length;

  let recommendation: "BUY" | "HOLD" | "PASS" = "HOLD";
  if (scores.investmentScore >= 82 && highRiskCount === 0) recommendation = "BUY";
  if (scores.investmentScore < 65 || highRiskCount >= 2) recommendation = "PASS";

  const confidence = Math.max(60, Math.min(97, scores.investmentScore + 5 - highRiskCount * 6));

  const reasons = [
    `Investment score is ${scores.investmentScore}/100.`,
    `Fair value score is ${scores.fairValueScore}/100 based on estimated value versus asking price.`,
    `Rental score is ${scores.rentalScore}/100 based on estimated gross rent yield.`,
    `Negotiation score is ${scores.negotiationScore}/100 based on pricing spread and days on market.`,
  ];

  const summary =
    recommendation === "BUY"
      ? "This property appears attractive based on valuation, rental yield, and negotiation leverage."
      : recommendation === "HOLD"
      ? "This property may be worth monitoring, but the current assumptions do not strongly support immediate action."
      : "This property appears less attractive based on the current score and risk profile.";

  return {
    address: input.address,
    recommendation,
    confidence,
    scores,
    risks,
    offers,
    summary,
    reasons,
    nextAction: recommendation === "BUY" ? "Generate Offer" : "Compare Alternatives",
  };
}
