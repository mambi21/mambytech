import type { Metadata } from "next";
import { ProjectRow } from "@/components/projects";
import { ArrowLink, Container, PageHeader, SectionHeading } from "@/components/ui";
import { getProjects } from "@/lib/content";
import { projectCategories, projectStatuses } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Cloud infrastructure, Linux, DevOps and software projects by Ibrahima Mamby Bah, each with an honest status and a detailed case study.",
  path: "/projects",
});

const statusHelp: Record<Exclude<keyof typeof projectStatuses, "unconfirmed">, string> = {
  planned: "Designed or scoped, not yet built.",
  "in-progress": "Being built now; details may change.",
  completed: "Finished and no longer changing.",
  maintained: "Finished and still receiving updates.",
  archived: "No longer running; kept for reference.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const groups = projectCategories
    .map((category) => ({
      category,
      id: `category-${category.toLowerCase().replace(/\s+/g, "-")}`,
      items: projects.filter((project) => project.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHeader label="Projects" title="Projects and case studies">
        <p>
          Each case study covers the problem, my role, the architecture, the tradeoffs, and how the result was verified.
          Status labels show where each project actually stands.
        </p>
      </PageHeader>

      <Container>
        {isPreview ? (
          <p className="mb-10 rounded-sm border border-dashed border-owner-line bg-owner-bg px-4 py-3 text-[0.9375rem] text-owner">
            Preview: draft projects are listed below. They stay out of production until their <code className="font-mono">publication</code> is
            set to <code className="font-mono">&quot;published&quot;</code>.
          </p>
        ) : null}

        {groups.length === 0 ? (
          <div className="measure border-t border-ink pt-6">
            <p className="text-ink-muted">
              Case studies are being written up and will be published here once they’re complete.
            </p>
            <ArrowLink href="/contact" className="mt-5">
              Get in touch
            </ArrowLink>
          </div>
        ) : (
          <div className="space-y-16">
            {groups.map((group) => (
              <section key={group.category} aria-labelledby={group.id}>
                <SectionHeading id={group.id} title={group.category}>
                  {group.items.length} {group.items.length === 1 ? "project" : "projects"}
                </SectionHeading>
                <div className="mt-8">
                  {group.items.map((project) => (
                    <ProjectRow key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <section aria-labelledby="status-heading" className="mt-20 border-t border-rule pt-8">
          <h2 id="status-heading" className="type-label">
            About the status labels
          </h2>
          <dl className="mt-4 grid gap-x-10 gap-y-3 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(statusHelp).map(([key, help]) => (
              <div key={key}>
                <dt className="font-semibold">{projectStatuses[key as keyof typeof statusHelp]}</dt>
                <dd className="text-ink-muted">{help}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </>
  );
}
