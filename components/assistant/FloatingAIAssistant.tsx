"use client";

import { FormEvent, useState } from "react";

export default function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = message.trim();
    if (!prompt || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          page_path: window.location.pathname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ask AI failed.");
      }

      setAnswer(data.answer || data.message || data.result || "No answer returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ask AI failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] text-white shadow-2xl md:right-6">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Nestrova Assistant
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Ask AI
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/60 hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 p-5">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about this page, a property, risk, offer strategy, or next action..."
              className="min-h-28 resize-none rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/25"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask Nestrova"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {answer && (
              <div className="max-h-80 overflow-auto rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/75">
                {answer}
              </div>
            )}
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-black px-5 py-4 text-sm font-semibold text-white shadow-2xl"
        aria-label="Open AI assistant"
      >
        Ask AI
      </button>
    </>
  );
}