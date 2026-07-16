import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReadRequestBody = {
  id?: string;
  mark_all?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = (await request.json()) as ReadRequestBody;

    if (body.mark_all === true) {
      const { error } = await supabase
        .from("trading_alerts")
        .update({
          is_read: true,
        })
        .eq("user_id", authData.user.id)
        .eq("is_read", false);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        ok: true,
        mode: "all",
      });
    }

    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Notification id is required.",
        },
        {
          status: 400,
        },
      );
    }

    const { error } = await supabase
      .from("trading_alerts")
      .update({
        is_read: true,
      })
      .eq("id", id)
      .eq("user_id", authData.user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      mode: "single",
      id,
    });
  } catch (error) {
    console.error("notification_read_api_error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Notification could not be updated.",
      },
      {
        status: 500,
      },
    );
  }
}
