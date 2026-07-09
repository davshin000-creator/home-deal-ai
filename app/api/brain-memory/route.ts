import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "local-storage",
    message: "Brain Memory v1 uses local browser storage. Supabase-backed memory comes next.",
  });
}

