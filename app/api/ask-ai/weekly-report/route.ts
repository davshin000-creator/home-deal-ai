import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    const { data: alerts, error } = await supabase
      .from("deal_alerts")
      .select("*")
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: "Could not load alerts." }, { status: 500 });
    }

    return NextResponse.json({
      message:
        "Weekly report endpoint is ready. Connect Resend/SendGrid here to send actual emails.",
      active_alerts: alerts?.length || 0,
      next_step: "Add RESEND_API_KEY and email sending logic when ready.",
    });
  } catch (error) {
    console.error("weekly-report error:", error);
    return NextResponse.json(
      { error: "Unexpected weekly report server error." },
      { status: 500 }
    );
  }
}
