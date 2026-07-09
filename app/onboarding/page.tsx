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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            Back to Nestrova
          </a>

          <div className="flex items-center gap-4">
            <button
              onClick={skipOnboarding}
              className="text-sm font-semibold text-gray-600 hover:text-black"
            >
              Skip
            </button>
            <UserButton />
          </div>
        </div>

        {step > 0 && step < TOTAL_STEPS && (
          <ProgressBar step={step} totalSteps={TOTAL_STEPS - 1} />
        )}

        {message && (
          <div className="mb-6 rounded-2xl bg-gray-100 p-4 text-gray-800">
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


