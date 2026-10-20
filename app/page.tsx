import type { Metadata } from "next";
import { CapabilitiesIndex } from "@/components/capabilities";
import { ConnectSection } from "@/components/connect-section";
import { ProjectShowcase } from "@/components/projects";
import { Hero } from "@/components/hero";
import { ArrowLink, Container } from "@/components/ui";
import { getFeaturedProjects, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ibrahima Mamby Bah · MambyTech",
    description: "Ibrahima Mamby Bah: engineer at Amazon Web Services and Co-Founder & CTO of Glomaf, working across cloud infrastructure, Linux, DevOps, security, and platform engineering.",
    path: "/",
  }),
  title: { absolute: "Ibrahima Mamby Bah · MambyTech" },
};

export default function HomePage() {
  const profile = getProfile();
  const projects = getFeaturedProjects();
  return (
    <>
      <Hero profile={profile} />
      <section aria-labelledby="work-heading" className="pt-16 pb-16 sm:pt-20 sm:pb-20">
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
