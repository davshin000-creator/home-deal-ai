import { NextResponse } from "next/server";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  consumeResearchUsage,
} from "@/lib/research/usage";

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY;

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrova.com";

type PublicOpportunity = {
  symbol?: string;
  name?: string;
  asset_type?: string;
  score?: number;
  weighted_score?: number;
  confidence?: number;
  risk?: string;
  status?: string;
  research_style?: string;
  research_version?: string;
  research_reasons?: string[];
};

type PublicState = {
  schema_version?: string;
  generated_at?: string;

  opportunities?: PublicOpportunity[];
  top_opportunities?: PublicOpportunity[];

  market?: {
    regime?: string;
    research_style?: string;
  };
};

type DeepResearchReport = {
  executive_thesis: string;

  research_confidence: number;

  dimensions: {
    growth: {
      assessment: string;
      confidence: number;
    };

    valuation: {
      assessment: string;
      confidence: number;
    };

    momentum: {
      assessment: string;
      confidence: number;
    };

    risk: {
      assessment: string;
      confidence: number;
    };

    macro: {
      assessment: string;
      confidence: number;
    };

    competitive_position: {
      assessment: string;
      confidence: number;
    };
  };

  bull_case: string;

  bear_case: string;

  key_catalysts: string[];

  key_risks: string[];

  evidence_used: string[];

  final_view: string;

  limitations: string[];
};

function normalizeOpportunityList(
  value: unknown,
): PublicOpportunity[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const objectValue =
      value as Record<string, unknown>;

    for (const key of [
      "items",
      "candidates",
      "opportunities",
      "stocks",
      "crypto",
      "data",
    ]) {
      const nested =
        objectValue[key];

      if (Array.isArray(nested)) {
        return nested as PublicOpportunity[];
      }
    }

    return Object.values(
      objectValue,
    ).filter(
      (item): item is PublicOpportunity =>
        Boolean(
          item &&
          typeof item === "object",
        ),
    );
  }

  return [];
}

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

function clampConfidence(
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

  const firstBrace =
    trimmed.indexOf("{");

  const lastBrace =
    trimmed.lastIndexOf("}");

  if (
    firstBrace >= 0 &&
    lastBrace > firstBrace
  ) {
    return trimmed.slice(
      firstBrace,
      lastBrace + 1,
    );
  }

  throw new Error(
    "No JSON object found in AI response",
  );
}

