"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import BrainConsoleLayout from "@/components/brain/BrainConsoleLayout";

type ProStatus = {
  ok: boolean;
  signed_in?: boolean;
  is_pro?: boolean;
  plan?: string;
  subscription_status?: string;
};

function BrainPreview() {
  const modules = [
    "Live Brain HUD",
    "AI Decision Engine",
    "Risk Intelligence",
    "Forecast Layer",
    "Offer Strategy",
    "Memory System",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] px-5 py-10 text-white md:px-8">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-white/[0.075] blur-3xl" />
        <div className="absolute right-[-260px] top-10 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[780px] w-[780px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid max-w-[1480px] gap-8">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white">
            ← Back to Nestrova
          </a>
          <a href="/pricing" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200">
            Upgrade Pro
          </a>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1fr_460px] xl:items-center">
          <div className="rounded-[48px] border border-white/10 bg-white/[0.06] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
              Pro Workspace
            </div>

            <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-8xl">
              Unlock the Nestrova Brain Console.
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">
              Brain Console is the premium decision layer for valuation, risk, forecast, negotiation, and portfolio intelligence.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/pricing" className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black shadow-[0_24px_80px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-neutral-200">
                Upgrade to Pro
              </a>
              <a href="/analyze" className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white">
                Try Analyze First
              </a>
            </div>
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Locked Preview</p>
            <h2 className="mt-3 text-6xl font-semibold tracking-[-0.07em]">PRO</h2>
            <p className="mt-5 text-sm leading-6 text-white/55">
              Upgrade to activate the full Brain Console and unlock advanced investment intelligence.
            </p>

            <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Brain Modules</p>
                <p className="text-xs font-semibold text-amber-200">Locked</p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[38%] rounded-full bg-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.55)]" />
              </div>

              <div className="mt-5 grid gap-3">
                {modules.map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3 text-sm text-white/58">
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-white/30" />
                      {item}
                    </span>
                    <span className="text-xs text-white/30">pro</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function BrainConsolePage() {
  const { isSignedIn, isLoaded } = useUser();
  const [status, setStatus] = useState<ProStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      const response = await fetch("/api/me/pro-status", { cache: "no-store" });
      const data = await response.json();
      setStatus(data);
    }

    if (isLoaded) loadStatus();
  }, [isLoaded]);

  if (!isLoaded || status === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center">
          <p className="text-sm font-semibold text-white/45">Checking Brain access...</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn || !status.signed_in) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <section className="max-w-xl rounded-[44px] border border-white/10 bg-white/[0.07] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Sign In Required</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Sign in to access Brain Console.</h1>
          <p className="mt-4 text-sm leading-6 text-white/50">Brain Console is connected to your Nestrova account and Pro status.</p>
          <SignInButton mode="modal">
            <button className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
              Sign In
            </button>
          </SignInButton>
        </section>
      </main>
    );
  }

  if (!status.is_pro) {
    return <BrainPreview />;
  }

  return <BrainConsoleLayout />;
}
