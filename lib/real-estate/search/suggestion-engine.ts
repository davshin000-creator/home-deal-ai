import type {
  SearchContext,
  SearchDealCandidate,
  SearchSuggestion,
  SuggestionType,
} from "./suggestion-types";

const MIN_DECISION_IMPROVEMENT = 8;
const MIN_SIMILARITY_SCORE = 70;
const MIN_CONFIDENCE_SCORE = 65;

function clamp(
  value: number,
  min = 0,
  max = 100,
) {
  return Math.max(
    min,
    Math.min(max, value),
  );
}

export function getDecisionScore(
  deal: SearchDealCandidate | null,
) {
  if (!deal) {
    return 0;
  }

  if (
    deal.overall_score !== undefined &&
    deal.overall_score !== null
  ) {
    return clamp(
      Number(deal.overall_score),
    );
  }

  const dealScore =
    Number(deal.deal_score || 0);

  const forecastScore =
    Number(deal.forecast_score || 50);

  const neighborhoodScore =
    Number(deal.neighborhood_score || 50);

  return clamp(
    Math.round(
      dealScore * 0.4 +
        forecastScore * 0.35 +
        neighborhoodScore * 0.25,
    ),
  );
}

function getConfidenceScore(
  deal: SearchDealCandidate | null,
) {
  if (!deal) {
    return 0;
  }

  const confidence =
    Number(deal.confidence_score);

  if (Number.isFinite(confidence)) {
    return clamp(confidence);
  }

  return 70;
}

function getSimilarityScore(
  originalSearch: SearchContext,
  alternativeSearch: SearchContext,
) {
  let score = 100;

  if (
    originalSearch.state !==
    alternativeSearch.state
  ) {
    score -= 35;
  }

  if (
    originalSearch.city.toLowerCase() !==
    alternativeSearch.city.toLowerCase()
  ) {
    score -= 15;
  }

  const originalBudget =
    Math.max(
      1,
      Number(originalSearch.maxPrice),
    );

  const budgetDifference =
    Math.abs(
      alternativeSearch.maxPrice -
        originalSearch.maxPrice,
    ) / originalBudget;

  score -= Math.min(
    30,
    budgetDifference * 100,
  );

  return clamp(Math.round(score));
}

function buildReasons(
  original: SearchDealCandidate,
  alternative: SearchDealCandidate,
) {
  const reasons: string[] = [];

  const priceDifference =
    original.listing_price -
    alternative.listing_price;

  const yieldImprovement =
    Number(
      alternative.gross_rent_yield || 0,
    ) -
    Number(
      original.gross_rent_yield || 0,
    );

  const cashFlowImprovement =
    Number(
      alternative.estimated_monthly_cash_flow ||
        0,
    ) -
    Number(
      original.estimated_monthly_cash_flow ||
        0,
    );

  const discountImprovement =
    Number(
      alternative.discount_percent || 0,
    ) -
    Number(
      original.discount_percent || 0,
    );

  if (priceDifference > 0) {
    reasons.push(
      `$${Math.round(
        priceDifference,
      ).toLocaleString()} lower purchase price`,
    );
  }

  if (yieldImprovement >= 0.25) {
    reasons.push(
      `${yieldImprovement.toFixed(
        2,
      )}% higher rental yield`,
    );
  }

  if (cashFlowImprovement >= 100) {
    reasons.push(
      `$${Math.round(
        cashFlowImprovement,
      ).toLocaleString()}/mo stronger cash flow`,
    );
  }

  if (discountImprovement >= 1) {
    reasons.push(
      `${discountImprovement.toFixed(
        1,
      )}% stronger value discount`,
    );
  }

  return reasons.slice(0, 3);
}


function normalizePropertyType(
  value?: string | null,
) {
  const normalized =
    String(value || "")
      .trim()
      .toLowerCase();

  if (
    normalized.includes("manufactured") ||
    normalized.includes("mobile")
  ) {
    return "manufactured";
  }

  if (
    normalized.includes("single") ||
    normalized.includes("detached")
  ) {
    return "single_family";
  }

  if (
    normalized.includes("condo")
  ) {
    return "condo";
  }

  if (
    normalized.includes("town")
  ) {
    return "townhouse";
  }

  if (
    normalized.includes("multi")
  ) {
    return "multifamily";
  }

  return normalized || "unknown";
}

