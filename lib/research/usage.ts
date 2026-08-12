import {
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

export type ResearchFeature =
  | "deep"
  | "council"
  | "compare";

export const RESEARCH_LIMITS: Record<
  ResearchFeature,
  number
> = {
  deep: 30,
  council: 20,
  compare: 20,
};

function currentUsageMonth() {
  const now =
    new Date();

  return [
    now.getUTCFullYear(),
    String(
      now.getUTCMonth() + 1,
    ).padStart(
      2,
      "0",
    ),
  ].join("-");
}

export async function getResearchUsage(
  userId: string,
  feature: ResearchFeature,
) {
  const supabase =
    createSupabaseAdminClient();

  const usageMonth =
    currentUsageMonth();

  const {
    data,
    error,
  } = await supabase
    .from("research_usage")
    .select(
      "usage_count",
    )
    .eq(
      "user_id",
      userId,
    )
    .eq(
      "feature",
      feature,
    )
    .eq(
      "usage_month",
      usageMonth,
    )
    .maybeSingle();

  if (error) {
    console.error(
      "research_usage_get_failed",
      error,
    );

    throw new Error(
      "Could not load research usage.",
    );
  }

  const used =
    Number(
      data?.usage_count ??
        0,
    );

  const limit =
    RESEARCH_LIMITS[
      feature
    ];

  return {
    feature,
    usageMonth,
    used,
    limit,
    remaining:
      Math.max(
        0,
        limit - used,
      ),
  };
}

export async function checkResearchUsage(
  userId: string,
  feature: ResearchFeature,
) {
  const usage =
    await getResearchUsage(
      userId,
      feature,
    );

  return {
    allowed:
      usage.used <
      usage.limit,
    ...usage,
  };
}

export async function consumeResearchUsage(
  userId: string,
  feature: ResearchFeature,
) {
  const supabase =
    createSupabaseAdminClient();

  const usage =
    await getResearchUsage(
      userId,
      feature,
    );

  if (
    usage.used >=
    usage.limit
  ) {
    return {
      allowed:
        false,
      ...usage,
    };
  }

  const nextCount =
    usage.used + 1;

  const {
    error,
  } = await supabase
    .from(
      "research_usage",
    )
    .upsert(
      {
        user_id:
          userId,

        feature,

        usage_month:
          usage.usageMonth,

        usage_count:
          nextCount,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "user_id,feature,usage_month",
      },
    );

  if (error) {
    console.error(
      "research_usage_consume_failed",
      error,
    );

    throw new Error(
      "Could not update research usage.",
    );
  }

  return {
    allowed:
      true,

    ...usage,

    used:
      nextCount,

    remaining:
      Math.max(
        0,
        usage.limit -
          nextCount,
      ),
  };
}
