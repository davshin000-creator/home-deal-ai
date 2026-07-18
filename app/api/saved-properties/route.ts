import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  getCurrentUserProfile,
} from "@/lib/supabase/server";

export async function GET() {
  const { user } = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in." },
      { status: 401 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("saved_properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not load saved properties." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    properties: data ?? [],
  });
}

export async function POST(request: Request) {
  const { user } = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in." },
      { status: 401 }
    );
  }

  const property = await request.json();

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("saved_properties")
    .upsert({
      user_id: user.id,

      address: property.address,
      city: property.city,
      state: property.state,

      listing_price: property.price,
      fair_value: property.fairValue,
      estimated_rent: property.estimatedRent,

      brain_score: property.brainScore,
      recommendation: property.recommendation,

      summary: property.summary,
      strengths: property.strengths,
      risks: property.risks,
    });

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not save property." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}

export async function DELETE(request: Request) {
  const { user } = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Property id is required." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not delete property." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}