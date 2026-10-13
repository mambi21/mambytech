import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificationCards } from "@/components/certifications";
import { ExperienceTimeline } from "@/components/experience";
import { ArrowLink, Container, PageHeader, SectionHeading } from "@/components/ui";
import { getCertifications, getExperience } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description: "The professional experience of Ibrahima Mamby Bah across Linux administration, DevOps, and cloud infrastructure.",
  path: "/experience",
});

/** Shown only once at least one experience entry is complete (or in preview mode). */
export default function ExperiencePage() {
  const experience = getExperience();
  if (experience.length === 0) notFound();
  const certifications = getCertifications();

  return (
    <>
      <PageHeader label="Experience" title="Career timeline">
        <p>From Linux administration to DevOps and cloud infrastructure engineering.</p>
      </PageHeader>

      <Container className="pt-12">
        <h2 className="sr-only">Roles</h2>
        <div className="max-w-4xl">
          <ExperienceTimeline items={experience} />
        </div>
      </Container>

      {certifications.length > 0 ? (
        <section aria-labelledby="certifications-heading" className="mt-20">
          <Container>
            <SectionHeading id="certifications-heading" title="Certifications" eyebrow="Credentials" />
            <div className="mt-8">
              <CertificationCards items={certifications} />
            </div>
          </Container>
        </section>
      ) : null}

      <Container className="mt-16">
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6">
          <ArrowLink href="/projects">See the projects</ArrowLink>
          <ArrowLink href="/contact">Get in touch</ArrowLink>
        </div>
      </Container>
    </>
  );
}
