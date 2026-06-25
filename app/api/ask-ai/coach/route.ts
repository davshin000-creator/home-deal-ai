import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
        { error: "Missing Supabase service environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const userId = String(body.user_id || "");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id." }, { status: 400 });
    }

    const profile = {
      budget: Number(body.budget || 0),
      down_payment_percent: Number(body.down_payment_percent || 25),
      goal: String(body.goal || ""),
      risk_level: String(body.risk_level || "Medium"),
      time_horizon: String(body.time_horizon || "5-10 years"),
      preferred_markets: String(body.preferred_markets || ""),
      monthly_income_goal: Number(body.monthly_income_goal || 0),
    };

    if (!profile.budget || profile.budget <= 0) {
      return NextResponse.json({ error: "Valid budget is required." }, { status: 400 });
    }

    const prompt = `
Create a practical real estate investment coaching plan.

Investor profile:
${JSON.stringify(profile, null, 2)}

The plan should include:
1. Recommended investment strategy
2. Recommended property type
3. Target price range
4. Target down payment
5. Target yield
6. Target cash flow
7. Suggested markets
8. Risk warnings
9. 30-day action plan
10. What to avoid
11. Next Nestrova features to use

Rules:
- Be practical and concise.
- Do not provide legal, tax, lending, or personalized financial advice.
- Make clear it is informational only.
`;

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are Nestrova AI Investment Coach, a practical real estate investment planning assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!openAiResponse.ok) {
      return NextResponse.json(
        { error: "AI coach failed. Please try again." },
        { status: 500 }
      );
    }

    const openAiData = await openAiResponse.json();
    const plan =
      openAiData.choices?.[0]?.message?.content ||
      "Could not generate investment plan.";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("coach_plans")
      .insert({
        user_id: userId,
        email: body.email || "",
        budget: profile.budget,
        down_payment_percent: profile.down_payment_percent,
        goal: profile.goal,
        risk_level: profile.risk_level,
        time_horizon: profile.time_horizon,
        preferred_markets: profile.preferred_markets,
        monthly_income_goal: profile.monthly_income_goal,
        plan,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Could not save coach plan." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      plan_id: data.id,
      plan,
    });
  } catch (error) {
    console.error("coach route error:", error);
    return NextResponse.json(
      { error: "Unexpected AI coach server error." },
      { status: 500 }
    );
  }
}
