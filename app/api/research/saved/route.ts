import { NextResponse } from "next/server";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

const ALLOWED_REPORT_TYPES = new Set([
  "deep",
  "council",
  "compare",
]);

function normalizeSymbol(
  value: unknown,
) {
  const symbol = String(
    value ?? "",
  )
    .trim()
    .toUpperCase();

  return symbol || null;
}

function normalizeTitle(
  value: unknown,
  fallback: string,
) {
  const title = String(
    value ?? "",
  ).trim();

  return (
    title.slice(0, 160) ||
    fallback
  );
}

export async function GET() {
  try {
    const { user } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to view saved research.",
        },
        {
          status: 401,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("research_reports")
      .select(
        [
          "id",
          "report_type",
          "symbol_a",
          "symbol_b",
          "title",
          "result_json",
          "created_at",
        ].join(","),
      )
      .eq(
        "user_id",
        user.id,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(100);

    if (error) {
      console.error(
        "research_saved_get_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not load saved research.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      reports:
        data ?? [],
    });
  } catch (error) {
    console.error(
      "research_saved_get_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not load saved research.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
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
            "Please sign in to save research.",
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
            "Saved Research requires Nestrova Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    const body =
      await request.json();

    const reportType =
      String(
        body?.report_type ??
          "",
      )
        .trim()
        .toLowerCase();

    if (
      !ALLOWED_REPORT_TYPES.has(
        reportType,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid research report type.",
        },
        {
          status: 400,
        },
      );
    }

    const symbolA =
      normalizeSymbol(
        body?.symbol_a,
      );

    const symbolB =
      normalizeSymbol(
        body?.symbol_b,
      );

    if (!symbolA) {
      return NextResponse.json(
        {
          error:
            "Primary symbol is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      reportType ===
        "compare" &&
      !symbolB
    ) {
      return NextResponse.json(
        {
          error:
            "Comparison reports require two symbols.",
        },
        {
          status: 400,
        },
      );
    }

    const resultJson =
      body?.result_json;

    if (
      !resultJson ||
      typeof resultJson !==
        "object"
    ) {
      return NextResponse.json(
        {
          error:
            "Research result is required.",
        },
        {
          status: 400,
        },
      );
    }

    let defaultTitle =
      symbolA;

    if (
      reportType ===
      "deep"
    ) {
      defaultTitle =
        `${symbolA} Deep Research`;
    }

    if (
      reportType ===
      "council"
    ) {
      defaultTitle =
        `${symbolA} Research Council`;
    }

    if (
      reportType ===
        "compare" &&
      symbolB
    ) {
      defaultTitle =
        `${symbolA} vs ${symbolB}`;
    }

    const title =
      normalizeTitle(
        body?.title,
        defaultTitle,
      );

    const supabase =
      createSupabaseAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("research_reports")
      .insert({
        user_id:
          user.id,

        report_type:
          reportType,

        symbol_a:
          symbolA,

        symbol_b:
          symbolB,

        title,

        result_json:
          resultJson,
      })
      .select(
        "id, report_type, symbol_a, symbol_b, title, created_at",
      )
      .single();

    if (error) {
      console.error(
        "research_saved_post_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not save research.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      report:
        data,
    });
  } catch (error) {
    console.error(
      "research_saved_post_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not save research.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const { user } =
      await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please sign in to delete saved research.",
        },
        {
          status: 401,
        },
      );
    }

    const id =
      new URL(
        request.url,
      ).searchParams.get(
        "id",
      );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Research report id is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      error,
    } = await supabase
      .from("research_reports")
      .delete()
      .eq(
        "id",
        id,
      )
      .eq(
        "user_id",
        user.id,
      );

    if (error) {
      console.error(
        "research_saved_delete_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not delete saved research.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "research_saved_delete_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not delete saved research.",
      },
      {
        status: 500,
      },
    );
  }
}
