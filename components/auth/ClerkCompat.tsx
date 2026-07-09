"use client";

import React, { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useUser() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUser({
          id: data.user.id,
          primaryEmailAddress: {
            emailAddress: data.user.email || "",
          },
          emailAddresses: [{ emailAddress: data.user.email || "" }],
        });
      }

      setIsLoaded(true);
    }

    load();
  }, []);

  return {
    isLoaded,
    isSignedIn: Boolean(user),
    user,
  };
}

export function SignInButton({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  return <a href="/login">{children}</a>;
}

export function UserButton({ ...props }: { [key: string]: any }) {
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={signOut}
      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
    >
      Sign Out
    </button>
  );
}