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

import {
  normalizePublicOpportunities,
  type PublicOpportunity,
} from "@/lib/research/publicResearch";

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY;

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrova.com";

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

    risk:
      item.risk ??
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

    const usage =
      await consumeResearchUsage(
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

    const gatewayResponse =
      await fetch(
        `${API_BASE_URL}/api/v1/core/state`,
        {
          cache:
            "no-store",
        },
      );

    if (!gatewayResponse.ok) {
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
      (await gatewayResponse.json()) as PublicState;

    const opportunities = [
      ...normalizePublicOpportunities(
        state.top_opportunities,
      ),
      ...normalizePublicOpportunities(
        state.opportunities,
      ),
    ];

    const itemA =
      opportunities.find(
        (item) =>
          symbolOf(
            item.symbol,
          ) === symbolA,
      );

    const itemB =
      opportunities.find(
        (item) =>
          symbolOf(
            item.symbol,
          ) === symbolB,
      );

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

    const maxConfidence =
      Math.max(
        evidenceA.confidence,
        evidenceB.confidence,
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
- Confidence must not exceed ${maxConfidence}.

Return ONLY valid JSON:

{
  "winner": "ASSET_A",
  "comparison_confidence": 0,

  "summary": "string",

  "categories": {
    "research_confidence": {
      "winner": "ASSET_A",
      "reason": "string"
    },
    "evidence_strength": {
      "winner": "TIE",
      "reason": "string"
    },
    "risk_profile": {
      "winner": "ASSET_B",
      "reason": "string"
    },
    "research_signal": {
      "winner": "ASSET_A",
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

    const comparison =
      JSON.parse(
        extractJson(
          content,
        ),
      );

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
