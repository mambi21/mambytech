import aboutInput from "@/content/about";
import certificationInputs from "@/content/certifications";
import experienceInputs from "@/content/experience";
import profileInput from "@/content/profile";
import projectInputs from "@/content/projects";
import writingInputs from "@/content/writing";
import { isPreview } from "@/lib/preview";
import { containsOwnerInput } from "./owner-input";
import {
  aboutSchema,
  certificationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  writingSchema,
  type About,
  type Certification,
  type Experience,
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
const allExperience: Experience[] = experienceInputs.map((item, index) => {
  try {
    return experienceSchema.parse(item);
  } catch (error) {
    throw new Error(`Invalid experience #${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
  }
});
const allCertifications: Certification[] = certificationInputs.map((item, index) => {
  try {
    return certificationSchema.parse(item);
  } catch (error) {
    throw new Error(`Invalid certification #${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
  }
});

const isVisible = (item: { publication: string }) => isPreview || item.publication === "published";

/** Projects with a case-study page in this build: published ones, plus every project in preview mode. */
export function getProjects(): Project[] {
  return allProjects.filter(isVisible);
}

/** Projects shown in the work showcase: published and listed ones, plus drafts in preview mode. */
export function getShowcaseProjects(): Project[] {
  return allProjects.filter((project) => isPreview || project.publication !== "draft");
}

export function getFeaturedProjects(): Project[] {
  return getShowcaseProjects().filter((project) => project.featured);
}

/** Whether a project has its own case-study page in this build. */
export function hasCaseStudy(project: Project): boolean {
  return isVisible(project);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

/** Published posts, newest first (plus drafts in preview mode). */
export function getWriting(): Writing[] {
  return allWriting.filter(isVisible).sort((a, b) => (b.publishedOn ?? "9999").localeCompare(a.publishedOn ?? "9999"));
}

export function getPost(slug: string): Writing | undefined {
  return getWriting().find((post) => post.slug === slug);
}

/** Estimated reading time in minutes, at about 220 words per minute. */
export function readingMinutes(post: Writing): number {
  const words = post.body
    .flatMap((block) => (block.type === "list" ? block.items : block.type === "code" ? [block.code] : [block.text]))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Career timeline. Entries that still need owner input are hidden outside preview mode. */
export function getExperience(): Experience[] {
  return isPreview ? allExperience : allExperience.filter((item) => !containsOwnerInput(item));
}

/** Certifications. Entries that still need owner input are hidden outside preview mode. */
export function getCertifications(): Certification[] {
  return isPreview ? allCertifications : allCertifications.filter((item) => !containsOwnerInput(item));
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
  writing: allWriting,
  profile: profileData,
  about: aboutData,
  experience: allExperience,
  certifications: allCertifications,
};
