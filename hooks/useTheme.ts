"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  function applyTheme(nextTheme: ThemeMode) {
    if (typeof document === "undefined") return;
    const resolved = nextTheme === "system" ? getSystemTheme() : nextTheme;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    setResolvedTheme(resolved);
  }

  function setTheme(nextTheme: ThemeMode) {
    setThemeState(nextTheme);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("nestrova-theme", nextTheme);
    }
    applyTheme(nextTheme);
  }

  useEffect(() => {
    const saved = (localStorage.getItem("nestrova-theme") as ThemeMode | null) || "system";
    setThemeState(saved);
    applyTheme(saved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if ((localStorage.getItem("nestrova-theme") || "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === "dark",
  };
}