function getCandidateComparability(
  original: SearchDealCandidate | null,
  alternative: SearchDealCandidate | null,
) {
  if (
    !original ||
    !alternative
  ) {
    return {
      comparable: false,
      score: 0,
    };
  }

  let score = 100;

  const originalType =
    normalizePropertyType(
      original.property_type,
    );

  const alternativeType =
    normalizePropertyType(
      alternative.property_type,
    );

  if (
    originalType !== "unknown" &&
    alternativeType !== "unknown" &&
    originalType !== alternativeType
  ) {
    score -= 45;
  }

  const originalPrice =
    Math.max(
      1,
      Number(original.listing_price || 0),
    );

  const alternativePrice =
    Math.max(
      1,
      Number(alternative.listing_price || 0),
    );

  const priceDifferenceRatio =
    Math.abs(
      alternativePrice -
        originalPrice,
    ) / originalPrice;

  score -= Math.min(
    30,
    priceDifferenceRatio * 40,
  );

  const originalBeds =
    Number(original.bedrooms);

  const alternativeBeds =
    Number(alternative.bedrooms);

  if (
    Number.isFinite(originalBeds) &&
    Number.isFinite(alternativeBeds)
  ) {
    score -=
      Math.min(
        15,
        Math.abs(
          alternativeBeds -
            originalBeds,
        ) * 5,
      );
  }

  const originalSqft =
    Number(original.square_footage);

  const alternativeSqft =
    Number(alternative.square_footage);

  if (
    originalSqft > 0 &&
    alternativeSqft > 0
  ) {
    const sqftDifferenceRatio =
      Math.abs(
        alternativeSqft -
          originalSqft,
      ) / originalSqft;

    score -= Math.min(
      20,
      sqftDifferenceRatio * 30,
    );
  }

  const finalScore =
    clamp(Math.round(score));

  return {
    comparable:
      finalScore >= 65,
    score:
      finalScore,
  };
}
export function selectBestComparableAlternative(
  originalCandidate: SearchDealCandidate | null,
  alternativeCandidates: SearchDealCandidate[],
): SearchDealCandidate | null {
  if (
    !originalCandidate ||
    alternativeCandidates.length === 0
  ) {
    return null;
  }

  const comparableCandidates =
    alternativeCandidates
      .map((candidate) => {
        const comparability =
          getCandidateComparability(
            originalCandidate,
            candidate,
          );

        return {
          candidate,
          comparability,
          decisionScore:
            getDecisionScore(candidate),
        };
      })
      .filter(
        (item) =>
          item.comparability.comparable,
      )
      .sort((a, b) => {
        if (
          b.decisionScore !==
          a.decisionScore
        ) {
          return (
            b.decisionScore -
            a.decisionScore
          );
        }

        return (
          b.comparability.score -
          a.comparability.score
        );
      });

  return (
    comparableCandidates[0]
      ?.candidate ?? null
  );
}
export function shouldWaitOnSearch(
  candidate: SearchDealCandidate | null,
) {
  if (!candidate) {
    return false;
  }

  const score =
    getDecisionScore(candidate);

  const confidence =
    getConfidenceScore(candidate);

  const listingPrice =
    Number(candidate.listing_price || 0);

  const fairValue =
    Number(candidate.fair_value || 0);

  const cashFlow =
    Number(
      candidate.estimated_monthly_cash_flow ||
        0,
    );

  const overpriced =
    fairValue > 0 &&
    listingPrice >
      fairValue * 1.03;

  const weakCashFlow =
    cashFlow < 0;

  const notCompelling =
    score < 85;

  return (
    confidence >= 65 &&
    notCompelling &&
    (
      overpriced ||
      weakCashFlow
    )
  );
}
function getSuggestionLabel({
  decisionImprovement,
  priceDifferencePercent,
  yieldImprovement,
  cashFlowImprovement,
}: {
  decisionImprovement: number;
  priceDifferencePercent: number;
  yieldImprovement: number;
  cashFlowImprovement: number;
}) {
  if (
    decisionImprovement >=
    MIN_DECISION_IMPROVEMENT
  ) {
    return "better_match" as const;
  }

  if (
    priceDifferencePercent >= 8 ||
    yieldImprovement >= 0.5 ||
    cashFlowImprovement >= 300
  ) {
    return "better_tradeoff" as const;
  }

  return "wait" as const;
}
export function evaluateSearchSuggestion({
  type,
  title,
  summary,
  originalSearch,
  originalCandidate,
  alternativeSearch,
  alternativeCandidate,
}: {
  type: SuggestionType;
  title: string;
  summary: string;
  originalSearch: SearchContext;
  originalCandidate: SearchDealCandidate | null;
  alternativeSearch: SearchContext;
  alternativeCandidate: SearchDealCandidate | null;
}): SearchSuggestion {
  const originalScore =
    getDecisionScore(originalCandidate);

  const alternativeScore =
    getDecisionScore(
      alternativeCandidate,
    );

  const decisionImprovement =
    alternativeScore - originalScore;

  const similarityScore =
    getSimilarityScore(
      originalSearch,
      alternativeSearch,
    );

  const comparability =
    getCandidateComparability(
      originalCandidate,
      alternativeCandidate,
    );

  const confidenceScore =
    getConfidenceScore(
      alternativeCandidate,
    );

  const priceDifference =
    originalCandidate &&
    alternativeCandidate
      ? Number(
          originalCandidate.listing_price ||
            0,
        ) -
        Number(
          alternativeCandidate.listing_price ||
            0,
        )
      : 0;

  const originalPrice =
    Math.max(
      1,
      Number(
        originalCandidate?.listing_price ||
          0,
      ),
    );

  const priceDifferencePercent =
    (priceDifference / originalPrice) *
    100;

  const yieldImprovement =
    Number(
      alternativeCandidate
        ?.gross_rent_yield || 0,
    ) -
    Number(
      originalCandidate
        ?.gross_rent_yield || 0,
    );

  const cashFlowImprovement =
    Number(
      alternativeCandidate
        ?.estimated_monthly_cash_flow || 0,
    ) -
    Number(
      originalCandidate
        ?.estimated_monthly_cash_flow || 0,
    );

  const discountImprovement =
    Number(
      alternativeCandidate
        ?.discount_percent || 0,
    ) -
    Number(
      originalCandidate
        ?.discount_percent || 0,
    );

  const reasons =
    originalCandidate &&
    alternativeCandidate
      ? buildReasons(
          originalCandidate,
          alternativeCandidate,
        )
      : [];

  const label =
    getSuggestionLabel({
      decisionImprovement,
      priceDifferencePercent,
      yieldImprovement,
      cashFlowImprovement,
    });

  const materiallyBetter =
    decisionImprovement >=
      MIN_DECISION_IMPROVEMENT ||
    cashFlowImprovement >= 500 ||
    (
      priceDifferencePercent >= 12 &&
      decisionImprovement >= 3
    );

  const recommended =
    Boolean(alternativeCandidate) &&
    comparability.comparable &&
    materiallyBetter &&
    similarityScore >=
      MIN_SIMILARITY_SCORE &&
    confidenceScore >=
      MIN_CONFIDENCE_SCORE;

  return {
    type,
    label,
    title,
    summary,

    original: {
      search: originalSearch,
      candidate: originalCandidate,
      score: originalScore,
    },

    alternative: {
      search: alternativeSearch,
      candidate: alternativeCandidate,
      score: alternativeScore,
    },

    evidence: {
      decisionImprovement,
      priceDifference,
      priceDifferencePercent,
      yieldImprovement,
      cashFlowImprovement,
      discountImprovement,
      similarityScore,
      comparabilityScore:
        comparability.score,
      confidenceScore,
    },

    reasons,

    recommended,
  };
}