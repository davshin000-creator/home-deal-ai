export const shadows = {
  none: "shadow-none",
  soft: "shadow-sm",
  medium: "shadow-md",
  floating: "shadow-2xl",
} as const;

export type NestrovaShadowToken = keyof typeof shadows;
