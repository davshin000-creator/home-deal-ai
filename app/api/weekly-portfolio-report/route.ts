import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: users } = await supabase
      .from("user_profiles")
      .select("user_id,email")
      .limit(50);

    const reports = [];

    for (const user of users || []) {
      const { data: deals } = await supabase
        .from("saved_deals")
        .select("*")
        .eq("user_id", user.user_id);

      const { data: watchlist } = await supabase
        .from("watchlist_items")
        .select("*")
        .eq("user_id", user.user_id);

      let reportText = "Weekly report ready. Add more saved deals for deeper insights.";

      if (OPENAI_API_KEY) {
        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.35,
            messages: [
              {
                role: "system",
                content:
                  "You are Nestrova Weekly Portfolio Reporter. Summarize saved deals and watchlist. Do not provide financial, legal, tax, or lending advice.",
              },
              {
                role: "user",
                content: `Create a concise weekly portfolio report. Data: ${JSON.stringify({
                  saved_deals: deals || [],
                  watchlist: watchlist || [],
                })}`,
              },
            ],
          }),
        });

        if (openAiResponse.ok) {
          const data = await openAiResponse.json();
          reportText =
            data.choices?.[0]?.message?.content || reportText;
        }
      }

      const { data: savedReport } = await supabase
        .from("weekly_portfolio_reports")
        .insert({
          user_id: user.user_id,
          email: user.email || "",
          report_text: reportText,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      reports.push({
        user_id: user.user_id,
        report_id: savedReport?.id,
      });
    }

    return NextResponse.json({
      ok: true,
      generated_reports: reports.length,
      reports,
      note: "Reports are saved in Supabase. Connect Resend/SendGrid later to email them automatically.",
    });
  } catch (error) {
    console.error("weekly portfolio report error:", error);
    return NextResponse.json(
      { error: "Unexpected weekly report server error." },
      { status: 500 }
    );
  }
}
