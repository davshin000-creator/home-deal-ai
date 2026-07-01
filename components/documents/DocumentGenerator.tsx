"use client";

export default function DocumentGenerator() {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Documents
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
        Generate investor documents
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Offer reports, summaries, and negotiation documents will be generated here.
      </p>
      <button className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white">
        Generate Document
      </button>
    </section>
  );
}
