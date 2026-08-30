"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  SignInButton,
  useUser,
} from "@/components/auth/ClerkCompat";

import NestrovaAppShell from "@/components/shell/NestrovaAppShell";
import NestrovaMark from "@/components/brand/NestrovaMark";

type RealEstateAnalyzeShellProps = {
  children: ReactNode;
};

function resolveUserName(
  user: ReturnType<typeof useUser>["user"],
) {
  if (!user) {
    return null;
  }

  const metadata =
    user.unsafeMetadata as
      | Record<string, unknown>
      | undefined;

  const possibleNames = [
    user.fullName,
    user.firstName,
    metadata?.full_name,
    metadata?.display_name,
    metadata?.first_name,
  ];

  for (const value of possibleNames) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  const email =
    user.primaryEmailAddress?.emailAddress;

  return email
    ? email.split("@")[0]
    : null;
}

export default function RealEstateAnalyzeShell({
  children,
}: RealEstateAnalyzeShellProps) {
  const {
    isLoaded,
    isSignedIn,
    user,
  } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <NestrovaAppShell
        userName={resolveUserName(user)}
        title="Real Estate"
        subtitle="Analyze properties and surface stronger investment decisions."
      >
        {children}
      </NestrovaAppShell>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08080b] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08080b]/85 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link
            href="/real-estate"
            className="flex items-center gap-3"
          >
            <NestrovaMark className="h-10 w-10 rounded-[13px] text-[13px]" />

            <div>
              <p className="font-bold tracking-[-0.03em]">
                Nestrova
              </p>

              <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                Intelligence Platform
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/real-estate"
              className="hidden rounded-[14px] border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/[0.1] hover:text-white sm:inline-flex"
            >
              Real Estate
            </Link>

            <Link
              href="/saved"
              className="hidden rounded-[14px] border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white/55 transition hover:bg-white/[0.1] hover:text-white sm:inline-flex"
            >
              Saved Properties
            </Link>

            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-[14px] bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-neutral-200"
              >
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}
