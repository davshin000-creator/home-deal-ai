"use client";

export default function MarketRadar({
  markets,
}: {
  markets?: any;
}) {
  const items = Array.isArray(markets) ? markets : [];

  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em]">
        Market Radar
      </h2>

      <div className="mt-4 grid gap-3">
        {items.length > 0 ? (
          items.map((item: any, index: number) => (
            <div key={index} className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              {item?.market || item?.name || item?.title || "Market signal"}
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-600">
            Market signals will appear here.
          </p>
        )}
      </div>
    </section>
  );
}