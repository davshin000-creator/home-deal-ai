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

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function clamp(
  value: unknown,
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number),
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


type CouncilVote =
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH";

type SanitizedAgent = {
  vote: CouncilVote;
  confidence: number;
  reason: string;
};

function sanitizeVote(
  value: unknown,
): CouncilVote {
  const vote = String(value ?? "")
    .trim()
    .toUpperCase();

  if (
    vote === "BULLISH" ||
    vote === "BEARISH"
  ) {
    return vote;
  }

  return "NEUTRAL";
}

function sanitizeText(
  value: unknown,
  fallback = "Insufficient evidence.",
) {
  const text = String(value ?? "").trim();

  return text || fallback;
}

function sanitizeStringArray(
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

function sanitizeAgent(
  value: unknown,
  gatewayConfidence: number,
): SanitizedAgent {
  const object =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const reason =
    sanitizeText(object.reason);

  const insufficient =
    reason
      .toLowerCase()
      .includes("insufficient evidence");

  return {
    vote: insufficient
      ? "NEUTRAL"
      : sanitizeVote(object.vote),

    confidence: insufficient
      ? 0
      : Math.min(
          gatewayConfidence,
          clamp(object.confidence),
        ),

    reason,
  };
}

function sanitizeCouncil(
  value: unknown,
  gatewayConfidence: number,
) {
  const root =
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const rawAgents =
    root.agents &&
    typeof root.agents === "object" &&
    !Array.isArray(root.agents)
      ? (
          root.agents as Record<
            string,
            unknown
          >
        )
      : {};

  const agents = {
    growth: sanitizeAgent(
      rawAgents.growth,
      gatewayConfidence,
    ),

    value: sanitizeAgent(
      rawAgents.value,
      gatewayConfidence,
    ),

    momentum: sanitizeAgent(
      rawAgents.momentum,
      gatewayConfidence,
    ),

    risk: sanitizeAgent(
      rawAgents.risk,
      gatewayConfidence,
    ),

    macro: sanitizeAgent(
      rawAgents.macro,
      gatewayConfidence,
    ),
  };

  const agentValues =
    Object.values(agents);

  const bullishCount =
    agentValues.filter(
      (agent) =>
        agent.vote === "BULLISH",
    ).length;

  const neutralCount =
    agentValues.filter(
      (agent) =>
        agent.vote === "NEUTRAL",
    ).length;

  const bearishCount =
    agentValues.filter(
      (agent) =>
        agent.vote === "BEARISH",
    ).length;

  let consensusVote: CouncilVote =
    "NEUTRAL";

  if (
    bullishCount > bearishCount &&
    bullishCount > neutralCount
  ) {
    consensusVote = "BULLISH";
  } else if (
    bearishCount > bullishCount &&
    bearishCount > neutralCount
  ) {
    consensusVote = "BEARISH";
  }

  const winningCount =
    Math.max(
      bullishCount,
      neutralCount,
      bearishCount,
    );

  const agreementScore =
    Math.round(
      (winningCount / agentValues.length) *
        100,
    );

  const supportedAgents =
    agentValues.filter(
      (agent) =>
        agent.confidence > 0,
    );

  const averageConfidence =
    supportedAgents.length > 0
      ? Math.round(
          supportedAgents.reduce(
            (total, agent) =>
              total + agent.confidence,
            0,
          ) / supportedAgents.length,
        )
      : 0;

  const rawConsensus =
    root.consensus &&
    typeof root.consensus === "object" &&
    !Array.isArray(root.consensus)
      ? (
          root.consensus as Record<
            string,
            unknown
          >
        )
      : {};

  const rawStrength =
    String(
      root.evidence_strength ?? "",
    )
      .trim()
      .toUpperCase();

  const evidenceStrength =
    rawStrength === "HIGH" ||
    rawStrength === "MEDIUM" ||
    rawStrength === "LOW"
      ? rawStrength
      : supportedAgents.length >= 4
        ? "HIGH"
        : supportedAgents.length >= 2
          ? "MEDIUM"
          : "LOW";

  return {
    agents,

    consensus: {
      vote: consensusVote,

      agreement_score:
        agreementScore,

      confidence:
        Math.min(
          gatewayConfidence,
          averageConfidence,
        ),

      bullish_count:
        bullishCount,

      neutral_count:
        neutralCount,

      bearish_count:
        bearishCount,

      summary:
        sanitizeText(
          rawConsensus.summary,
        ),

      dissenting_view:
        sanitizeText(
          rawConsensus.dissenting_view,
        ),
    },

    evidence_strength:
      evidenceStrength,

    limitations:
      sanitizeStringArray(
        root.limitations,
      ),
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
            "Please sign in to use Research Council.",
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
            "Research Council requires Nestrova Pro.",
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
            "Research Council AI is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const body =
      await request.json();

    const symbol =
      normalizeSymbol(
        body?.symbol,
      );

    if (!symbol) {
      return NextResponse.json(
        {
          error:
            "Symbol is required.",
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

    const evidence =
      await resolvePublicResearchAsset(
        state,
        symbol,
      );

    if (!evidence) {
      return NextResponse.json({
        symbol,
        status:
          "INSUFFICIENT_EVIDENCE",
        message:
          "Nestrova does not currently have enough public research evidence for this symbol.",
      });
    }

    const usage =
      await checkResearchUsage(
        user.id,
        "council",
      );

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error:
            "Research Council monthly limit reached.",
          code:
            "RESEARCH_USAGE_LIMIT",
          feature:
            "council",
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


    const gatewayConfidence =
      clamp(
        evidence.confidence ??
          evidence.weighted_score ??
          evidence.score,
      );

    const context = {
      symbol:
        evidence.symbol ?? symbol,

      name:
        evidence.name ?? null,

      asset_type:
        evidence.asset_type ?? null,

      confidence:
        gatewayConfidence,

      risk:
        evidence.risk ?? null,

      research_style:
        evidence.research_style ?? null,

      research_version:
        evidence.research_version ?? null,

      research_reasons:
        evidence.research_reasons ?? [],

      market_regime:
        state.market?.regime ?? null,

      market_research_style:
        state.market?.research_style ?? null,

      generated_at:
        state.generated_at ?? null,
    };

    const prompt = `
Analyze the supplied Nestrova public research evidence from five independent research perspectives.

STRICT RULES:
- Use ONLY the supplied evidence.
- Do not use outside knowledge.
- Do not invent financials, prices, earnings, valuations, news, company facts, or macro statistics.
- If evidence does not support a perspective, state "Insufficient evidence."
- Confidence values must not exceed gateway confidence: ${gatewayConfidence}.
- Votes must be one of: BULLISH, NEUTRAL, BEARISH.
- The final consensus must represent the agents' actual votes and evidence strength.
- This is informational research, not personalized financial advice.

Return ONLY valid JSON:

{
  "agents": {
    "growth": {
      "vote": "BULLISH",
      "confidence": 0,
      "reason": "string"
    },
    "value": {
      "vote": "NEUTRAL",
      "confidence": 0,
      "reason": "string"
    },
    "momentum": {
      "vote": "BULLISH",
      "confidence": 0,
      "reason": "string"
    },
    "risk": {
      "vote": "BEARISH",
      "confidence": 0,
      "reason": "string"
    },
    "macro": {
      "vote": "NEUTRAL",
      "confidence": 0,
      "reason": "string"
    }
  },
  "consensus": {
    "vote": "NEUTRAL",
    "agreement_score": 0,
    "confidence": 0,
    "bullish_count": 0,
    "neutral_count": 0,
    "bearish_count": 0,
    "summary": "string",
    "dissenting_view": "string"
  },
  "evidence_strength": "LOW",
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
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${OPENAI_API_KEY}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
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
                  "You are the Nestrova Research Council. Each analyst must evaluate only the supplied public Nestrova evidence and must never fill missing evidence using general knowledge.",
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
        "research_council_openai_failed",
        aiResponse.status,
        await aiResponse
          .text()
          .catch(() => ""),
      );

      return NextResponse.json(
        {
          error:
            "Could not generate Research Council.",
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

    const parsed =
      JSON.parse(
        extractJson(content),
      );

    const council =
      sanitizeCouncil(
        parsed,
        gatewayConfidence,
      );

    const consumedUsage =
      await consumeResearchUsage(
        user.id,
        "council",
      );

    if (!consumedUsage.allowed) {
      return NextResponse.json(
        {
          error:
            "Research monthly limit reached.",
          code:
            "RESEARCH_USAGE_LIMIT",
          feature:
            "council",
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

      symbol,

      gateway_confidence:
        gatewayConfidence,

      evidence: context,

      council,
    });
  } catch (error) {
    console.error(
      "research_council_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not generate Research Council.",
      },
      {
        status: 500,
      },
    );
  }
}
