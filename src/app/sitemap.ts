import type { MetadataRoute } from "next";
import { SITE_URL, SITEMAP_ROUTES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SITEMAP_ROUTES.map((slug) => ({
    url: slug ? `${SITE_URL}/${slug}` : SITE_URL,
    lastModified: now,
    changeFrequency: "weekly",
    priority: slug === "" ? 1 : slug === "shop" || slug === "classes" ? 0.9 : 0.7,
  }));
}
