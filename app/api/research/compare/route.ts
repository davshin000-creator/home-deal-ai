import { NextResponse } from "next/server";
import {
  loadResearchPublicState,
} from "@/lib/research/public-gateway";
import { resolvePublicResearchAsset } from "@/lib/research/resolvePublicResearchAsset";


import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  checkResearchUsage,
  consumeResearchUsage,
} from "@/lib/research/usage";

import {
  normalizePublicOpportunities,
  type PublicOpportunity,
} from "@/lib/research/publicResearch";

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY;

type PublicState = {
  generated_at?: string;

  top_opportunities?: unknown;
  opportunities?: unknown;

  market?: {
    regime?: string;
    research_style?: string;
  };
};

function symbolOf(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function safeConfidence(
  item: PublicOpportunity,
) {
  const value =
    Number(
      item.confidence ??
        item.weighted_score ??
        item.score ??
        0,
    );

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value),
    ),
  );
}

function extractJson(
  content: string,
) {
  const trimmed =
    content.trim();

  if (
    trimmed.startsWith("{") &&
    trimmed.endsWith("}")
  ) {
    return trimmed;
  }

  const fenced =
    trimmed.match(
      /```(?:json)?\s*([\s\S]*?)```/i,
    );

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start =
    trimmed.indexOf("{");

  const end =
    trimmed.lastIndexOf("}");

  if (
    start >= 0 &&
    end > start
  ) {
    return trimmed.slice(
      start,
      end + 1,
    );
  }

  throw new Error(
    "No JSON object found",
  );
}


type CompareWinner =
  | "ASSET_A"
  | "ASSET_B"
  | "TIE";

function sanitizeWinner(
  value: unknown,
): CompareWinner {
  const winner =
    String(value ?? "")
      .trim()
      .toUpperCase();

  if (
    winner === "ASSET_A" ||
    winner === "ASSET_B"
  ) {
    return winner;
  }

  return "TIE";
}

function sanitizeCompareText(
  value: unknown,
  fallback = "Insufficient evidence.",
) {
  const text =
    String(value ?? "").trim();

  return text || fallback;
}

function sanitizeLimitations(
  value: unknown,
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) =>
      String(item ?? "").trim(),
    )
    .filter(Boolean)
    .slice(0, 10);
}

function compareNumbers(
  first: unknown,
  second: unknown,
): CompareWinner {
  const a = Number(first);
  const b = Number(second);

  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {
    return "TIE";
  }

  if (a > b) {
    return "ASSET_A";
  }

  if (b > a) {
    return "ASSET_B";
  }

  return "TIE";
}

function riskRank(
  value: unknown,
) {
  const risk = String(value ?? "")
    .trim()
    .toUpperCase();

  if (risk === "LOW") {
    return 1;
  }

  if (risk === "MEDIUM") {
    return 2;
  }

  if (risk === "HIGH") {
    return 3;
  }

  if (risk === "CRITICAL") {
    return 4;
  }

  return null;
}

function compareRisk(
  first: unknown,
  second: unknown,
): CompareWinner {
  const a = riskRank(first);
  const b = riskRank(second);

  if (a === null || b === null) {
    return "TIE";
  }

  if (a < b) {
    return "ASSET_A";
  }

  if (b < a) {
    return "ASSET_B";
  }

  return "TIE";
}

function evidenceCount(
  value: unknown,
) {
  if (!Array.isArray(value)) {
    return 0;
  }

  return value.filter(
    (item) =>
      typeof item === "string" &&
      item.trim().length > 0,
  ).length;
}

function buildDeterministicWinners(
  evidenceA: {
    confidence?: unknown;
    opportunity_score?: unknown;
    risk?: unknown;
    reasons?: unknown;
  },
  evidenceB: {
    confidence?: unknown;
    opportunity_score?: unknown;
    risk?: unknown;
    reasons?: unknown;
  },
) {
  return {
    research_confidence:
      compareNumbers(
        evidenceA.confidence,
        evidenceB.confidence,
      ),

    evidence_strength:
      compareNumbers(
        evidenceCount(
          evidenceA.reasons,
        ),
        evidenceCount(
          evidenceB.reasons,
        ),
      ),

    risk_profile:
      compareRisk(
        evidenceA.risk,
        evidenceB.risk,
      ),

    research_signal:
      compareNumbers(
        evidenceA.opportunity_score,
        evidenceB.opportunity_score,
      ),
  };
}

