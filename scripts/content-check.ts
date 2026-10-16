/**
 * Validates all content and lists everything still waiting on owner input.
 * Runs automatically before `npm run build`; invalid content fails the build.
 *
 *   npm run content:check
 */
import { rawContent } from "@/lib/content";
import { listOwnerInput } from "@/lib/content/owner-input";

const { projects, profile, about, writing, experience, certifications } = rawContent;

console.log("Content is valid.\n");

const published = projects.filter((p) => p.publication === "published");
const listed = projects.filter((p) => p.publication === "listed");
const drafts = projects.filter((p) => p.publication === "draft");
console.log(
  `Projects: ${published.length} published, ${listed.length} listed (shown without a case study), ${drafts.length} draft (hidden in production).`,
);
console.log(
  `Blog: ${writing.filter((w) => w.publication === "published").length} published, ${writing.filter((w) => w.publication === "draft").length} draft.`,
);
console.log(`Experience: ${experience.length} entries · Certifications: ${certifications.length}.\n`);

let outstanding = 0;
const report = (label: string, items: string[]) => {
  if (items.length === 0) return;
  outstanding += items.length;
  console.log(`• ${label}`);
  for (const item of items) console.log(`    - ${item}`);
};

for (const project of [...listed, ...drafts]) {
  report(`${project.publication === "listed" ? "Listed" : "Draft"} project "${project.slug}" — case study needs owner input`, [
    ...listOwnerInput(project),
    ...project.ownerChecklist,
  ]);
}
for (const item of experience) {
  report(`Experience › ${item.organization} (hidden in production until resolved)`, listOwnerInput(item));
}
for (const item of certifications) {
  report(`Certification › ${item.name} (hidden in production until resolved)`, listOwnerInput(item));
}
for (const post of writing.filter((w) => w.publication === "draft")) {
  report(`Draft post "${post.slug}"`, listOwnerInput(post));
}
for (const section of about.sections) {
  report(`About › ${section.heading} (hidden in production until resolved)`, listOwnerInput(section));
}
report(
  "Unconfirmed tools in the capabilities index (hidden in production)",
  profile.capabilities.flatMap((area) => area.tools.filter((tool) => !tool.confirmed).map((tool) => `${area.area}: ${tool.name}`)),
);
report(
  "Optional profile links",
  Object.entries(profile.links)
    .filter(([, link]) => !link)
    .map(([key]) => `${key} link not set (hidden until added)`),
);

console.log(outstanding === 0 ? "\nNothing waiting on owner input." : `\n${outstanding} item(s) waiting on owner input.`);
