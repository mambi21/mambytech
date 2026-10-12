import aboutInput from "@/content/about";
import profileInput from "@/content/profile";
import projectInputs from "@/content/projects";
import writingInputs from "@/content/writing";
import { isPreview } from "@/lib/preview";
import { containsOwnerInput } from "./owner-input";
import {
  aboutSchema,
  profileSchema,
  projectSchema,
  writingSchema,
  type About,
  type Profile,
  type Project,
  type Writing,
} from "./schema";

/**
 * Content loaders. All content is validated when this module loads, so a
 * mistake in a content file fails the build with a readable message instead
 * of producing a broken page.
 */
function parseAll<T>(label: string, items: unknown[], parse: (item: unknown) => T, key: (item: T) => string): T[] {
  const parsed = items.map((item, index) => {
    try {
      return parse(item);
    } catch (error) {
      throw new Error(`Invalid ${label} #${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  const seen = new Set<string>();
  for (const item of parsed) {
    if (seen.has(key(item))) throw new Error(`Duplicate ${label} slug "${key(item)}"`);
    seen.add(key(item));
  }
  return parsed;
}

const allProjects: Project[] = parseAll("project", projectInputs, (p) => projectSchema.parse(p), (p) => p.slug);
const allWriting: Writing[] = parseAll("writing", writingInputs, (w) => writingSchema.parse(w), (w) => w.slug);
const profileData: Profile = profileSchema.parse(profileInput);
const aboutData: About = aboutSchema.parse(aboutInput);

const isVisible = (item: { publication: "draft" | "published" }) => isPreview || item.publication === "published";

/** Projects visible in this build: published ones, plus drafts in preview mode. */
export function getProjects(): Project[] {
  return allProjects.filter(isVisible);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getWriting(): Writing[] {
  return allWriting.filter(isVisible).sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

/** Profile with unconfirmed skills removed outside preview mode. */
export function getProfile(): Profile {
  if (isPreview) return profileData;
  return {
    ...profileData,
    skillGroups: profileData.skillGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.confirmed),
    })),
  };
}

/** About sections, hiding any that still need owner input outside preview mode. */
export function getAbout(): About {
  if (isPreview) return aboutData;
  return { sections: aboutData.sections.filter((section) => !containsOwnerInput(section)) };
}

/** Everything, ignoring preview mode — used by the content check script. */
export const rawContent = { projects: allProjects, writing: allWriting, profile: profileData, about: aboutData };