function sanitizeComparisonCategory(
  value: unknown,
) {
  const category =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (
          value as Record<
            string,
            unknown
          >
        )
      : {};

  const reason =
    sanitizeCompareText(
      category.reason,
    );

  const insufficient =
    reason
      .toLowerCase()
      .includes(
        "insufficient evidence",
      );

  return {
    winner:
      insufficient
        ? ("TIE" as const)
        : sanitizeWinner(
            category.winner,
          ),

    reason,
  };
}

function sanitizeComparison(
  value: unknown,
  confidenceCeiling: number,
  deterministicWinners: {
    research_confidence: CompareWinner;
    evidence_strength: CompareWinner;
    risk_profile: CompareWinner;
    research_signal: CompareWinner;
  },
  evidenceA: {
    symbol?: string | null;
    confidence?: number | null;
    opportunity_score?: number | null;
    risk?: string | null;
    reasons?: string[];
  },
  evidenceB: {
    symbol?: string | null;
    confidence?: number | null;
    opportunity_score?: number | null;
    risk?: string | null;
    reasons?: string[];
  },
) {
  const root =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (
          value as Record<
            string,
            unknown
          >
        )
      : {};

  const symbolA =
    String(
      evidenceA.symbol ??
        "Asset A",
    );

  const symbolB =
    String(
      evidenceB.symbol ??
        "Asset B",
    );

  const confidenceA =
    Number(
      evidenceA.confidence ??
        0,
    );

  const confidenceB =
    Number(
      evidenceB.confidence ??
        0,
    );

  const scoreA =
    Number(
      evidenceA.opportunity_score ??
        0,
    );

  const scoreB =
    Number(
      evidenceB.opportunity_score ??
        0,
    );

  const evidenceCountA =
    evidenceCount(
      evidenceA.reasons,
    );

  const evidenceCountB =
    evidenceCount(
      evidenceB.reasons,
    );

  const riskA =
    String(
      evidenceA.risk ??
        "Unknown",
    );

  const riskB =
    String(
      evidenceB.risk ??
        "Unknown",
    );

  function categoryReason(
    category:
      | "research_confidence"
      | "evidence_strength"
      | "risk_profile"
      | "research_signal",
    winner: CompareWinner,
  ) {
    if (
      category ===
      "research_confidence"
    ) {
      if (winner === "TIE") {
        return `Both assets have the same research confidence of ${confidenceA}%.`;
      }

      const winnerSymbol =
        winner === "ASSET_A"
          ? symbolA
          : symbolB;

      const winnerValue =
        winner === "ASSET_A"
          ? confidenceA
          : confidenceB;

      const otherValue =
        winner === "ASSET_A"
          ? confidenceB
          : confidenceA;

      return `${winnerSymbol} has higher research confidence (${winnerValue}% vs ${otherValue}%).`;
    }

    if (
      category ===
      "evidence_strength"
    ) {
      if (winner === "TIE") {
        return `Both assets have ${evidenceCountA} supporting public research signals.`;
      }

      const winnerSymbol =
        winner === "ASSET_A"
          ? symbolA
          : symbolB;

      const winnerValue =
        winner === "ASSET_A"
          ? evidenceCountA
          : evidenceCountB;

      const otherValue =
        winner === "ASSET_A"
          ? evidenceCountB
          : evidenceCountA;

      return `${winnerSymbol} has more supporting public research signals (${winnerValue} vs ${otherValue}).`;
    }

    if (
      category ===
      "risk_profile"
    ) {
      if (winner === "TIE") {
        return `Both assets have the same ${riskA.toLowerCase()} risk profile.`;
      }

      const winnerSymbol =
        winner === "ASSET_A"
          ? symbolA
          : symbolB;

      const winnerRisk =
        winner === "ASSET_A"
          ? riskA
          : riskB;

      const otherRisk =
        winner === "ASSET_A"
          ? riskB
          : riskA;

      return `${winnerSymbol} has the more favorable risk profile (${winnerRisk} vs ${otherRisk}).`;
    }

    if (winner === "TIE") {
      return `Both assets have the same Nestrova opportunity score of ${scoreA}.`;
    }

    const winnerSymbol =
      winner === "ASSET_A"
        ? symbolA
        : symbolB;

    const winnerScore =
      winner === "ASSET_A"
        ? scoreA
        : scoreB;

    const otherScore =
      winner === "ASSET_A"
        ? scoreB
        : scoreA;

    return `${winnerSymbol} has the stronger research signal based on Nestrova opportunity score (${winnerScore} vs ${otherScore}).`;
  }

  const categories = {
    research_confidence: {
      winner:
        deterministicWinners
          .research_confidence,

      reason:
        categoryReason(
          "research_confidence",
          deterministicWinners
            .research_confidence,
        ),
    },

    evidence_strength: {
      winner:
        deterministicWinners
          .evidence_strength,

      reason:
        categoryReason(
          "evidence_strength",
          deterministicWinners
            .evidence_strength,
        ),
    },

    risk_profile: {
      winner:
        deterministicWinners
          .risk_profile,

      reason:
        categoryReason(
          "risk_profile",
          deterministicWinners
            .risk_profile,
        ),
    },

    research_signal: {
      winner:
        deterministicWinners
          .research_signal,

      reason:
        categoryReason(
          "research_signal",
          deterministicWinners
            .research_signal,
        ),
    },
  };

  const winnerVotes =
    Object.values(
      deterministicWinners,
    );

  const assetAWins =
    winnerVotes.filter(
      (winner) =>
        winner === "ASSET_A",
    ).length;

  const assetBWins =
    winnerVotes.filter(
      (winner) =>
        winner === "ASSET_B",
    ).length;

  const tieCount =
    winnerVotes.filter(
      (winner) =>
        winner === "TIE",
    ).length;

  const deterministicOverallWinner:
    CompareWinner =
      assetAWins > assetBWins
        ? "ASSET_A"
        : assetBWins > assetAWins
          ? "ASSET_B"
          : "TIE";

  const winningCount =
    Math.max(
      assetAWins,
      assetBWins,
    );

  const comparisonConfidence =
    deterministicOverallWinner ===
    "TIE"
      ? Math.round(
          confidenceCeiling *
            (tieCount / 4),
        )
      : Math.round(
          confidenceCeiling *
            Math.max(
              0.25,
              winningCount / 4,
            ),
        );

  const safeComparisonConfidence =
    Math.max(
      0,
      Math.min(
        confidenceCeiling,
        comparisonConfidence,
      ),
    );

  const winnerSymbol =
    deterministicOverallWinner ===
    "ASSET_A"
      ? symbolA
      : deterministicOverallWinner ===
          "ASSET_B"
        ? symbolB
        : null;

  const nonTieDifferences: string[] =
    [];

  if (
    deterministicWinners
      .research_confidence !== "TIE"
  ) {
    nonTieDifferences.push(
      categoryReason(
        "research_confidence",
        deterministicWinners
          .research_confidence,
      ),
    );
  }

  if (
    deterministicWinners
      .evidence_strength !== "TIE"
  ) {
    nonTieDifferences.push(
      categoryReason(
        "evidence_strength",
        deterministicWinners
          .evidence_strength,
      ),
    );
  }

  if (
    deterministicWinners
      .risk_profile !== "TIE"
  ) {
    nonTieDifferences.push(
      categoryReason(
        "risk_profile",
        deterministicWinners
          .risk_profile,
      ),
    );
  }

  if (
    deterministicWinners
      .research_signal !== "TIE"
  ) {
    nonTieDifferences.push(
      categoryReason(
        "research_signal",
        deterministicWinners
          .research_signal,
      ),
    );
  }

  const summary =
    deterministicOverallWinner ===
    "TIE"
      ? `${symbolA} and ${symbolB} are broadly tied across the available Nestrova public research evidence.`
      : `${winnerSymbol} holds a slight comparative research advantage based on the currently available Nestrova evidence.`;

  const keyDifference =
    nonTieDifferences.length > 0
      ? nonTieDifferences.join(" ")
      : "No material difference was identified across the available comparison categories.";

  const finalView =
    deterministicOverallWinner ===
    "TIE"
      ? `${symbolA} and ${symbolB} currently appear broadly comparable based on the available public research evidence.`
      : `${winnerSymbol} ranks slightly stronger in this comparison. The advantage is limited to the public evidence currently available and should not be interpreted as a guaranteed outcome.`;

  function cleanAiText(
    value: unknown,
  ) {
    return sanitizeCompareText(
      value,
    )
      .replaceAll(
        "ASSET_A",
        symbolA,
      )
      .replaceAll(
        "ASSET_B",
        symbolB,
      );
  }

  return {
    winner:
      deterministicOverallWinner,

    comparison_confidence:
      safeComparisonConfidence,

    summary,

    categories,

    asset_a_case:
      cleanAiText(
        root.asset_a_case,
      ),

    asset_b_case:
      cleanAiText(
        root.asset_b_case,
      ),

    key_difference:
      keyDifference,

    final_view:
      finalView,

    limitations:
      sanitizeLimitations(
        root.limitations,
      ),
  };
}

