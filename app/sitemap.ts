import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/preview";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  return ["/", "/projects", "/about", "/contact", "/privacy"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
