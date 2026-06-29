export const typography = {
  displayXL: "text-6xl font-semibold tracking-[-0.05em]",
  displayLG: "text-5xl font-semibold tracking-[-0.04em]",
  heading: "text-4xl font-semibold tracking-[-0.03em]",
  title: "text-2xl font-semibold tracking-[-0.02em]",
  body: "text-base leading-7",
  caption: "text-sm leading-6",
  micro: "text-xs font-semibold uppercase tracking-[0.18em]",
} as const;

export type NestrovaTypographyToken = keyof typeof typography;
