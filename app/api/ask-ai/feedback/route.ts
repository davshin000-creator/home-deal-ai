import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error } = await supabase.from("beta_feedback").insert({
      user_id: body.user_id || null,
      email: body.email || "",
      rating: Number(body.rating || 5),
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("feedback route error:", error);
    return NextResponse.json({ error: "Unexpected feedback server error." }, { status: 500 });
  }
}

