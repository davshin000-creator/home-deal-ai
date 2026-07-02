"use client";

export default function IntelligenceTimeline({
  items,
}: {
  items?: any;
}) {
  const timelineItems = Array.isArray(items) ? items : [];

  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-[-0.02em]">
        Intelligence Timeline
      </h2>

      <div className="mt-4 grid gap-3">
        {timelineItems.length > 0 ? (
          timelineItems.map((item: any, index: number) => (
            <div key={index} className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              {item?.title || item?.event || item?.summary || "Timeline event"}
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-600">
            Timeline updates will appear here.
          </p>
        )}
      </div>
    </section>
  );
}