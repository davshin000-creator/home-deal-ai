import { NextResponse } from "next/server";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

function normalizeSymbol(
  value: unknown,
) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

export async function GET(
  request: Request,
) {
  try {
    const {
      user,
      profile,
    } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to view Research History.",
        },
        {
          status: 401,
        },
      );
    }

    if (!hasResearchAccess(profile)) {
      return NextResponse.json(
        {
          error:
            "Research History requires Nestrova AI Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    const symbol =
      normalizeSymbol(
        new URL(
          request.url,
        ).searchParams.get(
          "symbol",
        ),
      );

    if (!symbol) {
      return NextResponse.json(
        {
          error:
            "Symbol is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from(
        "research_watch_history",
      )
      .select(
        [
          "id",
          "symbol",
          "confidence",
          "risk",
          "research_style",
          "research_version",
          "evidence_count",
          "captured_at",
        ].join(","),
      )
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "symbol",
        symbol,
      )
      .order(
        "captured_at",
        {
          ascending: true,
        },
      )
      .limit(500);

    if (error) {
      console.error(
        "research_history_get_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not load Research History.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      symbol,
      history:
        data ?? [],
    });
  } catch (error) {
    console.error(
      "research_history_get_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not load Research History.",
      },
      {
        status: 500,
      },
    );
  }
}
