import { NextResponse } from "next/server";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

export async function GET() {
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
            "Please sign in to view Research Alerts.",
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
            "Research Alerts requires Nestrova AI Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("research_alerts")
      .select(
        [
          "id",
          "symbol",
          "alert_type",
          "title",
          "message",
          "previous_value",
          "current_value",
          "is_read",
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
        "research_alerts_get_failed",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Could not load Research Alerts.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
      alerts:
        data ?? [],
    });
  } catch (error) {
    console.error(
      "research_alerts_get_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not load Research Alerts.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
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
            "Please sign in.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      await request.json();

    const id =
      String(
        body?.id ?? "",
      ).trim();

    const markAll =
      Boolean(
        body?.all,
      );

    if (!hasResearchAccess(profile)) {
      return NextResponse.json(
        {
          error:
            "Research Alerts requires Nestrova AI Pro.",
          code:
            "RESEARCH_PRO_REQUIRED",
        },
        {
          status: 403,
        },
      );
    }

    const supabase =
      createSupabaseAdminClient();

    if (markAll) {
      const {
        error,
      } = await supabase
        .from("research_alerts")
        .update({
          is_read: true,
        })
        .eq(
          "user_id",
          user.id,
        )
        .eq(
          "is_read",
          false,
        );

      if (error) {
        return NextResponse.json(
          {
            error:
              "Could not mark alerts as read.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        ok: true,
      });
    }

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Alert id is required.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      error,
    } = await supabase
      .from("research_alerts")
      .update({
        is_read: true,
      })
      .eq(
        "id",
        id,
      )
      .eq(
        "user_id",
        user.id,
      );

    if (error) {
      return NextResponse.json(
        {
          error:
            "Could not mark alert as read.",
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
      "research_alerts_patch_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not update Research Alerts.",
      },
      {
        status: 500,
      },
    );
  }
}
