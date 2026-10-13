import type { MetadataRoute } from "next";
import { getExperience, getProjects, getWriting } from "@/lib/content";
import { isPreview } from "@/lib/preview";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  const paths = [
    "/",
    "/about",
    ...(getExperience().length > 0 ? ["/experience"] : []),
    "/projects",
    ...(getWriting().length > 0 ? ["/blog"] : []),
    "/contact",
    "/privacy",
  ];
  const pages = paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const projects = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const posts = getWriting().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.publishedOn,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...projects, ...posts];
}
