import Image from "next/image";
import type { ReactNode } from "react";
import { hasCaseStudy } from "@/lib/content";
import { containsOwnerInput } from "@/lib/content/owner-input";
import { isPreview } from "@/lib/preview";
import { projectStatuses, type Media, type Project, type ProjectStatus } from "@/lib/content/schema";
import { darkFigures, Plate, ProjectFigure } from "./figures";
import { OwnerText } from "./owner-text";
import { ArrowLink, Container, cx } from "./ui";

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
    <span className={cx("inline-flex items-center gap-2", status === "unconfirmed" ? "text-owner" : "")}>
      <span aria-hidden="true" className={cx("size-2 rounded-full", statusDot[status])} />
      <span className="sr-only">Status: </span>
      {projectStatuses[status]}
    </span>
  );
}

export function DraftBadge({ publication = "draft" }: { publication?: Project["publication"] }) {
  return (
    <span className="type-label inline-block border border-owner-line bg-owner-bg px-1.5 py-0.5 !text-owner">
      {publication === "listed" ? "Listed · no case study yet" : "Draft · not published"}
    </span>
  );
}

/** Technologies as a quiet monospace line. */
export function TechLine({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cx("type-mono", className)}>
      <span className="sr-only">Technologies: </span>
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 ? <span aria-hidden="true"> / </span> : null}
          {containsOwnerInput(item) ? <OwnerText value={item} /> : item}
        </span>
      ))}
    </p>
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
        sizes="(min-width: 1024px) 960px, 100vw"
        className="h-auto w-full border border-rule"
      />
      {media.caption ? <figcaption className="type-mono mt-3 text-[0.8125rem] text-ink-muted">{media.caption}</figcaption> : null}
    </figure>
  );
}

/**
 * The visual that represents a project: a real image when supplied, then its
 * drawn figure, then a plain typographic plate. Nothing decorative stands in
 * for the real system.
 */
export function ProjectPlate({ project, number, preload }: { project: Project; number: string; preload?: boolean }) {
  const image = project.cover ?? project.caseStudy.architecture.diagram ?? project.media[0];
  if (image) {
    return (
      <Plate number={number} caption={image.caption ?? image.alt}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 960px, 100vw" preload={preload} className="h-auto w-full" />
      </Plate>
    );
  }
  if (project.figure) return <ProjectFigure name={project.figure} number={number} />;
  return (
    <Plate number={number} caption={`${project.title} — no figure yet.`}>
      <div className="flex aspect-[16/9] items-end p-4">
        <p className="type-title text-ink-subtle">{project.category}</p>
      </div>
    </Plate>
  );
}

