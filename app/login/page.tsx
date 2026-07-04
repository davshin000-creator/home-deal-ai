"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/pricing`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the login link.");
    }
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

        <input
          className="mt-8 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-white outline-none"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={login}
          className="mt-4 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black"
        >
          Send Magic Link
        </button>

        {message && <p className="mt-4 text-sm text-white/60">{message}</p>}
      </section>
    </main>
  );
}
