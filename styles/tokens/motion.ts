export const motion = {
  fast: "duration-150",
  normal: "duration-200",
  slow: "duration-300",
  ease: "ease-out",
  hoverLift: "transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md",
  press: "active:scale-[0.99]",
} as const;

export type NestrovaMotionToken = keyof typeof motion;
