"use client";

import { useState } from "react";
import Link from "next/link";
import NestrovaMark from "@/components/brand/NestrovaMark";
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
    <main className="flex min-h-screen flex-col bg-[#050505] px-6 py-12 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between pb-10 md:pb-12">
        <Link href="/" className="flex items-center gap-3">
          <NestrovaMark className="h-10 w-10 rounded-[12px] text-[13px]" />

          <div>
            <p className="text-sm font-semibold tracking-[-0.03em]">
              Nestrova
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              AI Intelligence
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M3.5 11.25 12 4l8.5 7.25"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.75 10.25V20h12.5v-9.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Back to home
        </Link>
      </header>

      <section className="relative mx-auto my-auto grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.035] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 relative flex min-h-[420px] flex-col justify-between overflow-hidden p-8 md:p-12 lg:order-1 lg:min-h-[560px]">
          <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
              Nestrova Intelligence
            </p>

            <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.96] tracking-[-0.065em] md:text-6xl">
              One account.
              <br />
              Smarter decisions.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/45">
              Access Nestrova intelligence across real estate, trading, and research from one place.
            </p>
          </div>

          <div className="relative mt-12 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {["Real Estate", "Trading", "Research"].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-white/[0.045] px-5 py-4"
              >
                <p className="text-xs font-semibold text-white/70">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 bg-black/20 p-6 md:p-10 lg:order-2 lg:border-l lg:border-t-0">
          <div className="mx-auto flex h-full max-w-md flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
              Welcome
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
              Sign in or get started.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/42">
              Continue with Google or use a secure email link.
            </p>

            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.38Z" />
                <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.39l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z" />
                <path fill="#FBBC05" d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.48H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.52l3.35-2.59Z" />
                <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.48l3.35 2.59C7.18 7.7 9.39 5.94 12 5.94Z" />
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35"
                aria-hidden="true"
              >
                <path
                  d="M4 6.5h16v11H4z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="m5 8 7 5 7-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.055] pl-14 pr-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-white/[0.07]"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={loginWithEmail}
              disabled={loading}
              className="mt-4 w-full rounded-full border border-white/12 bg-white/[0.07] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.11] disabled:opacity-50"
            >
              Send secure link
            </button>

            {message && (
              <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/60">
                {message}
              </p>
            )}

            <p className="mt-7 text-center text-xs leading-6 text-white/25">
              Secure access powered by Nestrova authentication.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}






