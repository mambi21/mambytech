import Link from "next/link";
import { hasCaseStudy } from "@/lib/content";
import type { Certification, Profile, Project } from "@/lib/content/schema";
import { formatMonth } from "@/lib/format";
import { cx } from "./ui";

/**
 * The capabilities index: each area of work as a row, with what I do there,
 * the tools, and links to the projects that show it. No proficiency scores.
 */
export function CapabilitiesIndex({ capabilities, projects }: { capabilities: Profile["capabilities"]; projects: Project[] }) {
  const bySlug = new Map(projects.map((project, index) => [project.slug, { project, number: String(index + 1).padStart(2, "0") }]));

  return (
    <div>
      <div aria-hidden="true" className="type-label hidden grid-cols-12 gap-x-8 border-b border-ink pb-3 lg:grid">
        <span className="col-span-3">Area</span>
        <span className="col-span-4">What I do</span>
        <span className="col-span-3">Tools</span>
        <span className="col-span-2">Evidence</span>
      </div>
      <ol>
        {capabilities.map((area, index) => {
          const evidence = area.evidence.map((slug) => bySlug.get(slug)).filter((item) => item !== undefined);
          return (
            <li key={area.area} className="group grid grid-cols-12 gap-x-8 gap-y-3 border-b border-rule py-6 transition-colors hover:border-ink lg:py-7">
              <h3 className="col-span-12 flex items-baseline gap-4 lg:col-span-3">
                <span aria-hidden="true" className="type-label w-6 shrink-0 transition-colors group-hover:text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="type-subheading text-[1.25rem] [font-stretch:92%]">{area.area}</span>
              </h3>
              <p className="col-span-12 pl-10 text-ink-muted lg:col-span-4 lg:pl-0">{area.summary}</p>
              <ul className="type-mono col-span-12 flex flex-wrap gap-x-4 gap-y-0.5 pl-10 lg:col-span-3 lg:block lg:pl-0" aria-label={`${area.area} tools`}>
                {area.tools.map((tool) => (
                  <li key={tool.name} className={tool.confirmed ? "text-ink" : "text-owner"}>
                    {tool.name}
                    {tool.confirmed ? null : (
                      <>
                        <span aria-hidden="true"> ?</span>
                        <span className="sr-only"> (unconfirmed)</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <div className="col-span-12 pl-10 lg:col-span-2 lg:pl-0">
                {evidence.length > 0 ? (
                  <ul className="space-y-1 text-[0.9375rem]">
                    {evidence.map(({ project, number }) => (
                      <li key={project.slug}>
                        <Link
                          href={hasCaseStudy(project) ? `/projects/${project.slug}` : `/projects#${project.slug}`}
                          className="link-draw inline-flex gap-2 text-brand"
                        >
                          <span className="type-mono text-[0.8125rem]">{number}</span>
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="sr-only">No linked project yet.</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Certifications as plain lines. Only the details that have been provided are shown. */
export function Credentials({ items, className }: { items: Certification[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={cx("grid grid-cols-12 gap-x-8 gap-y-3", className)}>
      <h3 className="type-label col-span-12 lg:col-span-3">Credentials</h3>
      <ul className="col-span-12 space-y-3 lg:col-span-9">
        {items.map((item) => (
          <li key={item.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="type-mono font-medium text-brand">{item.abbreviation}</span>
            <span className="font-semibold">{item.name}</span>
            <span className="text-ink-muted">
              {item.issuer}
              {item.issued ? <> · <time dateTime={item.issued}>{formatMonth(item.issued)}</time></> : null}
              {item.credentialId ? <span className="type-mono text-[0.8125rem]"> · ID {item.credentialId}</span> : null}
            </span>
            {item.verifyUrl ? (
              <a href={item.verifyUrl} rel="noopener noreferrer" className="link-draw text-[0.9375rem] font-semibold text-brand">
                Verify<span className="sr-only"> {item.name} credential</span>
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
