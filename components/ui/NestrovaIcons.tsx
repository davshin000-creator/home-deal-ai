import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m3 17 6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 3 5 6v5c0 4.8 2.9 8.2 7 10 4.1-1.8 7-5.2 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.6 1.6 3.5-3.8" />
    </svg>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M9.5 4.5A3 3 0 0 0 6 7.4 3.2 3.2 0 0 0 4.5 13a3 3 0 0 0 2.8 4.5A3 3 0 0 0 12 19V6.5a2 2 0 0 0-2.5-2Z" />
      <path d="M14.5 4.5A3 3 0 0 1 18 7.4a3.2 3.2 0 0 1 1.5 5.6 3 3 0 0 1-2.8 4.5A3 3 0 0 1 12 19V6.5a2 2 0 0 1 2.5-2Z" />
      <path d="M8 9.5h2" />
      <path d="M14 9.5h2" />
      <path d="M8.5 14h2" />
      <path d="M13.5 14h2" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M7.2 7.2A7 7 0 0 1 19 10" />
      <path d="M16.8 16.8A7 7 0 0 1 5 14" />
    </svg>
  );
}

export function PortfolioIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="5" width="18" height="15" rx="3" />
      <path d="M8 5V3h8v2" />
      <path d="M3 11h18" />
      <path d="M9 15h6" />
    </svg>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="m12 13 4-4" />
      <path d="M7 17h10" />
      <path d="M6.5 10.5 5 9.5" />
      <path d="M17.5 10.5 19 9.5" />
      <path d="M12 7V5" />
    </svg>
  );
}

export function PulseIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 3 2.8 19h18.4L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m12 3 1.3 4.2L17.5 9l-4.2 1.8L12 15l-1.3-4.2L6.5 9l4.2-1.8L12 3Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

export function MarketsIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  );
}

export function WatchlistIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function CouncilIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c.5-4 2.5-6 5-6s4.5 2 5 6" />
      <path d="M14 15c3.5 0 5.5 1.7 6 5" />
    </svg>
  );
}

export function PropertyIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M8 14h3v3H8Z" />
      <path d="M14 13h3v7h-3Z" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 21V4h10v17" />
      <path d="M15 9h4v12" />
      <path d="M8 7h4" />
      <path d="M8 11h4" />
      <path d="M8 15h4" />
      <path d="M8 19h4" />
      <path d="M18 12h1" />
      <path d="M18 16h1" />
      <path d="M3 21h18" />
    </svg>
  );
}
export function SearchPropertyIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 5 5" />
      <path d="M7 11V8l3-2 3 2v3" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6 3h12v18l-6-4-6 4Z" />
    </svg>
  );
}

export function CompareIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M8 4 4 8l4 4" />
      <path d="M4 8h13" />
      <path d="m16 12 4 4-4 4" />
      <path d="M20 16H7" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

export function BillingIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}

export function DollarIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8.5c-.8-1-2-1.5-4-1.5-2.2 0-3.5 1-3.5 2.5S10 12 12.5 12s3.5 1 3.5 2.5S14.5 17 12 17c-2 0-3.5-.6-4.5-1.7" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function RentIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 15h6" />
      <path d="M12 12v6" />
    </svg>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}
