import Image from "next/image";
import type { Project } from "@/lib/content/schema";
import { ProjectFigure } from "./figures";
import { Container } from "./ui";

export function ProjectFeature({ project, index, level = "h3" }: { project: Project; index: number; level?: "h2" | "h3" }) {
  const Heading = level;
  const Subheading = level === "h2" ? "h3" : "h4";
  const image = project.cover ?? project.media[0];
  return (
    <article id={project.slug} aria-labelledby={`${project.slug}-heading`} className="min-w-0">
      <header className="mb-6 max-w-3xl">
        <p className="type-label text-brand">{project.context}</p>
        <Heading id={`${project.slug}-heading`} className="type-title mt-3 text-balance">{project.title}</Heading>
        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{project.summary}</p>
      </header>
      {image ? (
        <figure className="border border-rule bg-paper-2 p-3 sm:p-5">
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1200px) 1088px, 100vw" className="h-auto w-full" />
          {image.caption ? <figcaption className="mt-3 text-sm text-ink-muted">{image.caption}</figcaption> : null}
        </figure>
      ) : project.figure ? <ProjectFigure name={project.figure} number={String(index + 1).padStart(2, "0")} /> : null}
      <div className="mt-6 grid gap-5 md:grid-cols-[1.3fr_1fr] md:gap-12">
        <div>
          <Subheading className="type-label">My contribution</Subheading>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{project.contribution}</p>
        </div>
        <div>
          <Subheading className="type-label">Technologies</Subheading>
          <ul aria-label={`${project.title} technologies`} className="type-mono mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            {project.technologies.map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
        </div>
      </div>
      {project.links.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-6">
          {project.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex min-h-11 items-center gap-1 text-sm font-semibold">{link.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></li>)}
        </ul>
      ) : null}
    </article>
  );
}

export function ProjectShowcase({ projects, level }: { projects: Project[]; level?: "h2" | "h3" }) {
  return (
    <Container className="space-y-14 sm:space-y-16">
      {projects.map((project, index) => <div key={project.slug} className={index > 0 ? "border-t border-rule pt-12" : undefined}><ProjectFeature project={project} index={index} level={level} /></div>)}
    </Container>
  );
}
