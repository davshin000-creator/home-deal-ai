"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NestrovaMark from "@/components/brand/NestrovaMark";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
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

  async function sendEmailCode() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage("Enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setEmail(normalizedEmail);
    setCodeSent(true);
    setOtp("");
    setMessage("");

    setLoading(false);
  }

  async function verifyEmailCode() {
    const normalizedCode = otp.replace(/\D/g, "");

    if (normalizedCode.length !== 6) {
      setMessage("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: normalizedCode,
      type: "email",
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function changeEmail() {
    setCodeSent(false);
    setOtp("");
    setMessage("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[20%] -top-[35%] h-[780px] w-[780px] rounded-full border-[110px] border-white/[0.055] blur-[1px]" />

        <div className="absolute -bottom-[42%] -left-[20%] h-[760px] w-[760px] rounded-full border-[110px] border-white/[0.04] blur-[1px]" />

        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex w-full items-center justify-between px-6 py-6 md:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="m14.5 6-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Home
          </Link>

          <Link
            href="/"
            aria-label="Nestrova home"
            className="opacity-70 transition hover:opacity-100"
          >
            <NestrovaMark className="h-9 w-9 rounded-[11px] text-[12px]" />
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center px-5 pb-16 pt-4 md:px-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-8 flex justify-center">
              <NestrovaMark className="h-12 w-12 rounded-[14px] text-[15px]" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-[-0.05em] md:text-[34px]">
                {codeSent ? "Check your email" : "Sign in to Nestrova"}
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/40">
                {codeSent
                  ? `We sent a 6-digit sign-in code to ${email}.`
                  : "Access your Nestrova intelligence workspace."}
              </p>
            </div>

            {!codeSent ? (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  disabled={loading}
                  className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-5 text-sm font-semibold text-white transition hover:border-white/15 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.38Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 22c2.7 0 4.97-.9 6.63-2.39l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.48H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.52l3.35-2.59Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.94c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.48l3.35 2.59C7.18 7.7 9.39 5.94 12 5.94Z"
                    />
                  </svg>

                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-xs text-white/25">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/55"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading) {
                      void sendEmailCode();
                    }
                  }}
                  placeholder="you@example.com"
                  className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 focus:bg-white/[0.075]"
                />

                <button
                  type="button"
                  onClick={sendEmailCode}
                  disabled={loading}
                  className="mt-4 h-13 w-full rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Continue with email"}
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-white/55"
                >
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => {
                    setOtp(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    );
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      otp.length === 6 &&
                      !loading
                    ) {
                      void verifyEmailCode();
                    }
                  }}
                  placeholder="000000"
                  autoFocus
                  className="h-16 w-full rounded-xl border border-white/10 bg-white/[0.055] px-5 text-center text-2xl font-semibold tracking-[0.35em] text-white outline-none transition placeholder:text-white/15 focus:border-white/25 focus:bg-white/[0.075]"
                />

                <button
                  type="button"
                  onClick={verifyEmailCode}
                  disabled={loading || otp.length !== 6}
                  className="mt-4 h-13 w-full rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? "Verifying..." : "Verify and continue"}
                </button>

                <div className="mt-5 flex items-center justify-center gap-5 text-xs">
                  <button
                    type="button"
                    onClick={sendEmailCode}
                    disabled={loading}
                    className="text-white/40 transition hover:text-white disabled:opacity-40"
                  >
                    Resend code
                  </button>

                  <span className="h-3 w-px bg-white/10" />

                  <button
                    type="button"
                    onClick={changeEmail}
                    disabled={loading}
                    className="text-white/40 transition hover:text-white disabled:opacity-40"
                  >
                    Change email
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/60">
                {message}
              </div>
            )}

            <p className="mt-8 text-center text-[11px] leading-5 text-white/25">
              By continuing, you agree to Nestrova&apos;s{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 transition hover:text-white/50"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 transition hover:text-white/50"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}