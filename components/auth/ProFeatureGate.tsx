"use client";

import { ReactNode, useEffect, useState } from "react";
import { SignInButton, useUser } from "@/components/auth/ClerkCompat";

type ProStatus = { ok:boolean; signed_in?:boolean; is_pro?:boolean; plan?:string; subscription_status?:string };

export default function ProFeatureGate({
  featureName,
  title,
  description,
  children,
}: {
  featureName: string;
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const [status, setStatus] = useState<ProStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      const res = await fetch("/api/me/pro-status", { cache: "no-store" });
      setStatus(await res.json());
    }
    if (isLoaded) loadStatus();
  }, [isLoaded]);

  if (!isLoaded || status === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-8">Checking Pro access...</div>
      </main>
    );
  }

  if (!isSignedIn || !status.signed_in) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <section className="max-w-xl rounded-[44px] border border-white/10 bg-white/[0.07] p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Sign In Required</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Sign in to access {featureName}.</h1>
          <p className="mt-4 text-sm leading-6 text-white/50">This workspace is connected to your Nestrova account and Pro status.</p>
          <SignInButton mode="modal">
            <button className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">Sign In</button>
          </SignInButton>
        </section>
      </main>
    );
  }

  if (!status.is_pro) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#050505] px-5 py-10 text-white md:px-8">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
          <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-white/[0.075] blur-3xl" />
          <div className="absolute right-[-260px] top-10 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <section className="relative mx-auto grid max-w-[1480px] gap-8">
          <header className="flex items-center justify-between gap-4">
            <a href="/" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55">Back to Nestrova</a>
            <a href="/pricing" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">Upgrade Pro</a>
          </header>
          <div className="grid gap-8 xl:grid-cols-[1fr_460px] xl:items-center">
            <div className="rounded-[48px] border border-white/10 bg-white/[0.06] p-8 md:p-12">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Pro Feature
              </div>
              <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-8xl">
                {title || `Unlock ${featureName}.`}
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">
                {description || `${featureName} is part of Nestrova Pro. Upgrade to activate advanced investment intelligence.`}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="/pricing" className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black">Upgrade to Pro</a>
                <a href="/analyze" className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70">Try Analyze First</a>
              </div>
            </div>
            <aside className="rounded-[44px] border border-white/10 bg-white/[0.07] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Locked Preview</p>
              <h2 className="mt-3 text-6xl font-semibold tracking-[-0.07em]">PRO</h2>
              <p className="mt-5 text-sm leading-6 text-white/55">Your account is currently on the Free plan.</p>
              <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
                <p className="text-sm text-white/58">??Advanced AI workspaces</p>
                <p className="mt-3 text-sm text-white/58">??Investor-ready workflows</p>
                <p className="mt-3 text-sm text-white/58">??Pro reports and exports</p>
                <p className="mt-3 text-sm text-white/58">??Higher monthly usage limits</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}