function sanitizeReport(
  raw: any,
  gatewayConfidence: number,
): DeepResearchReport {
  const dimensions =
    raw?.dimensions ?? {};

  function dimension(
    key: string,
  ) {
    return {
      assessment:
        String(
          dimensions?.[key]
            ?.assessment ??
            "Insufficient evidence.",
        ),

      confidence:
        clampConfidence(
          dimensions?.[key]
            ?.confidence,
        ),
    };
  }

  return {
    executive_thesis:
      String(
        raw?.executive_thesis ??
          "Insufficient evidence for a complete research thesis.",
      ),

    research_confidence:
      Math.min(
        clampConfidence(
          raw?.research_confidence,
        ),
        gatewayConfidence,
      ),

    dimensions: {
      growth:
        dimension("growth"),

      valuation:
        dimension("valuation"),

      momentum:
        dimension("momentum"),

      risk:
        dimension("risk"),

      macro:
        dimension("macro"),

      competitive_position:
        dimension(
          "competitive_position",
        ),
    },

    bull_case:
      String(
        raw?.bull_case ??
          "Insufficient evidence.",
      ),

    bear_case:
      String(
        raw?.bear_case ??
          "Insufficient evidence.",
      ),

    key_catalysts:
      Array.isArray(
        raw?.key_catalysts,
      )
        ? raw.key_catalysts
            .map(String)
            .slice(0, 6)
        : [],

    key_risks:
      Array.isArray(
        raw?.key_risks,
      )
        ? raw.key_risks
            .map(String)
            .slice(0, 6)
        : [],

    evidence_used:
      Array.isArray(
        raw?.evidence_used,
      )
        ? raw.evidence_used
            .map(String)
            .slice(0, 10)
        : [],

    final_view:
      String(
        raw?.final_view ??
          "Insufficient evidence.",
      ),

    limitations:
      Array.isArray(
        raw?.limitations,
      )
        ? raw.limitations
            .map(String)
            .slice(0, 6)
        : [
            "This report uses only the public Nestrova research evidence supplied to the model.",
          ],
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
            "Please sign in to use Deep Research.",
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
            "Deep Research requires Nestrova Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    const usage =
      await consumeResearchUsage(
        user.id,
        "deep",
      );

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error:
            "Deep Research monthly limit reached.",
          code:
            "RESEARCH_USAGE_LIMIT",
          feature:
            "deep",
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

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Deep Research AI is not configured.",
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

    const stateResponse =
      await fetch(
        `${API_BASE_URL}/api/v1/core/state`,
        {
          cache: "no-store",
        },
      );

    if (!stateResponse.ok) {
      console.error(
        "research_gateway_failed",
        stateResponse.status,
      );

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

    const state =
      (await stateResponse.json()) as PublicState;

    const opportunities = [
      ...normalizeOpportunityList(
        state.top_opportunities,
      ),
      ...normalizeOpportunityList(
        state.opportunities,
      ),
    ];

    const evidence =
      opportunities.find(
        (item) =>
          normalizeSymbol(
            item.symbol,
          ) === symbol,
      );

    if (!evidence) {
      return NextResponse.json({
        symbol,

        status:
          "INSUFFICIENT_EVIDENCE",

        message:
          "Nestrova does not currently have enough public research evidence for this symbol.",

        generated_at:
          state.generated_at ??
          null,

        market_regime:
          state.market?.regime ??
          null,
      });
    }

    const gatewayConfidence =
      clampConfidence(
        evidence.confidence ??
          evidence.weighted_score ??
          evidence.score ??
          0,
      );

    const researchEvidence = {
      symbol:
        evidence.symbol ??
        symbol,

      name:
        evidence.name ??
        null,

      asset_type:
        evidence.asset_type ??
        null,

      score:
        evidence.score ??
        null,

      weighted_score:
        evidence.weighted_score ??
        null,

      confidence:
        gatewayConfidence,

      risk:
        evidence.risk ??
        null,

      status:
        evidence.status ??
        null,

      research_style:
        evidence.research_style ??
        null,

      research_version:
        evidence.research_version ??
        null,

      research_reasons:
        evidence.research_reasons ??
        [],

      market_regime:
        state.market?.regime ??
        null,

      market_research_style:
        state.market
          ?.research_style ??
        null,

      generated_at:
        state.generated_at ??
        null,
    };

    const prompt = `
Create a structured Nestrova Deep Research report using ONLY the evidence below.

STRICT RULES:
- Do not use outside knowledge.
- Do not invent prices, earnings, revenue, valuation multiples, news, catalysts, company fundamentals, macro statistics, or competitive facts.
- Do not infer a fact merely because you recognize the ticker.
- If the supplied evidence does not support a section, write "Insufficient evidence."
- Research confidence must NEVER exceed the supplied gateway confidence of ${gatewayConfidence}.
- Each dimension confidence must reflect only the evidence available for that dimension.
- Bull and bear cases must both be grounded in supplied evidence.
- Evidence Used must quote or closely paraphrase only supplied research_reasons.
- The report is informational research, not personalized financial advice.

Return ONLY valid JSON matching exactly this shape:

{
  "executive_thesis": "string",
  "research_confidence": 0,
  "dimensions": {
    "growth": {
      "assessment": "string",
      "confidence": 0
    },
    "valuation": {
      "assessment": "string",
      "confidence": 0
    },
    "momentum": {
      "assessment": "string",
      "confidence": 0
    },
    "risk": {
      "assessment": "string",
      "confidence": 0
    },
    "macro": {
      "assessment": "string",
      "confidence": 0
    },
    "competitive_position": {
      "assessment": "string",
      "confidence": 0
    }
  },
  "bull_case": "string",
  "bear_case": "string",
  "key_catalysts": ["string"],
  "key_risks": ["string"],
  "evidence_used": ["string"],
  "final_view": "string",
  "limitations": ["string"]
}

PUBLIC NESTROVA EVIDENCE:
${JSON.stringify(
  researchEvidence,
  null,
  2,
)}
`.trim();

    const openAiResponse =
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
                0.15,

              response_format: {
                type:
                  "json_object",
              },

              messages: [
                {
                  role:
                    "system",

                  content:
                    "You are Nestrova Deep Research. Analyze only evidence explicitly provided by the Nestrova public research gateway. Never fill missing information with general model knowledge.",
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

    if (!openAiResponse.ok) {
      const errorText =
        await openAiResponse
          .text()
          .catch(() => "");

      console.error(
        "deep_research_openai_failed",
        openAiResponse.status,
        errorText,
      );

      return NextResponse.json(
        {
          error:
            "Could not generate Deep Research.",
        },
        {
          status: 502,
        },
      );
    }

    const aiData =
      await openAiResponse.json();

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

    const report =
      sanitizeReport(
        parsed,
        gatewayConfidence,
      );

    return NextResponse.json({
      ok: true,

      status:
        "COMPLETE",

      symbol,

      generated_at:
        state.generated_at ??
        null,

      market_regime:
        state.market?.regime ??
        null,

      source:
        "NESTROVA_PUBLIC_RESEARCH",

      gateway_confidence:
        gatewayConfidence,

      evidence: {
        symbol:
          researchEvidence.symbol,

        name:
          researchEvidence.name,

        asset_type:
          researchEvidence.asset_type,

        risk:
          researchEvidence.risk,

        research_style:
          researchEvidence.research_style,

        research_version:
          researchEvidence.research_version,

        reasons:
          researchEvidence.research_reasons,
      },

      report,
    });
  } catch (error) {
    console.error(
      "deep_research_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not generate Deep Research.",
      },
      {
        status: 500,
      },
    );
  }
}
