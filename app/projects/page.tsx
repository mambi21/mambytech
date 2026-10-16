import type { Metadata } from "next";
import { ProjectShowcase } from "@/components/projects";
import { ArrowLink, Container, PageHeader } from "@/components/ui";
import { getShowcaseProjects } from "@/lib/content";
import { projectStatuses } from "@/lib/content/schema";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected work by Ibrahima Mamby Bah: AWS infrastructure, Linux operations and automation, and product engineering, documented as case studies.",
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
  const projects = getShowcaseProjects();

  return (
    <>
      <PageHeader label="Work" title="Selected work">
        <p>
          Projects across cloud networking, Linux operations, and product engineering. Each is shown with what is confirmed
          today; full case studies cover the problem, the decisions, and how the result was verified.
        </p>
      </PageHeader>

      {isPreview ? (
        <Container className="mb-12">
          <p className="border border-dashed border-owner-line bg-owner-bg px-4 py-3 text-[0.9375rem] text-owner">
            Preview: draft projects are shown below. Listed projects appear in production with their confirmed facts only;
            drafts don’t appear at all.
          </p>
        </Container>
      ) : null}

      {projects.length > 0 ? (
        <section aria-label="Projects">
          <ProjectShowcase projects={projects} level="h2" />
        </section>
      ) : (
        <Container>
          <p className="measure border-t border-ink pt-6 text-ink-muted">Case studies are being written up and will appear here.</p>
          <ArrowLink href="/contact" className="mt-5">
            Get in touch
          </ArrowLink>
        </Container>
      )}

      <Container className="mt-24 sm:mt-32">
        <section aria-labelledby="status-heading" className="grid-editorial gap-y-6 border-t border-ink pt-5">
          <h2 id="status-heading" className="type-label col-span-12 md:col-span-3">
            Status labels
          </h2>
          <dl className="col-span-12 grid gap-x-8 gap-y-4 text-[0.9375rem] sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
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
