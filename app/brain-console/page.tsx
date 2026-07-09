"use client";

import { useEffect, useState } from "react";
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
      <section className="relative mx-auto grid max-w-[1480px] gap-8">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55">
            ??Back to Nestrova
          </a>
          <a href="/pricing" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">
            Upgrade Pro
          </a>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1fr_460px] xl:items-center">
          <div className="rounded-[48px] border border-white/10 bg-white/[0.06] p-8 md:p-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Pro Workspace
            </div>

            <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-8xl">
              Unlock the Nestrova Brain Console.
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">
              Brain Console is the premium decision layer for valuation, risk,
              forecast, negotiation, and portfolio intelligence.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/pricing" className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black">
                Upgrade to Pro
              </a>
              <a href="/analyze" className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70">
                Try Analyze First
              </a>
            </div>
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.07] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Locked Preview
            </p>
            <h2 className="mt-3 text-6xl font-semibold tracking-[-0.07em]">
              PRO
            </h2>
            <p className="mt-5 text-sm leading-6 text-white/55">
              Upgrade to activate the full Brain Console and unlock advanced
              investment intelligence.
            </p>

            <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Brain Modules
              </p>

              <div className="mt-5 grid gap-3">
                {modules.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-3 text-sm text-white/58"
                  >
                    <span>{item}</span>
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
  const [status, setStatus] = useState<ProStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch("/api/me/pro-status", {
          cache: "no-store",
        });

        const data = await response.json();

        setStatus({
          ok: response.ok,
          signed_in: Boolean(data.signed_in),
          is_pro: Boolean(data.is_pro),
          plan: data.plan,
          subscription_status: data.subscription_status,
        });
      } catch {
        setStatus({
          ok: false,
          signed_in: false,
          is_pro: false,
        });
      }
    }

    loadStatus();
  }, []);

  if (status === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center">
          <p className="text-sm font-semibold text-white/45">
            Checking Brain access...
          </p>
        </div>
      </main>
    );
  }

  if (!status.signed_in) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <section className="max-w-xl rounded-[44px] border border-white/10 bg-white/[0.07] p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">
            Sign In Required
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
            Sign in to access Brain Console.
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/50">
            Brain Console is connected to your Nestrova account and Pro status.
          </p>

          <a
            href="/login"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Sign In
          </a>
        </section>
      </main>
    );
  }

  if (!status.is_pro) {
    return <BrainPreview />;
  }

  return <BrainConsoleLayout />;
}

