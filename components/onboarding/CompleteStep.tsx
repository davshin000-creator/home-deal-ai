"use client";

export default function CompleteStep({
  onFinish,
}: {
  onFinish?: () => void | Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
        ??      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-neutral-950">
        You are ready to use Nestrova
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Your workspace is set up. Start analyzing properties and generating AI decisions.
      </p>

      <button
        onClick={onFinish}
        className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
      >
        Finish
      </button>
    </section>
  );
}

