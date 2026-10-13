import type { ExperienceInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * Career timeline, most recent first.
 *
 * Each entry is shown in production only once it has no `needs(…)` markers;
 * the Experience page and navigation link appear as soon as one entry is
 * complete. Dates use "YYYY-MM" (or "YYYY"), and `end` can be "present".
 * Only state titles, dates and results you can stand behind.
 */
const experience: ExperienceInput[] = [
  {
    organization: "Amazon Web Services (AWS)",
    role: needs("Your exact job title at AWS"),
    start: needs("Start month and year, as YYYY-MM"),
    end: needs("End month and year as YYYY-MM, or present"),
    summary: needs("One or two sentences: your team or area and what you were responsible for."),
    highlights: [needs("A concrete responsibility or result, e.g. a system you supported or a process you improved. Only real figures.")],
    technologies: [],
  },
  {
    organization: "Abbott",
    role: needs("Your exact job title at Abbott"),
    start: needs("Start month and year, as YYYY-MM"),
    end: needs("End month and year as YYYY-MM, or present"),
    summary: needs("One or two sentences: the environment you worked in (e.g. enterprise Linux estate) and what you were responsible for."),
    highlights: [needs("A concrete responsibility or result, e.g. patching, troubleshooting, or automation work. Only real figures.")],
    technologies: [],
  },
];

export default experience;
