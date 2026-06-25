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

    const eventName = String(body.event_name || "").trim();

    if (!eventName) {
      return NextResponse.json(
        { error: "event_name is required." },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "";

    const userAgent = request.headers.get("user-agent") || "";

    const { error } = await supabase.from("analytics_events").insert({
      user_id: body.user_id || null,
      event_name: eventName,
      properties: body.properties || {},
      url: body.url || null,
      pathname: body.pathname || null,
      referrer: body.referrer || null,
      ip_address: ip,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Could not save event." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("events route error:", error);
    return NextResponse.json(
      { error: "Unexpected analytics event error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase service variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name, created_at, pathname")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: "Could not load events." },
        { status: 500 }
      );
    }

    const counts = (data || []).reduce((acc: Record<string, number>, event) => {
      acc[event.event_name] = (acc[event.event_name] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      recent_events: data || [],
      counts,
    });
  } catch (error) {
    console.error("events GET error:", error);
    return NextResponse.json(
      { error: "Unexpected analytics load error." },
      { status: 500 }
    );
  }
}
