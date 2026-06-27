"use client";

const ACTIONS = [
  "Explain this score",
  "Generate offer",
  "Review risks",
  "Compare nearby homes",
  "Forecast appreciation",
  "Create negotiation plan",
];

export default function AISidebar() {
  return (
    <aside className="hidden border-l border-black/10 bg-white/70 p-4 xl:block">
      <div className="sticky top-20">
        <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Nestrova AI
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Copilot</h2>
          <p className="mt-3 text-sm text-neutral-600">
            Ask questions or take the next best action for this property.
          </p>
          <div className="mt-5 grid gap-2">
            {ACTIONS.map((action) => (
              <button
                key={action}
                className="rounded-2xl border border-black/10 px-4 py-3 text-left text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-black"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[28px] bg-black p-5 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">Next Best Action</p>
          <p className="mt-2 text-xl font-semibold">Generate Offer</p>
          <p className="mt-2 text-sm text-neutral-300">
            The property has enough discount margin to justify an offer strategy.
          </p>
        </div>
      </div>
    </aside>
  );
}
