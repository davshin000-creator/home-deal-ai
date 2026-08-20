"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";
import ProgressBar from "@/components/onboarding/ProgressBar";
import WelcomeCard from "@/components/onboarding/WelcomeCard";
import AnalyzeStep from "@/components/onboarding/AnalyzeStep";
import ResultStep from "@/components/onboarding/ResultStep";
import PortfolioStep from "@/components/onboarding/PortfolioStep";
import CoachStep from "@/components/onboarding/CoachStep";
import CompleteStep from "@/components/onboarding/CompleteStep";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const { isSignedIn, user } = useUser();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadOnboarding();
    }
  }, [isSignedIn, user?.id]);

  async function loadOnboarding() {
    if (!user?.id) return;

    const response = await fetch(`/api/onboarding?user_id=${encodeURIComponent(user.id)}`);
    const data = await response.json();

    if (data?.completed) {
      setStep(TOTAL_STEPS);
      return;
    }

    setStep(Number(data?.step || 0));
  }

  async function saveStep(nextStep: number) {
    if (!user?.id) return;

    setStep(nextStep);

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, step: nextStep }),
    });
  }

  async function completeOnboarding() {
    if (!user?.id) return;

    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });

    window.location.href = "/";
  }

  async function skipOnboarding() {
    if (!user?.id) return;

    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, skipped: true }),
    });

    window.location.href = "/";
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold">Welcome to Nestrova</h1>
          <p className="mt-3 text-gray-600">
            Please sign in to start your onboarding.
          </p>
          <SignInButton mode="modal">
            <button className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white">
              Sign In
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <a href="/" className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white">
            Back to Nestrova
          </a>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={skipOnboarding}
                className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white"
              >
                Skip
              </button>
            )}
            <UserButton />
          </div>
        </div>

        {step > 0 && step < TOTAL_STEPS && (
          <ProgressBar step={step} totalSteps={TOTAL_STEPS - 1} />
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm text-white/65">
            {message}
          </div>
        )}

        {step === 0 && (
          <WelcomeCard onStart={() => saveStep(1)} onSkip={skipOnboarding} />
        )}

        {step === 1 && (
          <AnalyzeStep
            address={address}
            setAddress={setAddress}
            onContinue={() => {
              if (!address.trim()) {
                setMessage("Please enter or choose a property address.");
                return;
              }
              setMessage("");
              saveStep(2);
            }}
          />
        )}

        {step === 2 && (
          <ResultStep address={address} onContinue={() => saveStep(3)} />
        )}

        {step === 3 && <PortfolioStep onContinue={() => saveStep(4)} />}

        {step === 4 && <CoachStep onContinue={() => saveStep(5)} />}

        {step >= 5 && <CompleteStep onFinish={completeOnboarding} />}
      </div>
    </main>
  );
}




