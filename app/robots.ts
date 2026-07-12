import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/analytics-preview/",
          "/brain-console/",
          "/checkout/",
          "/coach/",
          "/compare/",
          "/content-studio/",
          "/dashboard/",
          "/deals/",
          "/documents/",
          "/empty-preview/",
          "/favorites/",
          "/feedback/",
          "/growth/",
          "/intelligence/",
          "/launch-dashboard/",
          "/loading-preview/",
          "/login/",
          "/memo/",
          "/negotiation/",
          "/offer/",
          "/onboarding/",
          "/os/",
          "/portfolio/",
          "/portfolio-health/",
          "/pro/",
          "/report/",
          "/reports/",
          "/watchlist/",
        ],
      },
    ],
    sitemap: "https://nestrovaai.com/sitemap.xml",
    host: "https://nestrovaai.com",
  };
}
