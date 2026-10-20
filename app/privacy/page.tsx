import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container, PageHeader } from "@/components/ui";
import { getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "What data the MambyTech website collects, why, and which services process it.",
  path: "/privacy",
});

/** Update this date whenever the practices described below change. */
const LAST_UPDATED = "2026-10-20";

/**
 * The site collects nothing itself: no forms, cookies, analytics or accounts.
 * The hosting provider is named from HOSTING_PROVIDER_NAME at build time.
 */
export default function PrivacyPage() {
  const profile = getProfile();
  const host = process.env.HOSTING_PROVIDER_NAME?.trim();

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

      <Container className="pb-24">
        <div className="space-y-12">
          <Block title="In short">
            <ul className="list-disc space-y-2 pl-5">
              <li>No analytics, advertising, or tracking scripts.</li>
              <li>No cookies are set by this site, and there are no forms or visitor accounts.</li>
              <li>Fonts are served from this site, not loaded from a third party.</li>
            </ul>
          </Block>

          <Block title="LinkedIn">
            <p>
              The Contact page links to {profile.name}’s LinkedIn profile. Nothing is sent to LinkedIn until you follow that
              link; after that, LinkedIn’s own privacy policy applies.
            </p>
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
        </div>
      </Container>
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-rule pt-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10">
      <h2 className="type-heading">{title}</h2>
      <div className="measure space-y-4 text-ink-muted">{children}</div>
    </section>
  );
}
