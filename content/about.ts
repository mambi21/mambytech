import type { AboutInput } from "@/lib/content/schema";
import { needs } from "@/lib/content/owner-input";

/**
 * About page content.
 *
 * The "introduction" section is the page opening. Each section is shown in
 * production only once it no longer contains a `needs(…)` marker. Replace
 * each marker with your own words, or delete sections you don't want.
 * Sections render in this order.
 */
const about: AboutInput = {
  sections: [
    {
      id: "introduction",
      heading: "Introduction",
      paragraphs: [
        "I'm Ibrahima Mamby Bah. MambyTech is where I publish my infrastructure and software work, written up in enough detail to show how each project was designed, built, and checked.",
      ],
    },
    {
      id: "background",
      heading: "Background",
      paragraphs: [
        needs(
          "Add 2–3 sentences about yourself: where you are in your journey (e.g. studying, working, career change), what drew you to infrastructure, and what kind of work or collaboration you are looking for.",
        ),
      ],
    },
    {
      id: "interests",
      heading: "Technical interests",
      paragraphs: [
        needs("Confirm or rewrite these interests so they match what you actually work on and want to be known for."),
      ],
      list: [
        "Cloud architecture: networking, identity, and cost-aware design",
        "Linux systems administration and automation",
        "DevOps practices: version control, CI/CD, and repeatable environments",
        "Software that solves practical problems",
      ],
    },
    {
      id: "approach",
      heading: "Engineering approach",
      paragraphs: [
        needs("This section is a suggested draft. Keep only the principles you genuinely follow, and add an example from your own projects if you can."),
      ],
      list: [
        "Understand the problem and its constraints before choosing tools.",
        "Prefer simple, documented designs that someone else can operate.",
        "Automate repetitive work, and make changes reproducible.",
        "Verify results with evidence — tests, checks, and monitoring — rather than assumptions.",
        "Write down tradeoffs and lessons so the next iteration is better.",
      ],
    },
    {
      id: "learning",
      heading: "Current learning focus",
      paragraphs: [
        needs(
          "List what you are learning right now (for example a specific AWS service, an infrastructure-as-code tool, a Linux topic, or a programming language) and why.",
        ),
      ],
    },
  ],
};

export default about;
