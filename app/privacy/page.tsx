import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, PageHeader } from "@/components/ui";
import { getContactConfig } from "@/lib/contact/config";
import { RATE_LIMIT, usesSharedRateLimiter } from "@/lib/contact/rate-limit";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "What data the MambyTech website collects, why, and which services process it.",
  path: "/privacy",
});

/** Update this date whenever the practices described below change. */
const LAST_UPDATED = "2026-10-09";

/**
 * This page is generated from the site's actual configuration (contact
 * provider, rate-limit store, hosting provider), so it stays accurate when
 * those settings change. Rebuild after changing environment variables.
 */
export default function PrivacyPage() {
  const profile = getProfile();
  const contact = getContactConfig();
  const sharedLimiter = usesSharedRateLimiter();
  const host = process.env.HOSTING_PROVIDER_NAME?.trim();
  const windowMinutes = RATE_LIMIT.windowMs / 60_000;

  return (
    <>
      <PageHeader label="Privacy" title="Privacy notice">
        <p>
          This site is the personal portfolio of {profile.name}. It is designed to collect as little as possible. Last
          updated{" "}
          <time dateTime={LAST_UPDATED}>
            {new Date(LAST_UPDATED + "T00:00:00Z").toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" })}
          </time>
          .
        </p>
      </PageHeader>

      <Container>
        <div className="space-y-12">
          <Block title="In short">
            <ul className="list-disc space-y-2 pl-5">
              <li>No analytics, advertising, or tracking scripts.</li>
              <li>No cookies are set by this site, and there are no visitor accounts.</li>
              <li>Fonts are served from this site, not loaded from a third party.</li>
              <li>The only personal information collected is what you choose to send through the contact form.</li>
            </ul>
          </Block>

          <Block title="Contact form">
            {contact.available ? (
              <>
                <p>
                  When you send a message, the form collects your <strong>name</strong>, <strong>email address</strong>,
                  and <strong>message</strong>. They are used only to read and reply to your message — never for
                  marketing, and never sold or shared for any other purpose.
                </p>
                {contact.provider === "resend" ? (
                  <p>
                    Messages are delivered by email using{" "}
                    <a href="https://resend.com/legal/privacy-policy" rel="noopener noreferrer" className={linkClass}>
                      Resend
                    </a>
                    , which processes the message to deliver it, then arrives in {profile.name}’s email inbox. Messages
                    are kept only as long as needed to respond and follow up.
                  </p>
                ) : (
                  <p>
                    This build uses a local development stub: submissions are discarded and no email is sent.
                  </p>
                )}
                <p>
                  The site does not keep its own copy of your message, and the contents of messages are never written to
                  the site’s logs.
                </p>
              </>
            ) : (
              <p>
                The contact form is currently turned off because it is not connected to an email service, so no
                information is collected through it.
              </p>
            )}
          </Block>

          <Block title="Abuse prevention">
            <p>
              To limit spam, contact-form submissions are rate limited per connection. Your IP address is converted into
              a salted one-way hash, and only that hash and a counter are kept, for up to {windowMinutes} minutes.{" "}
              {sharedLimiter
                ? "These counters are stored with Upstash, a hosted Redis service, so the limit applies consistently across servers."
                : "These counters are kept only in the web server’s memory and are lost when it restarts."}
            </p>
            <p>The form also contains a hidden field and a timing check to detect automated submissions.</p>
          </Block>

          <Block title="Hosting and server logs">
            <p>
              {host ? `This site is hosted by ${host}. ` : null}
              Like any website, the hosting provider receives standard technical information when you visit, such as
              your IP address, browser user agent, and the pages requested, and may keep it in server logs for security
              and reliability, as described in its own privacy policy. This site does not use that information to
              identify or profile visitors.
            </p>
          </Block>

          <Block title="Your choices">
            <p>
              You can ask for any message you sent to be deleted, or ask what information is held about you,
              {contact.available ? (
                <>
                  {" "}
                  by sending a request through the{" "}
                  <Link href="/contact" className={linkClass}>
                    contact form
                  </Link>
                  .
                </>
              ) : (
                " once the contact form is available."
              )}
            </p>
          </Block>
        </div>
      </Container>
    </>
  );
}

const linkClass = "text-link";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-rule pt-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10">
      <h2 className="type-heading">{title}</h2>
      <div className="measure space-y-4 text-ink-muted">{children}</div>
    </section>
  );
}
