import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type NotificationSummary = {
  id: string;
  symbol: string;
  alert_type: string;
  title: string;
  message: string;
  opportunity_score: number | null;
  risk_level: string | null;
  is_read: boolean;
  created_at: string;
};

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          authenticated: false,
          unread_count: 0,
          notifications: [],
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const [countResponse, notificationsResponse] =
      await Promise.all([
        supabase
          .from("trading_alerts")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", authData.user.id)
          .eq("is_read", false),

        supabase
          .from("trading_alerts")
          .select(
            `
              id,
              symbol,
              alert_type,
              title,
              message,
              opportunity_score,
              risk_level,
              is_read,
              created_at
            `,
          )
          .eq("user_id", authData.user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(5),
      ]);

    if (countResponse.error) {
      throw countResponse.error;
    }

    if (notificationsResponse.error) {
      throw notificationsResponse.error;
    }

    return NextResponse.json(
      {
        authenticated: true,
        unread_count: countResponse.count ?? 0,
        notifications:
          (notificationsResponse.data ??
            []) as NotificationSummary[],
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error(
      "notification_summary_error",
      error,
    );

    return NextResponse.json(
      {
        authenticated: true,
        unread_count: 0,
        notifications: [],
        error: "Notification summary unavailable.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
