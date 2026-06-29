export const colors = {
  surface: "#FAFAFA",
  surfaceSecondary: "#F5F5F5",
  surfaceElevated: "#FFFFFF",
  surfaceInverse: "#0A0A0A",
  border: "rgba(0,0,0,0.10)",
  borderLight: "rgba(0,0,0,0.06)",
  borderStrong: "rgba(0,0,0,0.18)",
  textPrimary: "#111111",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textInverse: "#FFFFFF",
  accent: "#111111",
  ai: "#4F46E5",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
} as const;

export type NestrovaColorToken = keyof typeof colors;
