"use client";

import { useState } from "react";

export default function BetaPage() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("5");
  const [message, setMessage] = useState("");

  async function submitFeedback() {
    const response = await fetch("/api/beta-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, feedback, rating: Number(rating), source: "beta_page" }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not send feedback.");
      return;
    }

    setMessage("Thanks. Your beta feedback was saved.");
    setFeedback("");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl rounded-[44px] border border-white/10 bg-white/[0.07] p-8">
        <a href="/" className="text-sm font-semibold text-white/50 hover:text-white">??Back</a>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Private Beta</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em]">Help shape Nestrova before public launch.</h1>
        <p className="mt-5 max-w-2xl text-white/55">Test analysis, reports, portfolio, watchlist, and history. Tell us what is useful or worth paying for.</p>

        <div className="mt-8 grid gap-4">
          <input className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 ??Very useful</option>
            <option value="4">4 ??Useful</option>
            <option value="3">3 ??Maybe</option>
            <option value="2">2 ??Not yet</option>
            <option value="1">1 ??Not useful</option>
          </select>
          <textarea className="min-h-[160px] rounded-2xl border border-white/10 bg-black/25 p-4 text-white outline-none" placeholder="What should we improve?" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <button onClick={submitFeedback} className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-black">Send Beta Feedback</button>
          {message && <p className="text-sm text-white/60">{message}</p>}
        </div>
      </section>
    </main>
  );
}

