"use client";

export default function NextBestAction({ action }: { action: any }) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Next Best Action
      </p>
      <h2 className="mt-1 text-3xl font-bold">{action.title}</h2>
      <p className="mt-3 text-gray-600">{action.description}</p>

      <a
        href={action.href}
        className="mt-6 inline-block rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
      >
        {action.cta}
      </a>
    </section>
  );
}
