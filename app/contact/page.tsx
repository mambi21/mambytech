import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { Container, PageHeader } from "@/components/ui";
import { getContactConfig } from "@/lib/contact/config";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Ibrahima Mamby Bah about cloud infrastructure, Linux, DevOps or software projects.",
  path: "/contact",
});

export default function ContactPage() {
  const profile = getProfile();
  const { available } = getContactConfig();
  const social = Object.values(profile.links).filter((link) => link !== undefined);

  return (
    <>
      <PageHeader label="Contact" title="Get in touch">
        <p>Send a message about a project, a question, or an opportunity. I’ll reply by email.</p>
      </PageHeader>

      <Container className="pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10">
          <section aria-label="Contact form" className="rounded-2xl border border-rule bg-white p-6 shadow-[var(--shadow-card)] sm:p-10">
            {available ? (
              <ContactForm />
            ) : (
              <div role="status" className="measure">
                <h2 className="type-heading">The contact form isn’t available yet</h2>
                <p className="mt-3 text-ink-muted">
                  It hasn’t been connected to an email service, so it can’t deliver messages right now. Rather than accept a
                  message that would never arrive, the form stays off until delivery is set up.
                </p>
                <p className="mt-3 text-ink-muted">
                  {social.length > 0 ? "In the meantime, you can reach me through the links on this page." : "Please check back soon."}
                </p>
              </div>
            )}
          </section>

          <aside aria-label="About your message" className="space-y-8 self-start rounded-2xl border border-rule bg-paper-2/60 p-6 text-[0.9375rem] sm:p-8">
            <div>
              <h2 className="font-semibold">What happens next</h2>
              <p className="mt-2 text-ink-muted">
                Your message goes by email to {profile.name}. Your name and email are used only to reply, and nothing is
                added to a mailing list.
              </p>
              <p className="mt-2 text-ink-muted">
                Details are in the{" "}
                <Link href="/privacy" className="text-link">
                  privacy notice
                </Link>
                .
              </p>
            </div>
            {social.length > 0 ? (
              <div>
                <h2 className="font-semibold">Elsewhere</h2>
                <ul className="mt-2 space-y-1.5">
                  {social.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} rel="me noopener noreferrer" className="text-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </>
  );
}
