"use client";

import {
  useEffect,
  useState,
} from "react";

type UsageItem = {
  feature: string;
  usageMonth: string;
  used: number;
  limit: number;
  remaining: number;
};

type UsageResponse = {
  ok?: boolean;
  is_pro?: boolean;
  error?: string;

  usage?: {
    deep?: UsageItem;
    council?: UsageItem;
    compare?: UsageItem;
  };
};

function UsageCard({
  title,
  item,
}: {
  title: string;
  item?: UsageItem;
}) {
  const used =
    item?.used ?? 0;

  const limit =
    item?.limit ?? 0;

  const percent =
    limit > 0
      ? Math.min(
          100,
          Math.round(
            (used / limit) *
              100,
          ),
        )
      : 0;

  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black">
            {used}
            <span className="text-base font-semibold text-white/25">
              /{limit}
            </span>
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold text-white/40">
          {item?.remaining ??
            limit}{" "}
          left
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-white/65 transition-all"
          style={{
            width:
              `${percent}%`,
          }}
        />
      </div>

      <p className="mt-3 text-[10px] text-white/25">
        Resets monthly
      </p>
    </div>
  );
}

export default function ResearchUsagePanel() {
  const [
    data,
    setData,
  ] =
    useState<UsageResponse | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadUsage() {
      try {
        const response =
          await fetch(
            "/api/research/usage",
            {
              cache:
                "no-store",
            },
          );

        const result =
          (await response.json()) as UsageResponse;

        setData(result);
      } catch (
        error
      ) {
        console.error(
          "research_usage_ui_failed",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    void loadUsage();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map(
          (item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-[22px] border border-white/10 bg-white/[0.03]"
            />
          ),
        )}
      </div>
    );
  }

  if (
    !data?.ok ||
    !data.is_pro
  ) {
    return null;
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/45">
            Nestrova AI Pro
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Research usage this month
          </h2>
        </div>

        <p className="text-xs text-white/30">
          AI research limits protect
          platform quality and reliability.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <UsageCard
          title="Deep Research"
          item={
            data.usage
              ?.deep
          }
        />

        <UsageCard
          title="Research Council"
          item={
            data.usage
              ?.council
          }
        />

        <UsageCard
          title="Research Compare"
          item={
            data.usage
              ?.compare
          }
        />
      </div>
    </section>
  );
}
