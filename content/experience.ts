import type { ExperienceInput } from "@/lib/content/schema";

/**
 * Career timeline, most recent first. Intentionally empty: the site shows
 * capabilities rather than a résumé. While this list is empty, the
 * Experience page, its navigation link and the home-page section don't exist.
 *
 * Entry shape, if ever wanted: organization, role, start ("YYYY-MM"),
 * end ("YYYY-MM" or "present"), summary, and optional location, highlights
 * and technologies.
 */
const experience: ExperienceInput[] = [];

export default experience;
