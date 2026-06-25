"use client";

import { useState } from "react";

const ACTIONS = [
  ["Analyze Property", "/"],
  ["Find Deals", "/deals"],
  ["Generate Report", "/"],
  ["AI Investment Coach", "/coach"],
  ["Portfolio", "/portfolio"],
  ["Watchlist", "/watchlist"],
  ["Pricing", "/pricing"],
];

export default function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[320px] rounded-3xl border bg-white p-5 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Nestrova AI
          </p>

          <h3 className="mt-1 text-2xl font-bold">How can I help?</h3>

          <p className="mt-2 text-sm text-gray-600">
            Jump into your most important investment workflow.
          </p>

          <div className="mt-5 grid gap-2">
            {ACTIONS.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-2xl border px-4 py-3 font-semibold hover:bg-gray-50"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-3xl text-white shadow-2xl hover:bg-gray-800"
        aria-label="Open Nestrova AI Assistant"
      >
        🤖
      </button>
    </div>
  );
}
