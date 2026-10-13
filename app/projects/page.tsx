import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects";
import { ArrowLink, Container, PageHeader } from "@/components/ui";
import { getProjects } from "@/lib/content";
import { projectStatuses } from "@/lib/content/schema";
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

  return (
    <>
      <PageHeader label="Projects" title="Projects and case studies">
        <p>
          Each case study covers the problem, my role, the architecture, the tradeoffs, and how the result was verified.
          Status labels show where each project actually stands.
        </p>
      </PageHeader>

      <Container className="pt-12">
        {isPreview ? (
          <p className="mb-10 rounded-xl border border-dashed border-owner-line bg-owner-bg px-4 py-3 text-[0.9375rem] text-owner">
            Preview: draft projects are listed below. They stay out of production until their <code className="font-mono">publication</code> is
            set to <code className="font-mono">&quot;published&quot;</code>.
          </p>
        ) : null}

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-field/50 bg-white/60 px-6 py-10 text-center">
            <p className="mx-auto max-w-md text-ink-muted">
              Case studies are being written up and will be published here once they’re complete.
            </p>
            <ArrowLink href="/contact" className="mt-4">
              Get in touch
            </ArrowLink>
          </div>
        ) : (
          <>
            <h2 className="sr-only">All projects</h2>
            <ProjectGrid projects={projects} />
          </>
        )}

        <section aria-labelledby="status-heading" className="mt-20 rounded-2xl border border-rule bg-paper-2/60 p-6 sm:p-8">
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
