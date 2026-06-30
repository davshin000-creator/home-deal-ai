"use client";

import { createContext, useContext } from "react";
import { ThemeMode, useTheme } from "@/hooks/useTheme";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useNestrovaTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useNestrovaTheme must be used inside ThemeProvider");
  }
  return context;
}
