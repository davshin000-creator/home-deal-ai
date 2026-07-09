import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function csvEscape(value: any) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: feedback } = await supabase
      .from("beta_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    const rows = feedback || [];
    const header = ["id", "email", "rating", "message", "created_at"];
    const csv = [
      header.join(","),
      ...rows.map((row) =>
        [
          csvEscape(row.id),
          csvEscape(row.email),
          csvEscape(row.rating),
          csvEscape(row.message),
          csvEscape(row.created_at),
        ].join(",")
      ),
    ].join("\\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="nestrova-feedback.csv"',
      },
    });
  } catch (error) {
    console.error("admin export error:", error);
    return NextResponse.json({ error: "Unexpected export server error." }, { status: 500 });
  }
}

