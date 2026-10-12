import Image from "next/image";
import { containsOwnerInput } from "@/lib/content/owner-input";
import { projectStatuses, type Media, type Project, type ProjectStatus } from "@/lib/content/schema";
import { OwnerText } from "./owner-text";
import { ProjectVisual } from "./project-visual";
import { ArrowLink, cx } from "./ui";

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
    <span className="rounded-sm border border-owner-line bg-owner-bg px-1.5 py-0.5 text-xs font-semibold text-owner">
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

/** A project as an open row: visual, problem, contribution, and a case-study link. */
export function ProjectRow({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="grid gap-6 border-t border-rule py-10 first:border-t-0 first:pt-2 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10 lg:gap-14">
      <ProjectVisual project={project} sizes="(min-width: 768px) 40vw, 100vw" className="self-start" />
      <div className="flex min-w-0 flex-col">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-brand">{project.category}</span>
          <span aria-hidden="true" className="text-rule">|</span>
          <StatusLabel status={project.status} />
          {project.publication === "draft" ? <DraftBadge /> : null}
        </p>
        <Heading className="mt-2 font-serif text-[1.625rem] font-semibold leading-tight">{project.title}</Heading>
        <dl className="mt-5 space-y-4">
          <div>
            <dt className="text-sm font-semibold text-ink">Problem</dt>
            <dd className="mt-1 text-ink-muted">
              <OwnerText value={project.problemSummary} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">My contribution</dt>
            <dd className="mt-1 text-ink-muted">
              <OwnerText value={project.contributionSummary} />
            </dd>
          </div>
        </dl>
        <TechLine items={project.technologies} className="mt-5" />
        <div className="mt-6">
          <ArrowLink href={`/projects/${project.slug}`}>
            Read the case study<span className="sr-only">: {project.title}</span>
          </ArrowLink>
        </div>
      </div>
    </article>
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
        className="h-auto w-full rounded-sm border border-rule"
      />
      {media.caption ? <figcaption className="mt-3 text-sm text-ink-subtle">{media.caption}</figcaption> : null}
    </figure>
  );
}