/** Specification list shown with each project: scope, tools, and the state of its case study. */
function Spec({ project, dark, columns }: { project: Project; dark?: boolean; columns?: boolean }) {
  const term = cx("type-label", dark && "text-term-dim");
  const value = cx("mt-2 text-[0.9375rem]", dark ? "text-term-text" : "text-ink");
  const caseStudy = hasCaseStudy(project);
  return (
    <dl className={cx("grid gap-x-8 gap-y-6", columns ? "sm:grid-cols-3" : "")}>
      {project.scope.length > 0 ? (
        <div>
          <dt className={term}>Scope</dt>
          <dd className={value}>
            <ul>
              {project.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
      <div>
        <dt className={term}>Tools</dt>
        <dd className={value}>
          <ul className="type-mono">
            {project.technologies.map((item) => (
              <li key={item}>{containsOwnerInput(item) ? <OwnerText value={item} /> : item}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div>
        <dt className={term}>Case study</dt>
        <dd className={value}>
          {project.status !== "unconfirmed" ? (
            <p className="mb-2">
              <StatusLabel status={project.status} />
            </p>
          ) : null}
          {caseStudy ? (
            <ArrowLink href={`/projects/${project.slug}`} className={dark ? "text-term-prompt" : undefined}>
              Read the case study<span className="sr-only">: {project.title}</span>
            </ArrowLink>
          ) : (
            <p className={dark ? "text-term-dim" : "text-ink-muted"}>In preparation. Problem, decisions, and verified results will be published with it.</p>
          )}
          {isPreview && project.publication !== "published" ? (
            <p className="mt-3">
              <DraftBadge publication={project.publication} />
            </p>
          ) : null}
        </dd>
      </div>
    </dl>
  );
}

/** Problem and contribution, only once they're written. */
function Story({ project, dark }: { project: Project; dark?: boolean }) {
  const show = (value: string) => !containsOwnerInput(value);
  const items = [
    { label: "Problem", value: project.problemSummary },
    { label: "My role", value: project.contributionSummary },
  ].filter((item) => show(item.value));
  if (items.length === 0) return null;
  return (
    <dl className="mt-8 space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <dt className={cx("type-label", dark && "text-term-dim")}>{item.label}</dt>
          <dd className={cx("mt-1.5", dark ? "text-term-text" : "text-ink-muted")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Heading({ project, number, level, dark }: { project: Project; number: string; level: "h2" | "h3"; dark?: boolean }) {
  const H = level;
  return (
    <>
      <p className={cx("type-label", dark && "text-term-dim")}>
        <span className={dark ? "text-term-prompt" : "text-brand"}>{number}</span>
        <span aria-hidden="true"> — </span>
        {project.category}
      </p>
      <H className={cx("type-title mt-4 text-balance", dark && "text-white")}>{project.title}</H>
      <p className={cx("type-lead mt-5", dark && "!text-term-text")}>
        <OwnerText value={project.summary} />
      </p>
    </>
  );
}

/**
 * One project in the showcase. Layouts rotate so consecutive projects never
 * share a composition: a full-width figure, an asymmetric split, and a night
 * band for figures drawn on the dark ground.
 */
export function ProjectFeature({ project, index, level = "h3" }: { project: Project; index: number; level?: "h2" | "h3" }) {
  const number = String(index + 1).padStart(2, "0");
  const dark = project.figure ? darkFigures.has(project.figure) : false;

  if (dark) {
    return (
      <Band id={project.slug}>
        <div className="grid-editorial gap-y-10 py-16 sm:py-24">
          <div className="col-span-12 lg:col-span-5">
            <Heading project={project} number={number} level={level} dark />
            <Story project={project} dark />
            <div className="mt-10">
              <Spec project={project} dark />
            </div>
          </div>
          <div className="reveal col-span-12 lg:col-span-7 lg:pt-2">
            <ProjectPlate project={project} number={number} />
          </div>
        </div>
      </Band>
    );
  }

  if (index % 2 === 0) {
    const Title = level;
    return (
      <article id={project.slug} className="grid-editorial gap-y-10">
        <div className="col-span-12 md:col-span-3">
          <p className="type-label">
            <span className="text-brand">{number}</span>
            <span aria-hidden="true"> — </span>
            {project.category}
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 lg:col-span-8">
          <Title className="type-title text-balance">{project.title}</Title>
          <p className="type-lead mt-5 max-w-[46ch]">
            <OwnerText value={project.summary} />
          </p>
          <Story project={project} />
        </div>
        {/* The first figure can rest at the fold, so it never starts faded. */}
        <div className={cx("col-span-12", index > 0 && "reveal")}>
          <ProjectPlate project={project} number={number} />
        </div>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <Spec project={project} columns />
        </div>
      </article>
    );
  }

  return (
    <article id={project.slug} className="grid-editorial gap-y-10">
      <div className="reveal col-span-12 lg:col-span-7">
        <ProjectPlate project={project} number={number} />
      </div>
      <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-2">
        <Heading project={project} number={number} level={level} />
        <Story project={project} />
        <div className="mt-10 border-t border-rule pt-6">
          <Spec project={project} />
        </div>
      </div>
    </article>
  );
}

/** Full-bleed night band; content stays on the page grid. */
function Band({ id, children }: { id: string; children: ReactNode }) {
  return (
    <article id={id} className="bg-term text-term-text">
      <Container>{children}</Container>
    </article>
  );
}

/** The project showcase: features in order, with the night band breaking out of the page frame. */
export function ProjectShowcase({ projects, level }: { projects: Project[]; level?: "h2" | "h3" }) {
  return (
    <div className="space-y-24 sm:space-y-32">
      {projects.map((project, index) => {
        const dark = project.figure ? darkFigures.has(project.figure) : false;
        const feature = <ProjectFeature key={project.slug} project={project} index={index} level={level} />;
        return dark ? feature : <Container key={project.slug}>{feature}</Container>;
      })}
    </div>
  );
}
