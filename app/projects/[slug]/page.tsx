import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { OwnerPlaceholder, OwnerText } from "@/components/owner-text";
import { DraftBadge, ProjectImage, ProjectPlate, StatusLabel, TechLine } from "@/components/projects";
import { ArrowLink, Container } from "@/components/ui";
import { getProject, getProjects } from "@/lib/content";
import { listOwnerInput } from "@/lib/content/owner-input";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = listOwnerInput(project.summary).length ? `Draft case study: ${project.title}.` : project.summary;
  return pageMetadata({ title: project.title, description, path: `/projects/${project.slug}` });
}

const sections = [
  { id: "problem", label: "Problem" },
  { id: "role", label: "Role" },
  { id: "architecture", label: "Architecture" },
  { id: "implementation", label: "Implementation" },
  { id: "tradeoffs", label: "Tradeoffs" },
  { id: "verification", label: "Verification" },
  { id: "outcomes", label: "Outcomes" },
  { id: "lessons", label: "Lessons" },
  { id: "resources", label: "Links & media" },
] as const;

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const hasResources = project.links.length > 0 || project.media.length > 0;
  const toc = sections.filter((section) => section.id !== "resources" || hasResources || isPreview);
  const number = (id: string) => String(toc.findIndex((section) => section.id === id) + 1).padStart(2, "0");

  return (
    <article>
      <Container className="pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb">
          <ol className="type-label flex flex-wrap items-center gap-2">
            <li>
              <Link href="/projects" className="link-draw hover:text-ink">
                Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {project.title}
            </li>
          </ol>
        </nav>

        <header className="grid-editorial mt-12 gap-y-6 sm:mt-16">
          <div className="col-span-12 space-y-3 md:col-span-3 md:pt-3">
            <p className="type-label text-brand">Case study · {project.category}</p>
            {project.publication !== "published" ? <DraftBadge publication={project.publication} /> : null}
          </div>
          <div className="col-span-12 md:col-span-9">
            <h1 className="type-display max-w-[18ch] text-balance">{project.title}</h1>
            <p className="type-lead measure mt-6">
              <OwnerText value={project.summary} />
            </p>
          </div>
        </header>

        <dl className="grid-editorial mt-14 gap-y-6 border-y border-ink py-6 text-[0.9375rem]">
          <div className="col-span-12 md:col-span-5 md:col-start-4">
            <dt className="type-label">My contribution</dt>
            <dd className="mt-2">
              <OwnerText value={project.contributionSummary} />
            </dd>
          </div>
          <div className="col-span-6 md:col-span-2">
            <dt className="type-label">Status</dt>
            <dd className="mt-2">
              <StatusLabel status={project.status} />
              {project.timeframe ? <span className="block text-ink-subtle">{project.timeframe}</span> : null}
            </dd>
          </div>
          <div className="col-span-6 md:col-span-2">
            <dt className="type-label">Stack</dt>
            <dd className="mt-2">
              <TechLine items={project.technologies} className="text-ink-muted" />
            </dd>
          </div>
        </dl>

        <div className="mt-14">
          <ProjectPlate project={project} number="01" preload />
        </div>

        {isPreview && project.ownerChecklist.length > 0 ? (
          <aside aria-labelledby="checklist-heading" className="mt-12 border border-dashed border-owner-line bg-owner-bg p-5 text-owner">
            <h2 id="checklist-heading" className="text-sm font-semibold uppercase tracking-wide">
              Before publishing — owner checklist
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
              {project.ownerChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="grid-editorial mt-20 sm:mt-28">
          <nav aria-label="Case study sections" className="col-span-3 hidden lg:block">
            <ol className="type-label sticky top-28 space-y-2.5">
              {toc.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="link-draw hover:text-ink">
                    <span className="text-brand">{number(section.id)}</span> {section.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="col-span-12 min-w-0 space-y-16 lg:col-span-8">
            <CaseSection id="problem" number={number("problem")} title="Problem">
              <Paragraph value={caseStudy.problem} />
            </CaseSection>

            <CaseSection id="role" number={number("role")} title="Role">
              <Paragraph value={caseStudy.role} />
            </CaseSection>

            <CaseSection id="architecture" number={number("architecture")} title="Architecture">
              <Paragraph value={caseStudy.architecture.summary} />
              {caseStudy.architecture.diagram && project.cover ? (
                <div className="mt-8">
                  <ProjectImage media={caseStudy.architecture.diagram} />
                </div>
              ) : null}
            </CaseSection>

            <CaseSection id="implementation" number={number("implementation")} title="Implementation">
              <ol className="border-t border-rule">
                {caseStudy.implementation.map((step, index) => (
                  <li key={index} className="grid grid-cols-[3rem_1fr] border-b border-rule py-4">
                    <span aria-hidden="true" className="type-mono text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-ink-muted">
                      <OwnerText value={step} />
                    </p>
                  </li>
                ))}
              </ol>
            </CaseSection>

            <CaseSection id="tradeoffs" number={number("tradeoffs")} title="Tradeoffs">
              <dl className="space-y-8">
                {caseStudy.tradeoffs.map((tradeoff, index) => (
                  <div key={index} className="border-l border-brand pl-6">
                    <dt className="type-subheading">
                      <OwnerText value={tradeoff.decision} />
                    </dt>
                    <dd className="mt-2 text-ink-muted">
                      <OwnerText value={tradeoff.rationale} />
                    </dd>
                  </div>
                ))}
              </dl>
            </CaseSection>

            <CaseSection id="verification" number={number("verification")} title="Verification">
              <BulletList items={caseStudy.verification} />
            </CaseSection>

            <CaseSection id="outcomes" number={number("outcomes")} title="Outcomes">
              <BulletList items={caseStudy.outcomes} />
            </CaseSection>

            <CaseSection id="lessons" number={number("lessons")} title="Lessons">
              <BulletList items={caseStudy.lessons} />
            </CaseSection>

            {hasResources || isPreview ? (
              <CaseSection id="resources" number={number("resources")} title="Links & media">
                {project.links.length > 0 ? (
                  <ul className="space-y-2">
                    {project.links.map((link) => (
                      <li key={link.href} className="flex flex-wrap items-baseline gap-3">
                        <a href={link.href} rel="noopener noreferrer" className="text-link font-semibold">
                          {link.label}
                          <span className="sr-only"> (external {link.kind} link)</span>
                        </a>
                        <span className="type-label">{link.kind}</span>
                      </li>
                    ))}
                  </ul>
                ) : isPreview ? (
                  <OwnerPlaceholder>No public links yet. Add repository, live, or documentation links only if they exist and are public.</OwnerPlaceholder>
                ) : null}
                {project.media.length > 0 ? (
                  <div className="mt-8 space-y-10">
                    {project.media.map((media) => (
                      <ProjectImage key={media.src} media={media} />
                    ))}
                  </div>
                ) : null}
              </CaseSection>
            ) : null}

            <div className="flex flex-wrap gap-x-10 gap-y-3 border-t border-ink pt-6">
              <ArrowLink href="/projects">All work</ArrowLink>
              <ArrowLink href="/contact">Ask about this project</ArrowLink>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}

function CaseSection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid grid-cols-[3rem_1fr] gap-y-5 border-t border-ink pt-5">
      <p aria-hidden="true" className="type-label pt-1.5 text-brand">
        {number}
      </p>
      <h2 id={id} className="type-heading">
        {title}
      </h2>
      <div className="col-start-2">{children}</div>
    </section>
  );
}

function Paragraph({ value }: { value: string }) {
  return (
    <p className="measure text-ink-muted">
      <OwnerText value={value} />
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="measure space-y-3">
      {items.map((item, index) => (
        <li key={index} className="grid grid-cols-[1.5rem_1fr] text-ink-muted">
          <span aria-hidden="true" className="type-mono text-brand">
            →
          </span>
          <span>
            <OwnerText value={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
