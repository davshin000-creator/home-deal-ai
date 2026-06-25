"use client";

export default function IntelligenceTimeline({ items }: { items: any[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Intelligence Timeline
      </p>
      <h2 className="mt-1 text-3xl font-bold">What Nestrova is tracking</h2>

      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-2xl border bg-gray-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {item.type}
            </p>
            <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
