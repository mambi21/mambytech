import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Credentials } from "@/components/capabilities";
import { ExperienceTimeline } from "@/components/experience";
import { ArrowLink, Container, PageHeader } from "@/components/ui";
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

      <Container>
        <h2 className="sr-only">Roles</h2>
        <ExperienceTimeline items={experience} />
        <Credentials items={certifications} className="mt-14" />
      </Container>

      <Container className="mt-20 pb-24">
        <div className="flex flex-wrap gap-x-10 gap-y-3 border-t border-ink pt-6">
          <ArrowLink href="/projects">See the work</ArrowLink>
          <ArrowLink href="/contact">Get in touch</ArrowLink>
        </div>
      </Container>
    </>
  );
}
