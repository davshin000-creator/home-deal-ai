import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getCurrentUserProfile } from "@/lib/supabase/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function getDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
    }

    const { user, isPro } = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json({ error: "Please sign in to use Ask AI." }, { status: 401 });
    }

    const body = await request.json();
    const question = String(body.question || body.message || "").trim();
    const property = body.property || null;
    const pagePath = String(body.page_path || "");

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const dateKey = getDateKey();
    let dailyCount = 0;

    if (!isPro) {
      const { data: usage } = await supabase
        .from("ai_chat_usage")
        .select("question_count")
        .eq("user_id", user.id)
        .eq("date_key", dateKey)
        .maybeSingle();

      dailyCount = Number(usage?.question_count || 0);

      if (dailyCount >= 3) {
        return NextResponse.json(
          { error: "Free daily Ask AI limit reached. Upgrade to Pro for unlimited AI chat." },
          { status: 403 },
        );
      }
    }

    const systemPrompt = `
You are Nestrova AI, an AI real estate investment assistant.

Rules:
- Be clear, practical, and concise.
- Do not claim certainty.
- Do not give legal, tax, lending, or personalized financial advice.
- Always say the answer is informational only.
- If property data is provided, use it.
- If no property data is provided, answer generally about using Nestrova, real estate analysis workflow, risk review, offers, deal comparison, or next actions.
`;

    const userPrompt = `
Current page: ${pagePath || "unknown"}

Property data, if available:
${property ? JSON.stringify(property, null, 2) : "No property analysis result is currently attached."}

User question:
${question}
`;

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      console.error("ask_ai_openai_error", errorText);
      return NextResponse.json({ error: "AI response failed. Please try again." }, { status: 500 });
    }

    const openAiData = await openAiResponse.json();
    const answer =
      openAiData.choices?.[0]?.message?.content ||
      "I could not generate an answer. Please try again.";

    if (!isPro) {
      dailyCount += 1;

      await supabase.from("ai_chat_usage").upsert(
        {
          user_id: user.id,
          date_key: dateKey,
          question_count: dailyCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date_key" },
      );
    }

    await supabase.from("ai_chat_history").insert({
      user_id: user.id,
      property_address: property?.address || pagePath || "general",
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
    console.error("ask_ai_unhandled_error", error);
    return NextResponse.json({ error: "Unexpected AI server error." }, { status: 500 });
  }
}