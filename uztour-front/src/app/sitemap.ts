// app/sitemap.ts
import { MetadataRoute } from "next";
import { i18n } from "@/i18n-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://uztours.uz";

  // Static routes
  const staticRoutes = ["", "tours"]; // Add your routes here

  // Generate all localized URLs
  const urls = i18n.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route ? `/${route}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.9,
    }))
  );
  return [
    ...urls,
    // Add any dynamic routes here if needed
  ];
}
