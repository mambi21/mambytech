import aboutInput from "@/content/about";
import profileInput from "@/content/profile";
import projectInputs from "@/content/projects";
import { isPreview } from "@/lib/preview";
import { containsOwnerInput } from "./owner-input";
import {
  aboutSchema,
  profileSchema,
  projectSchema,
  type About,
  type Profile,
  type Project,
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
const profileData: Profile = profileSchema.parse(profileInput);
const aboutData: About = aboutSchema.parse(aboutInput);
const isVisible = (item: { publication: string }) => isPreview || item.publication === "published";

/** Complete project entries shown directly on the Projects page. */
export function getProjects(): Project[] {
  return allProjects.filter(isVisible);
}

/** Projects marked `featured`, shown on the home page. */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

/** Profile with unconfirmed tools (and areas left without any) removed outside preview mode. */
export function getProfile(): Profile {
  if (isPreview) return profileData;
  return {
    ...profileData,
    capabilities: profileData.capabilities
      .map((area) => ({ ...area, tools: area.tools.filter((tool) => tool.confirmed) }))
      .filter((area) => area.tools.length > 0),
  };
}

/** About sections, hiding any that still need owner input outside preview mode. */
export function getAbout(): About {
  if (isPreview) return aboutData;
  return { sections: aboutData.sections.filter((section) => !containsOwnerInput(section)) };
}

/** Everything, ignoring preview mode — used by the content check script. */
export const rawContent = {
  projects: allProjects,
  profile: profileData,
  about: aboutData,
};
