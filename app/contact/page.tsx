import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Connect with Ibrahima Mamby Bah on LinkedIn about cloud infrastructure, Linux, DevOps, or software engineering.",
  path: "/contact",
});

/** Contact is LinkedIn: one clearly labelled link to the profile. */
export default function ContactPage() {
  const linkedin = getProfile().links.linkedin;

  return (
    <>
      <PageHeader label="Contact" title="Let’s connect.">
        <p>For engineering opportunities, collaboration, or a conversation about the work, LinkedIn is the best way to reach me.</p>
      </PageHeader>
      <Container className="pb-24">
        <div className="border-t border-ink pt-10">
          {linkedin ? (
            <>
              <a
                href={linkedin.href}
                rel="me noopener noreferrer"
                target="_blank"
                className="group inline-flex min-h-14 items-center gap-3 bg-brand px-7 py-4 text-[1.0625rem] font-semibold text-paper transition-colors hover:bg-brand-hover"
              >
                Connect on LinkedIn
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
                <span className="sr-only"> (opens LinkedIn in a new tab)</span>
              </a>
              <p className="type-mono mt-4 text-[0.8125rem] text-ink-subtle">{linkedin.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}</p>
            </>
          ) : (
            <p className="text-ink-muted">A LinkedIn link will appear here soon.</p>
          )}
        </div>
      </Container>
    </>
  );
}
