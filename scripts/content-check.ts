/**
 * Validates all content and lists everything still waiting on owner input.
 * Runs automatically before `npm run build`; invalid content fails the build.
 *
 *   npm run content:check
 */
import { rawContent } from "@/lib/content";
import { listOwnerInput } from "@/lib/content/owner-input";

const { projects, profile, about, writing } = rawContent;

console.log("Content is valid.\n");

const published = projects.filter((p) => p.publication === "published");
const drafts = projects.filter((p) => p.publication === "draft");
console.log(`Projects: ${published.length} published, ${drafts.length} draft (drafts are hidden in production).`);
console.log(`Writing: ${writing.filter((w) => w.publication === "published").length} published.\n`);

let outstanding = 0;
const report = (label: string, items: string[]) => {
  if (items.length === 0) return;
  outstanding += items.length;
  console.log(`• ${label}`);
  for (const item of items) console.log(`    - ${item}`);
};

for (const project of drafts) {
  report(`Draft project "${project.slug}" — needs owner input`, [...listOwnerInput(project), ...project.ownerChecklist]);
}
for (const section of about.sections) {
  report(`About › ${section.heading} (hidden in production until resolved)`, listOwnerInput(section));
}
report(
  "Unconfirmed skills (hidden in production)",
  profile.skillGroups.flatMap((g) => g.items.filter((i) => !i.confirmed).map((i) => `${g.area}: ${i.name}`)),
);
report(
  "Optional profile links",
  Object.entries(profile.links)
    .filter(([, link]) => !link)
    .map(([key]) => `${key} link not set (hidden until added)`),
);

console.log(outstanding === 0 ? "\nNothing waiting on owner input." : `\n${outstanding} item(s) waiting on owner input.`);
