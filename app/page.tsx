import type { Metadata } from "next";
import RealEstateDashboardPage from "@/app/real-estate/page";

export const metadata: Metadata = {
  title: "Nestrova | Real Estate Search & AI Investment Analysis",
  description:
    "Explore real estate opportunities by location, analyze properties with AI, compare investment estimates, and understand potential rental income and risk.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nestrova | Real Estate Search & AI Investment Analysis",
    description:
      "Explore, analyze, and compare real estate investment opportunities with Nestrova.",
    url: "https://nestrovaai.com/",
    siteName: "Nestrova",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <RealEstateDashboardPage />
    </>
  );
}