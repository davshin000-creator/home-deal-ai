"use client";

export default function PortfolioIntelligence({
  data,
}: {
  data?: any;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em]">
        Portfolio Intelligence
      </h2>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        {data?.summary ||
          data?.description ||
          "Portfolio insights will appear here."}
      </p>
    </section>
  );
}

