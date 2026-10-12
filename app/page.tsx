import type { Metadata } from "next";
import { ProjectRow } from "@/components/projects";
import { SkillsPanel } from "@/components/skills";
import { Terminal } from "@/components/terminal";
import { ArrowLink, ButtonLink, Container, SectionHeading } from "@/components/ui";
import { getFeaturedProjects, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ibrahima Mamby Bah · MambyTech",
    description:
      "Ibrahima Mamby Bah — Building Infrastructure. Engineering Solutions. Cloud infrastructure, Linux, DevOps and software projects.",
    path: "/",
  }),
  title: { absolute: "Ibrahima Mamby Bah · MambyTech" },
};

export default function HomePage() {
  const profile = getProfile();
  const featured = getFeaturedProjects();
  const handle = profile.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      <section aria-labelledby="intro-heading">
        <Container className="grid items-center gap-10 pt-12 pb-14 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:pt-20 lg:pb-20">
          <div className="min-w-0">
            <h1 id="intro-heading" className="type-display text-balance">
              {profile.name}
            </h1>
            <p className="type-lead measure mt-5">{profile.introduction}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ButtonLink href="/projects">Explore Projects</ButtonLink>
              <ArrowLink href="/contact">Get in touch</ArrowLink>
            </div>
          </div>
          <div className="w-full min-w-0 max-w-md lg:justify-self-end">
            <Terminal handle={handle} focus={profile.focusAreas} motto={profile.tagline} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="work-heading">
        <Container>
          <SectionHeading id="work-heading" title="Selected work">
            {featured.length > 0 ? <ArrowLink href="/projects">All projects</ArrowLink> : null}
          </SectionHeading>
          {featured.length > 0 ? (
            <div className="mt-8">
              {featured.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="measure mt-6 text-ink-muted">
              Case studies are being written up and will be published here once they’re complete.
            </p>
          )}
        </Container>
      </section>

      <section aria-labelledby="focus-heading" className="mt-16 sm:mt-24">
        <Container>
          <SectionHeading id="focus-heading" title="Technical focus">
            {isPreview ? <span className="text-owner">Preview: “?” marks unconfirmed skills, hidden in production.</span> : null}
          </SectionHeading>
          <div className="mt-8">
            <SkillsPanel groups={profile.skillGroups} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="contact-heading" className="mt-16 sm:mt-24">
        <Container>
          <div className="flex flex-col gap-4 border-t border-ink pt-6 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 id="contact-heading" className="type-heading">
              Questions about a project?
            </h2>
            <ArrowLink href="/contact">Send a message</ArrowLink>
          </div>
        </Container>
      </section>
    </>
  );
}
