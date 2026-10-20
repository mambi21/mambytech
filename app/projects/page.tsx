import type { Metadata } from "next";
import { ConnectSection } from "@/components/connect-section";
import { ProjectShowcase } from "@/components/projects";
import { Container, PageHeader } from "@/components/ui";
import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: "Professional engineering work by Ibrahima Mamby Bah across AWS infrastructure, enterprise Linux, CI/CD, and software development.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <>
      <PageHeader label="Projects" title="Engineering in practice.">
        <p>Professional work across infrastructure, operations, and product development.</p>
      </PageHeader>
      <Container className="mb-10">
        <nav aria-label="Project index" className="flex flex-wrap gap-x-6 gap-y-2 border-y border-rule py-3">
          {projects.map((project) => <a key={project.slug} href={`#${project.slug}`} className="text-link inline-flex min-h-11 items-center text-sm">{project.title}</a>)}
        </nav>
      </Container>
      <section aria-label="Engineering projects" className="pb-16 sm:pb-20"><ProjectShowcase projects={projects} level="h2" /></section>
      <ConnectSection />
    </>
  );
}
