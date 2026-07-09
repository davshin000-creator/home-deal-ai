import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing Supabase service variables." }, { status: 500 });
    }
    const body = await request.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from("offer_documents").insert({
      user_id: body.user_id || null,
      property_address: body.property_address || "",
      document_type: body.document_type || "offer_strategy",
      html: body.html || "",
      email: body.email || "",
      payload: body.payload || {},
      created_at: new Date().toISOString(),
    }).select("id").single();

    if (error) return NextResponse.json({ error: "Could not save document." }, { status: 500 });
    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json({ error: "Unexpected documents server error." }, { status: 500 });
  }
}

