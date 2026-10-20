import type { Metadata } from "next";
import { CapabilitiesIndex } from "@/components/capabilities";
import { ConnectSection } from "@/components/connect-section";
import { ProjectShowcase } from "@/components/projects";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import { getFeaturedProjects, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ibrahima Mamby Bah · MambyTech",
    description: "Professional work in cloud infrastructure, enterprise Linux, DevOps, and software engineering by Ibrahima Mamby Bah.",
    path: "/",
  }),
  title: { absolute: "Ibrahima Mamby Bah · MambyTech" },
};

export default function HomePage() {
  const profile = getProfile();
  const projects = getFeaturedProjects();
  return (
    <>
      <Container className="py-14 sm:py-20">
        <p className="type-label text-brand">{profile.name}</p>
        <h1 className="type-hero mt-5 max-w-[20ch] text-balance">{profile.headline}</h1>
        <p className="mt-6 max-w-[42rem] text-lg leading-relaxed text-ink-muted sm:text-xl">{profile.introduction}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/projects">Explore projects</ButtonLink>
          <ArrowLink href="/about">About me</ArrowLink>
        </div>
      </Container>
      <section aria-labelledby="work-heading" className="pb-16 sm:pb-20">
        <Container className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-8">
            <h2 id="work-heading" className="type-heading">Selected engineering work</h2>
            <ArrowLink href="/projects" className="text-sm">All projects</ArrowLink>
          </div>
        </Container>
        <ProjectShowcase projects={projects} level="h3" />
      </section>
      <section aria-labelledby="capabilities-heading" className="pb-16 sm:pb-20">
        <Container>
          <h2 id="capabilities-heading" className="type-heading border-t border-rule pt-8">Technical capabilities</h2>
          <CapabilitiesIndex capabilities={profile.capabilities} />
        </Container>
      </section>
      <ConnectSection />
    </>
  );
}
