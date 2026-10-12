import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { OwnerPlaceholder, OwnerText } from "@/components/owner-text";
import { projectImage, ProjectVisual } from "@/components/project-visual";
import { DraftBadge, ProjectImage, StatusLabel, TechLine } from "@/components/projects";
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

  return (
    <article>
      <Container className="pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
            <li>
              <Link href="/projects" className="hover:text-ink hover:underline hover:underline-offset-4">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink-muted">
              {project.title}
            </li>
          </ol>
        </nav>

        <header className="mt-8 max-w-4xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-brand">{project.category}</span>
            {project.publication === "draft" ? <DraftBadge /> : null}
          </p>
          <h1 className="type-display mt-3 text-balance">{project.title}</h1>
          <p className="type-lead measure mt-5">
            <OwnerText value={project.summary} />
          </p>
        </header>

        <dl className="mt-10 grid gap-6 border-y border-rule py-6 text-[0.9375rem] sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.5fr)]">
          <div>
            <dt className="type-label">My contribution</dt>
            <dd className="mt-1.5 text-ink">
              <OwnerText value={project.contributionSummary} />
            </dd>
          </div>
          <div>
            <dt className="type-label">Status</dt>
            <dd className="mt-1.5">
              <StatusLabel status={project.status} />
              {project.timeframe ? <span className="block text-ink-subtle">{project.timeframe}</span> : null}
            </dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <dt className="type-label">Stack</dt>
            <dd className="mt-1.5">
              <TechLine items={project.technologies} className="text-ink-muted" />
            </dd>
          </div>
        </dl>

        {/* Real images get the full width; category illustrations stay modest. */}
        <div className={projectImage(project) ? "mt-10 max-w-4xl" : "mt-10 max-w-xl"}>
          <ProjectVisual project={project} sizes="(min-width: 1024px) 896px, 100vw" preload />
          {!projectImage(project) && isPreview ? (
            <p className="mt-2 text-sm text-owner">Preview: this is a category illustration. Add a <code>cover</code> image to show the real project.</p>
          ) : null}
        </div>

        {isPreview && project.ownerChecklist.length > 0 ? (
          <aside aria-labelledby="checklist-heading" className="mt-10 max-w-4xl rounded-sm border border-dashed border-owner-line bg-owner-bg p-5 text-owner">
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

        <div className="mt-14 grid gap-12 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Case study sections" className="hidden lg:block">
            <p className="type-label">Contents</p>
            <ul className="sticky top-24 mt-3 space-y-1.5 text-[0.9375rem]">
              {toc.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-ink-muted hover:text-brand hover:underline hover:underline-offset-4">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="measure min-w-0 space-y-14">
            <CaseSection id="problem" title="Problem">
              <Paragraph value={caseStudy.problem} />
            </CaseSection>

            <CaseSection id="role" title="Role">
              <Paragraph value={caseStudy.role} />
            </CaseSection>

            <CaseSection id="architecture" title="Architecture">
              <Paragraph value={caseStudy.architecture.summary} />
              {caseStudy.architecture.diagram ? (
                <div className="mt-6">
                  <ProjectImage media={caseStudy.architecture.diagram} />
                </div>
              ) : isPreview ? (
                <OwnerPlaceholder className="mt-6">
                  Architecture diagram (optional): add an image in /public and reference it in caseStudy.architecture.diagram.
                </OwnerPlaceholder>
              ) : null}
            </CaseSection>

            <CaseSection id="implementation" title="Implementation">
              <ol className="space-y-4">
                {caseStudy.implementation.map((step, index) => (
                  <li key={index} className="grid grid-cols-[2rem_1fr]">
                    <span aria-hidden="true" className="pt-0.5 font-mono text-sm font-medium text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-ink-muted">
                      <OwnerText value={step} />
                    </p>
                  </li>
                ))}
              </ol>
            </CaseSection>

            <CaseSection id="tradeoffs" title="Tradeoffs">
              <dl className="space-y-6">
                {caseStudy.tradeoffs.map((tradeoff, index) => (
                  <div key={index} className="border-l-2 border-brand pl-5">
                    <dt className="font-semibold">
                      <OwnerText value={tradeoff.decision} />
                    </dt>
                    <dd className="mt-1.5 text-ink-muted">
                      <OwnerText value={tradeoff.rationale} />
                    </dd>
                  </div>
                ))}
              </dl>
            </CaseSection>

            <CaseSection id="verification" title="Verification">
              <BulletList items={caseStudy.verification} />
            </CaseSection>

            <CaseSection id="outcomes" title="Outcomes">
              <BulletList items={caseStudy.outcomes} />
            </CaseSection>

            <CaseSection id="lessons" title="Lessons">
              <BulletList items={caseStudy.lessons} />
            </CaseSection>

            {hasResources || isPreview ? (
              <CaseSection id="resources" title="Links & media">
                {project.links.length > 0 ? (
                  <ul className="space-y-2">
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} rel="noopener noreferrer" className="text-link font-medium">
                          {link.label}
                          <span className="sr-only"> (external {link.kind} link)</span>
                        </a>
                        <span className="ml-2 text-sm text-ink-subtle">{link.kind}</span>
                      </li>
                    ))}
                  </ul>
                ) : isPreview ? (
                  <OwnerPlaceholder>
                    No public links yet. Add repository, live, or documentation links only if they exist and are public.
                  </OwnerPlaceholder>
                ) : null}
                {project.media.length > 0 ? (
                  <div className="mt-8 space-y-8">
                    {project.media.map((media) => (
                      <ProjectImage key={media.src} media={media} />
                    ))}
                  </div>
                ) : null}
              </CaseSection>
            ) : null}

            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-ink pt-6">
              <ArrowLink href="/projects">All projects</ArrowLink>
              <ArrowLink href="/contact">Ask about this project</ArrowLink>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="type-heading">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Paragraph({ value }: { value: string }) {
  return (
    <p className="text-ink-muted">
      <OwnerText value={value} />
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="grid grid-cols-[1.25rem_1fr] text-ink-muted">
          <span aria-hidden="true" className="text-brand">
            –
          </span>
          <span>
            <OwnerText value={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
