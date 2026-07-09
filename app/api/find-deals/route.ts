import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/supabase/server";

const HOME_DEAL_API_URL =
  process.env.HOME_DEAL_API_URL ||
  "https://home-deal-api.onrender.com";

const INTERNAL_API_KEY =
  process.env.NESTROVA_INTERNAL_API_KEY;

export async function POST(request: Request) {
  try {
    const { user, isPro } = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json(
        {
          detail: "Please sign in to find deals.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const city = String(body.city || "").trim();

    const state = String(body.state || "")
      .trim()
      .toUpperCase();

    const maxPrice = Number(body.max_price);

    if (!city) {
      return NextResponse.json(
        { detail: "City is required." },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { detail: "State is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(maxPrice) ||
      maxPrice <= 0
    ) {
      return NextResponse.json(
        {
          detail: "Please enter a valid max price.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${HOME_DEAL_API_URL}/find-deals`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(INTERNAL_API_KEY
            ? {
                "X-Nestrova-Internal-Key":
                  INTERNAL_API_KEY,
              }
            : {}),
        },

        body: JSON.stringify({
          city,
          state,

          max_price: maxPrice,

          limit: Number(body.limit || 20),

          user_id: user.id,

          is_pro: isPro,
        }),

        cache: "no-store",
      }
    );

    const data =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    return NextResponse.json({
      ...data,

      server_verified_pro: isPro,

      plan: isPro
        ? "pro"
        : "free",
    });
  } catch (error) {
    console.error(
      "secure find-deals proxy failed:",
      error
    );

    return NextResponse.json(
      {
        detail:
          "Find deals request failed.",
      },
      { status: 500 }
    );
  }
}