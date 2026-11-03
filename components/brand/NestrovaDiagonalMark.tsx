import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLSpanElement> &
  Record<string, unknown>;

export default function NestrovaDiagonalMark({
  className = "h-10 w-10",
}: Props) {
  return (
    <span className={`inline-flex shrink-0 overflow-hidden ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="block h-full w-full"
        role="img"
        aria-label="Nestrova"
      >
        <rect
          width="100"
          height="100"
          rx="22"
          fill="#0D1729"
        />
        <path
          d="M24 75V25L76 75V25"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 77L78 23"
          fill="none"
          stroke="#46C8B5"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}