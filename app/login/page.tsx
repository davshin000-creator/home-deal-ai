"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginWithGoogle() {
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  async function loginWithEmail() {
    if (!email.trim()) {
      setMessage("Enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the login link.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <section className="mx-auto max-w-xl rounded-[40px] border border-white/10 bg-white/[0.07] p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
          Login
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
          Sign in to Nestrova
        </h1>

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="mt-8 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black disabled:opacity-50"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <input
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-white outline-none"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={loginWithEmail}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black disabled:opacity-50"
        >
          Send Login Link
        </button>

        {message && (
          <p className="mt-4 text-sm text-white/60">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}