function buildEvidence(
  item: PublicOpportunity,
  fallbackSymbol: string,
) {
  return {
    symbol:
      item.symbol ??
      fallbackSymbol,

    name:
      item.name ??
      null,

    asset_type:
      item.asset_type ??
      null,

    confidence:
      safeConfidence(item),

    opportunity_score:
      item.opportunity_score ??
      null,

    risk:
      item.risk ??
      null,

    regime:
      item.regime ??
      null,

    status:
      item.status ??
      null,

    research_style:
      item.research_style ??
      null,

    research_version:
      item.research_version ??
      null,

    reasons:
      item.research_reasons ??
      [],
  };
}

export async function POST(
  request: Request,
) {
  try {
    const {
      user,
      profile,
    } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to use Research Compare.",
        },
        {
          status: 401,
        },
      );
    }

    if (!hasResearchAccess(profile)) {
      return NextResponse.json(
        {
          error:
            "Research Compare requires Nestrova Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Research Compare AI is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const body =
      await request.json();

    const symbolA =
      symbolOf(
        body?.symbol_a,
      );

    const symbolB =
      symbolOf(
        body?.symbol_b,
      );

    if (
      !symbolA ||
      !symbolB
    ) {
      return NextResponse.json(
        {
          error:
            "Two symbols are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      symbolA === symbolB
    ) {
      return NextResponse.json(
        {
          error:
            "Choose two different symbols.",
        },
        {
          status: 400,
        },
      );
    }

    const state =
      await loadResearchPublicState();

    if (!state) {
      return NextResponse.json(
        {
          error:
            "Research intelligence is temporarily unavailable.",
        },
        {
          status: 502,
        },
      );
    }

    const [
      itemA,
      itemB,
    ] = await Promise.all([
      resolvePublicResearchAsset(
        state,
        symbolA,
      ),
      resolvePublicResearchAsset(
        state,
        symbolB,
      ),
    ]);

    const missing: string[] = [];

    if (!itemA) {
      missing.push(symbolA);
    }

    if (!itemB) {
      missing.push(symbolB);
    }

    if (
      !itemA ||
      !itemB
    ) {
      return NextResponse.json({
        status:
          "INSUFFICIENT_EVIDENCE",

        message:
          `Nestrova does not currently have enough public research evidence for: ${missing.join(
            ", ",
          )}.`,

        missing_symbols:
          missing,
      });
    }

    const usage =
      await checkResearchUsage(
        user.id,
        "compare",
      );

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error:
            "Research Compare monthly limit reached.",
          code:
            "RESEARCH_USAGE_LIMIT",
          feature:
            "compare",
          used:
            usage.used,
          limit:
            usage.limit,
          remaining:
            usage.remaining,
        },
        {
          status: 429,
        },
      );
    }


    const evidenceA =
      buildEvidence(
        itemA,
        symbolA,
      );

    const evidenceB =
      buildEvidence(
        itemB,
        symbolB,
      );

    const comparisonConfidenceCeiling =
      Math.min(
        evidenceA.confidence,
        evidenceB.confidence,
      );

    const deterministicWinners =
      buildDeterministicWinners(
        evidenceA,
        evidenceB,
      );

    const context = {
      market_regime:
        state.market?.regime ??
        null,

      generated_at:
        state.generated_at ??
        null,

      asset_a:
        evidenceA,

      asset_b:
        evidenceB,
    };

    const prompt = `
Compare two Nestrova research subjects using ONLY the public evidence supplied below.

STRICT RULES:
- Do not use outside knowledge.
- Do not infer company fundamentals merely from ticker recognition.
- Do not invent price, valuation, earnings, revenue, news, growth, macro or competitive facts.
- Every conclusion must be supported by supplied evidence.
- If a category is unsupported, write "Insufficient evidence."
- Never give personalized financial advice.
- Winner may be ASSET_A, ASSET_B, or TIE.
- Comparison confidence must not exceed ${comparisonConfidenceCeiling}.

Return ONLY valid JSON:

{
  "winner": "TIE",
  "comparison_confidence": 0,

  "summary": "string",

  "categories": {
    "research_confidence": {
      "winner": "TIE",
      "reason": "string"
    },
    "evidence_strength": {
      "winner": "TIE",
      "reason": "string"
    },
    "risk_profile": {
      "winner": "TIE",
      "reason": "string"
    },
    "research_signal": {
      "winner": "TIE",
      "reason": "string"
    }
  },

  "asset_a_case": "string",
  "asset_b_case": "string",

  "key_difference": "string",

  "final_view": "string",

  "limitations": ["string"]
}

NESTROVA PUBLIC EVIDENCE:
${JSON.stringify(
  context,
  null,
  2,
)}
`.trim();

    const aiResponse =
      await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method:
            "POST",

          headers: {
            Authorization:
              `Bearer ${OPENAI_API_KEY}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              model:
                "gpt-4o-mini",

              temperature:
                0.1,

              response_format: {
                type:
                  "json_object",
              },

              messages: [
                {
                  role:
                    "system",

                  content:
                    "You are Nestrova Research Compare. Compare only explicitly supplied public Nestrova evidence. Never fill missing evidence using general knowledge.",
                },
                {
                  role:
                    "user",

                  content:
                    prompt,
                },
              ],
            }),
        },
      );

    if (!aiResponse.ok) {
      console.error(
        "research_compare_openai_failed",
        aiResponse.status,
        await aiResponse
          .text()
          .catch(
            () => "",
          ),
      );

      return NextResponse.json(
        {
          error:
            "Could not generate Research Compare.",
        },
        {
          status: 502,
        },
      );
    }

    const aiData =
      await aiResponse.json();

    const content =
      String(
        aiData.choices?.[0]
          ?.message?.content ??
          "",
      );

    const parsedComparison =
      JSON.parse(
        extractJson(
          content,
        ),
      );

    const comparison =
      sanitizeComparison(
        parsedComparison,
        comparisonConfidenceCeiling,
        deterministicWinners,
        evidenceA,
        evidenceB,
      );

    const consumedUsage =
      await consumeResearchUsage(
        user.id,
        "compare",
      );

    if (!consumedUsage.allowed) {
      return NextResponse.json(
        {
          error:
            "Research monthly limit reached.",
          code:
            "RESEARCH_USAGE_LIMIT",
          feature:
            "compare",
          used:
            consumedUsage.used,
          limit:
            consumedUsage.limit,
          remaining:
            consumedUsage.remaining,
        },
        {
          status: 429,
        },
      );
    }

    return NextResponse.json({
      ok: true,

      status:
        "COMPLETE",

      symbol_a:
        symbolA,

      symbol_b:
        symbolB,

      generated_at:
        state.generated_at ??
        null,

      market_regime:
        state.market?.regime ??
        null,

      evidence: {
        asset_a:
          evidenceA,

        asset_b:
          evidenceB,
      },

      comparison,
    });
  } catch (error) {
    console.error(
      "research_compare_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not generate Research Compare.",
      },
      {
        status: 500,
      },
    );
  }
}

