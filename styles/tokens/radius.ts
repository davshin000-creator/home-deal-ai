export const radius = {
  sm: "12px",
  md: "20px",
  lg: "28px",
  xl: "36px",
  full: "9999px",
} as const;

export type NestrovaRadiusToken = keyof typeof radius;
