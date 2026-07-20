"use client";

import { FormEvent, useState } from "react";

type FloatingAIAssistantProps = {
  propertyContext?: Record<string, unknown> | null;
};

const suggestedQuestions = [
  "Should I buy this property?",
  "What is the biggest investment risk?",
  "Is this a good rental investment?",
  "Can I negotiate a lower price?",
];

export default function FloatingAIAssistant({
  propertyContext,
}: FloatingAIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion(question: string) {
    const prompt = question.trim();

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
          question: prompt,
          page_path: window.location.pathname,
          property: propertyContext ?? null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Ask AI failed.");
      }

      setAnswer(
        data.answer ||
          data.message ||
          data.result ||
          "No answer returned.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ask AI failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await askQuestion(message);
  }

  function handleSuggestedQuestion(question: string) {
    setMessage(question);
    void askQuestion(question);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] text-white shadow-2xl md:right-6">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Nestrova Assistant
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Ask about this property
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Nestrova AI can review the valuation, rental estimate,
                  financing, forecast, risks, and negotiation strategy.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 p-5">
            {propertyContext && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Suggested questions
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={loading}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-xs text-white/65 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                propertyContext
                  ? "Ask about this property's value, risks, rental potential, or offer strategy..."
                  : "Ask about real estate analysis, risks, offers, or next actions..."
              }
              className="min-h-28 resize-none rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/30"
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
              <div className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4 text-sm leading-7 text-white/75">
                {answer}
              </div>
            )}

            <p className="text-[10px] leading-5 text-white/30">
              AI responses are informational only and are not legal, tax,
              lending, or personalized financial advice.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 rounded-full border border-cyan-300/20 bg-black px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_70px_rgba(34,211,238,0.18)] transition hover:border-cyan-300/40 hover:bg-neutral-900"
        aria-label="Open Nestrova AI assistant"
      >
        Ask Nestrova AI
      </button>
    </>
  );
}