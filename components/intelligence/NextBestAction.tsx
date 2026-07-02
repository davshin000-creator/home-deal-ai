"use client";

export default function NextBestAction({
  action,
}: {
  action?: any;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Intelligence
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        Next Best Action
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Nestrova will recommend the next best action for the user.
      </p>
    </section>
  );
}
