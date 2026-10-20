/**
 * Validates all content and lists anything still waiting on owner input.
 * Runs automatically before `npm run build`; invalid content fails the build.
 *
 *   npm run content:check
 */
import { rawContent } from "@/lib/content";
import { listOwnerInput } from "@/lib/content/owner-input";

const { projects, profile, about } = rawContent;

console.log("Content is valid.\n");

const published = projects.filter((p) => p.publication === "published");
const drafts = projects.filter((p) => p.publication === "draft");
console.log(`Projects: ${published.length} published, ${drafts.length} draft (drafts are hidden in production).\n`);

let outstanding = 0;
const report = (label: string, items: string[]) => {
  if (items.length === 0) return;
  outstanding += items.length;
  console.log(`• ${label}`);
  for (const item of items) console.log(`    - ${item}`);
};

for (const project of drafts) {
  report(`Draft project "${project.slug}"`, listOwnerInput(project));
}
for (const section of about.sections) {
  report(`About › ${section.heading} (hidden in production until resolved)`, listOwnerInput(section));
}
report(
  "Unconfirmed tools (hidden in production)",
  profile.capabilities.flatMap((area) => area.tools.filter((tool) => !tool.confirmed).map((tool) => `${area.area}: ${tool.name}`)),
);
report(
  "Optional profile links",
  Object.entries(profile.links)
    .filter(([, link]) => !link)
    .map(([key]) => `${key} link not set (hidden until added)`),
);

console.log(outstanding === 0 ? "\nNothing waiting on owner input." : `\n${outstanding} item(s) waiting on owner input.`);
