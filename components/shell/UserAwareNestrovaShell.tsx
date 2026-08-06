"use client";

import type { ReactNode } from "react";
import { useUser } from "@/components/auth/ClerkCompat";
import NestrovaAppShell from "@/components/shell/NestrovaAppShell";

type UserAwareNestrovaShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

function resolveUserName(
  user: ReturnType<typeof useUser>["user"],
) {
  if (!user) {
    return null;
  }

  const metadata =
    user.unsafeMetadata as Record<string, unknown> | undefined;

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

  if (email) {
    return email.split("@")[0];
  }

  return null;
}

export default function UserAwareNestrovaShell({
  children,
  title,
  subtitle,
}: UserAwareNestrovaShellProps) {
  const { user } = useUser();

  return (
    <NestrovaAppShell
      userName={resolveUserName(user)}
      title={title}
      subtitle={subtitle}
    >
      {children}
    </NestrovaAppShell>
  );
}
