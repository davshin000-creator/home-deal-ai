"use client";

import { useState } from "react";
import { useUser, SignInButton, UserButton } from "@/components/auth/ClerkCompat";

export default function FeedbackPage() {
  const { isSignedIn, user } = useUser();
  const [rating, setRating] = useState("5");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitFeedback() {
    setStatus("");

    if (!message.trim()) {
      setStatus("Please write feedback before submitting.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id || null,
        email: user?.primaryEmailAddress?.emailAddress || "",
        rating: Number(rating),
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Could not submit feedback.");
      setLoading(false);
      return;
    }

    setStatus("Thank you. Your feedback was submitted.");
    setMessage("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ??Back to Nestrova
          </a>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        <section className="rounded-3xl border bg-white p-8 shadow">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Beta Feedback
          </p>
          <h1 className="mt-2 text-4xl font-bold">Help improve Nestrova</h1>
          <p className="mt-3 text-gray-600">
            Tell us what was useful, confusing, missing, or worth paying for.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="font-semibold">Rating</label>
            <select
              className="rounded-lg border p-4"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">5 - Very useful</option>
              <option value="4">4 - Useful</option>
              <option value="3">3 - Okay</option>
              <option value="2">2 - Needs work</option>
              <option value="1">1 - Not useful</option>
            </select>

            <label className="font-semibold">Feedback</label>
            <textarea
              className="min-h-[180px] rounded-lg border p-4"
              placeholder="What should we improve before launch?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {status && (
              <div className="rounded-lg bg-gray-100 p-4 text-gray-800">
                {status}
              </div>
            )}

            <button
              onClick={submitFeedback}
              disabled={loading}
              className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

