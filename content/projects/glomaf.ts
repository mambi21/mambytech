import type { ProjectInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * DRAFT — Glomaf.
 *
 * Known so far: a marketplace with a Next.js web app and a React Native
 * (Expo) mobile app, built on Supabase, including authentication, messaging,
 * and performance work. Everything else is a placeholder. The category below
 * is a temporary guess listed in ownerChecklist — confirm it before publishing.
 */
const project: ProjectInput = {
  slug: "glomaf",
  title: "Glomaf Marketplace",
  summary: "A marketplace with a Next.js web app and a React Native (Expo) mobile app, built on Supabase, including authentication and messaging.",
  problemSummary: needs("One or two sentences: the problem Glomaf solves and for whom."),
  contributionSummary: needs("One or two sentences: your role in building Glomaf."),
  category: "Software Projects",
  technologies: ["Next.js", "React Native", "Expo", "Supabase"],
  scope: ["Web app", "Mobile app", "Authentication", "Messaging", "Performance"],
  figure: "glomaf-platform",
  status: "unconfirmed",
  publication: "listed",
  featured: true,
  ownerChecklist: [
    "Confirm the category (currently a placeholder: Software Projects).",
    "Set `status` honestly — planned, in-progress, completed, maintained or archived.",
    "Add links (repository, live site, documentation) only if they are public.",
    "Add screenshots to /public with alt text, width and height.",
  ],
  caseStudy: {
    problem: needs("What problem does Glomaf solve, and for whom? What existed before, and why wasn't it enough?"),
    role: needs("Your role: founder, sole developer, team member? Which parts did you build?"),
    architecture: {
      summary: needs("High-level architecture: front end, back end, data storage, hosting, and external services, and how they connect."),
    },
    implementation: [
      needs("The main features and how they were built: authentication, messaging, listings."),
      needs("Notable technical challenges and how you approached them, including the performance improvements you made and how you measured them."),
    ],
    tradeoffs: [
      {
        decision: needs("An important design or technology choice."),
        rationale: needs("Why you made it and what it cost."),
      },
    ],
    verification: [needs("How Glomaf is tested or validated: automated tests, user testing, monitoring.")],
    outcomes: [needs("Current results or state of the project. Only include real figures.")],
    lessons: [needs("What building Glomaf taught you.")],
  },
  links: [],
  media: [],
};

export default project;
