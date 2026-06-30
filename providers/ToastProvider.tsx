"use client";

import { createContext, useContext, useState } from "react";
import Toast from "@/components/ui/Toast";

type ToastVariant = "success" | "error" | "info" | "warning";

type ToastState = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: ToastState) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(nextToast: ToastState) {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 3200);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        show={!!toast}
        title={toast?.title || ""}
        description={toast?.description}
        variant={toast?.variant || "info"}
        onClose={() => setToast(null)}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
