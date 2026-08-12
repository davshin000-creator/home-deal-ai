import {
  NextResponse,
} from "next/server";

import {
  hasResearchAccess,
} from "@/lib/research/access";

import {
  getCurrentUserProfile,
} from "@/lib/supabase/server";

import {
  getResearchUsage,
} from "@/lib/research/usage";

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
            "Please sign in.",
        },
        {
          status: 401,
        },
      );
    }

    const [
      deep,
      council,
      compare,
    ] =
      await Promise.all([
        getResearchUsage(
          user.id,
          "deep",
        ),
        getResearchUsage(
          user.id,
          "council",
        ),
        getResearchUsage(
          user.id,
          "compare",
        ),
      ]);

    return NextResponse.json({
      ok: true,
      is_pro:
        hasResearchAccess(profile),
      usage: {
        deep,
        council,
        compare,
      },
    });
  } catch (error) {
    console.error(
      "research_usage_route_failed",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Could not load research usage.",
      },
      {
        status: 500,
      },
    );
  }
}
