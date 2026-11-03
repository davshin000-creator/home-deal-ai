import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Real Estate Investment Analysis | Nestrova",
  description:
    "Analyze real estate investments with Nestrova. Review estimated property value, rental income potential, investment metrics, and AI-powered property research.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Real Estate Investment Analysis | Nestrova",
    description:
      "Explore real estate investment analysis and property research.",
    url: "https://nestrovaai.com/",
    siteName: "Nestrova",
    type: "website",
  },
};

export default function RealEstateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}