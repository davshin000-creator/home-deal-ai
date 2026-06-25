import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function safeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error:
            "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userId = String(body.user_id || "");
    const question = String(body.question || "").trim();
    const property = body.property;

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
    }

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    if (!property || !property.address) {
      return NextResponse.json(
        { error: "Property analysis result is required." },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_pro")
      .eq("user_id", userId)
      .maybeSingle();

    const isPro = Boolean(profile?.is_pro);
    const dateKey = getDateKey();
    let dailyCount = 0;

    if (!isPro) {
      const { data: usage } = await supabase
        .from("ai_chat_usage")
        .select("question_count")
        .eq("user_id", userId)
        .eq("date_key", dateKey)
        .maybeSingle();

      dailyCount = Number(usage?.question_count || 0);

      if (dailyCount >= 3) {
        return NextResponse.json(
          {
            error:
              "You reached your free daily AI question limit. Upgrade to Pro for unlimited AI property chat.",
            daily_count: dailyCount,
          },
          { status: 403 }
        );
      }
    }

    const propertyContext = {
      address: property.address,
      listing_price: safeNumber(property.listing_price),
      fair_value: safeNumber(property.fair_value),
      estimated_monthly_rent: safeNumber(property.estimated_monthly_rent),
      gross_rent_yield: safeNumber(property.gross_rent_yield),
      deal_score: safeNumber(property.deal_score),
      status: property.status,
      estimated_monthly_cash_flow: safeNumber(
        property.estimated_monthly_cash_flow
      ),
      forecast_score: safeNumber(property.forecast_score, 50),
      forecast_outlook: property.forecast_outlook,
      forecast_reasons: property.forecast_reasons || [],
      neighborhood_score: safeNumber(property.neighborhood_score, 50),
      neighborhood_grade: property.neighborhood_grade,
      neighborhood_reasons: property.neighborhood_reasons || [],
      expected_appreciation: safeNumber(property.expected_appreciation),
      confidence_score: safeNumber(property.confidence_score, 50),
      summary: property.summary,
    };

    const systemPrompt = `
You are Nestrova AI, an AI real estate investment assistant.

You help users understand a property analysis using the structured property data provided.

Rules:
- Be clear, practical, and concise.
- Do not claim certainty.
- Do not give legal, tax, lending, or personalized financial advice.
- Always mention that the answer is informational only.
- When useful, organize the answer into: Recommendation, Strengths, Risks, What to verify next, Suggested next questions.
- Base the answer only on the provided property data.
- If the user asks whether to buy, answer with a balanced view such as Strong Buy / Watchlist / Avoid based on the data, not as financial advice.
`;

    const userPrompt = `
Property data:
${JSON.stringify(propertyContext, null, 2)}

User question:
${question}
`;

    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.4,
        }),
      }
    );

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      console.error("OpenAI API error:", errorText);

      return NextResponse.json(
        { error: "AI response failed. Please try again." },
        { status: 500 }
      );
    }

    const openAiData = await openAiResponse.json();
    const answer =
      openAiData.choices?.[0]?.message?.content ||
      "I could not generate an answer. Please try again.";

    if (!isPro) {
      dailyCount += 1;

      await supabase.from("ai_chat_usage").upsert(
        {
          user_id: userId,
          date_key: dateKey,
          question_count: dailyCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date_key" }
      );
    }

    await supabase.from("ai_chat_history").insert({
      user_id: userId,
      property_address: property.address,
      question,
      answer,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      answer,
      is_pro: isPro,
      daily_count: dailyCount,
    });
  } catch (error) {
    console.error("ask-ai error:", error);

    return NextResponse.json(
      { error: "Unexpected AI server error." },
      { status: 500 }
    );
  }
}
