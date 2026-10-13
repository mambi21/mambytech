import Image from "next/image";
import Link from "next/link";
import { containsOwnerInput } from "@/lib/content/owner-input";
import { projectStatuses, type Media, type Project, type ProjectStatus } from "@/lib/content/schema";
import { OwnerText } from "./owner-text";
import { ExternalIcon, GitHubIcon } from "./icons";
import { ProjectVisual } from "./project-visual";
import { ArrowIcon, cx, Tag } from "./ui";

const statusDot: Record<ProjectStatus, string> = {
  unconfirmed: "border border-dashed border-owner bg-transparent",
  planned: "bg-ink-subtle",
  "in-progress": "bg-[#b7791f]",
  completed: "bg-brand",
  maintained: "bg-brand",
  archived: "bg-rule",
};

export function StatusLabel({ status }: { status: ProjectStatus }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5", status === "unconfirmed" ? "text-owner" : "text-ink-muted")}>
      <span aria-hidden="true" className={cx("size-2 rounded-full", statusDot[status])} />
      <span className="sr-only">Status: </span>
      {projectStatuses[status]}
    </span>
  );
}

export function DraftBadge() {
  return (
    <span className="inline-block rounded-md border border-owner-line bg-owner-bg px-1.5 py-0.5 text-xs font-semibold text-owner">
      Draft · not published
    </span>
  );
}

/** Technologies as a quiet monospace line rather than a row of badges. */
export function TechLine({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cx("font-mono text-[0.8125rem] leading-6 text-ink-subtle", className)}>
      <span className="sr-only">Technologies: </span>
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {containsOwnerInput(item) ? <OwnerText value={item} /> : item}
        </span>
      ))}
    </p>
  );
}

/**
 * A project as a card: thumbnail, title, summary, technologies and actions.
 * The title link stretches over the whole card; repository and live links
 * sit above it so they stay separately clickable.
 */
export function ProjectCard({ project, headingLevel = "h3", preload }: { project: Project; headingLevel?: "h2" | "h3"; preload?: boolean }) {
  const Heading = headingLevel;
  const repo = project.links.find((link) => link.kind === "repository");
  const live = project.links.find((link) => link.kind === "live");
  const shown = project.technologies.slice(0, 4);
  const more = project.technologies.length - shown.length;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-white shadow-[var(--shadow-card)] transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-field/60 hover:shadow-[var(--shadow-lift)] focus-within:shadow-[var(--shadow-lift)]">
      <ProjectVisual
        project={project}
        preload={preload}
        className="border-b border-rule"
        imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
          <span className="font-semibold text-brand">{project.category}</span>
          <span aria-hidden="true" className="text-rule">|</span>
          <StatusLabel status={project.status} />
        </p>
        {project.publication === "draft" ? (
          <p className="mt-2">
            <DraftBadge />
          </p>
        ) : null}
        <Heading className="mt-3 text-[1.25rem] font-bold leading-snug tracking-[-0.015em]">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand">
            {project.title}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
          <OwnerText value={project.summary} />
        </p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {shown.map((item) => (
            <li key={item}>
              {containsOwnerInput(item) ? <OwnerText value={item} /> : <Tag>{item}</Tag>}
            </li>
          ))}
          {more > 0 ? (
            <li>
              <Tag>+{more}</Tag>
            </li>
          ) : null}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brand">
            View project
            <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
          {repo || live ? (
            <span className="relative z-10 flex items-center gap-1">
              {repo ? (
                <a href={repo.href} rel="noopener noreferrer" className="inline-flex size-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-2 hover:text-ink">
                  <GitHubIcon />
                  <span className="sr-only">Source code for {project.title}</span>
                </a>
              ) : null}
              {live ? (
                <a href={live.href} rel="noopener noreferrer" className="inline-flex size-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-2 hover:text-ink">
                  <ExternalIcon className="size-5" />
                  <span className="sr-only">Live site for {project.title}</span>
                </a>
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Three-column grid of project cards. */
export function ProjectGrid({ projects, headingLevel }: { projects: Project[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="reveal">
          <ProjectCard project={project} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

export function ProjectImage({ media, preload }: { media: Media; preload?: boolean }) {
  return (
    <figure>
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        preload={preload}
        sizes="(min-width: 1024px) 720px, 100vw"
        className="h-auto w-full rounded-2xl border border-rule"
      />
      {media.caption ? <figcaption className="mt-3 text-sm text-ink-subtle">{media.caption}</figcaption> : null}
    </figure>
  );
}
