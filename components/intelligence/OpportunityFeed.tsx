"use client";

export default function OpportunityFeed({
  opportunities,
}: {
  opportunities?: any;
}) {
  const items = Array.isArray(opportunities) ? opportunities : [];

  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em]">
        Opportunity Feed
      </h2>

      <div className="mt-4 grid gap-3">
        {items.length > 0 ? (
          items.map((item: any, index: number) => (
            <div key={index} className="rounded-2xl bg-neutral-50 p-4">
              {item?.title || item?.address || "Opportunity"}
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-600">
            No opportunities yet.
          </p>
        )}
      </div>
    </section>
  );
}

