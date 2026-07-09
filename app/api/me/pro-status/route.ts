import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

export async function GET() {
  try {
    const { user, profile, isPro } = await getCurrentUserProfile();

    if (!user) {
      return NextResponse.json({
        ok: true,
        signed_in: false,
        is_pro: false,
        plan: "free",
        subscription_status: "free",
      });
    }

    const supabase = createSupabaseAdminClient();

    if (!profile) {
      const { error } = await supabase.from("profiles").insert({
        auth_user_id: user.id,
        email: user.email || null,
        is_pro: false,
        plan: "free",
        subscription_status: "free",
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("profile insert failed:", error);

        return NextResponse.json(
          {
            ok: false,
            error: "Could not create profile.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
        signed_in: true,
        is_pro: false,
        plan: "free",
        subscription_status: "free",
      });
    }

    return NextResponse.json({
      ok: true,
      signed_in: true,
      is_pro: isPro,
      plan: profile.plan || "free",
      subscription_status:
        profile.subscription_status || "free",
      pro_since: profile.pro_since || null,
      paypal_order_id: profile.paypal_order_id || null,
    });
  } catch (error) {
    console.error("pro-status failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Could not check Pro status.",
      },
      { status: 500 }
    );
  }
}