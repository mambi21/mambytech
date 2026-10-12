import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { isPreview } from "@/lib/preview";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  const pages = ["/", "/about", "/projects", "/contact", "/privacy"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const projects = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...pages, ...projects];
}
