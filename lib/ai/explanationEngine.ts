export type ExplanationInput = {
  address: string;
  recommendation: "BUY" | "HOLD" | "PASS";
  confidence: number;
  summary: string;
  reasons: string[];
  scores: {
    investmentScore: number;
    fairValueScore: number;
    rentalScore: number;
    riskScore: number;
    negotiationScore: number;
    marketTimingScore: number;
  };
  risks: Array<{
    label: string;
    level: "Low" | "Medium" | "High";
    reason: string;
  }>;
  offers: Array<{
    name: "Aggressive" | "Balanced" | "Safe";
    offer: number;
    acceptanceProbability: number;
    note: string;
  }>;
};

export type ExplanationResult = {
  executiveSummary: string;
  whyThisDecision: string[];
  riskSummary: string[];
  negotiationAdvice: string[];
  nextBestAction: string;
  confidenceExplanation: string;
};

function fallbackExplanation(input: ExplanationInput): ExplanationResult {
  const balancedOffer = input.offers.find((offer) => offer.name === "Balanced") || input.offers[0];

  return {
    executiveSummary:
      input.summary ||
      `Nestrova recommends ${input.recommendation} for ${input.address} with ${input.confidence}% confidence.`,
    whyThisDecision: input.reasons?.length
      ? input.reasons
      : [
          `Investment score is ${input.scores.investmentScore}/100.`,
          `Fair value score is ${input.scores.fairValueScore}/100.`,
          `Rental score is ${input.scores.rentalScore}/100.`,
        ],
    riskSummary: input.risks?.map((risk) => `${risk.label}: ${risk.reason}`) || [
      "No major risk items were detected from the current assumptions.",
    ],
    negotiationAdvice: balancedOffer
      ? [
          `Use the ${balancedOffer.name.toLowerCase()} offer strategy around $${Math.round(
            balancedOffer.offer
          ).toLocaleString()}.`,
          `${balancedOffer.acceptanceProbability.toFixed(1)}% estimated acceptance probability.`,
          balancedOffer.note,
        ]
      : ["Generate offer strategies before negotiating."],
    nextBestAction:
      input.recommendation === "BUY"
        ? "Generate Offer"
        : input.recommendation === "HOLD"
        ? "Compare Alternatives"
        : "Skip and Monitor",
    confidenceExplanation: `Confidence is ${input.confidence}% based on valuation, rental strength, risk profile, and negotiation leverage.`,
  };
}

function buildPrompt(input: ExplanationInput) {
  return `
You are Nestrova Brain, an AI real estate investment decision assistant.

Create a concise, professional explanation for the following property decision.

Property: ${input.address}
Recommendation: ${input.recommendation}
Confidence: ${input.confidence}%
Summary: ${input.summary}

Scores:
${JSON.stringify(input.scores, null, 2)}

Reasons:
${input.reasons.map((reason) => `- ${reason}`).join("\n")}

Risks:
${input.risks.map((risk) => `- ${risk.label} (${risk.level}): ${risk.reason}`).join("\n")}

Offers:
${input.offers
  .map(
    (offer) =>
      `- ${offer.name}: $${Math.round(offer.offer).toLocaleString()} (${offer.acceptanceProbability}% acceptance) — ${offer.note}`
  )
  .join("\n")}

Return ONLY valid JSON with this exact shape:
{
  "executiveSummary": "string",
  "whyThisDecision": ["string"],
  "riskSummary": ["string"],
  "negotiationAdvice": ["string"],
  "nextBestAction": "string",
  "confidenceExplanation": "string"
}
`;
}

export async function generateExplanation(input: ExplanationInput): Promise<ExplanationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackExplanation(input);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are Nestrova Brain. Be concise, practical, and investment-focused. Return valid JSON only.",
          },
          {
            role: "user",
            content: buildPrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackExplanation(input);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackExplanation(input);
    }

    const parsed = JSON.parse(content) as ExplanationResult;
    const fallback = fallbackExplanation(input);

    return {
      executiveSummary: parsed.executiveSummary || fallback.executiveSummary,
      whyThisDecision: parsed.whyThisDecision || fallback.whyThisDecision,
      riskSummary: parsed.riskSummary || fallback.riskSummary,
      negotiationAdvice: parsed.negotiationAdvice || fallback.negotiationAdvice,
      nextBestAction: parsed.nextBestAction || fallback.nextBestAction,
      confidenceExplanation: parsed.confidenceExplanation || fallback.confidenceExplanation,
    };
  } catch {
    return fallbackExplanation(input);
  }
}
