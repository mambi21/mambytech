import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { CapabilitiesIndex, Credentials } from "@/components/capabilities";
import { ExperienceTimeline } from "@/components/experience";
import { OwnerPlaceholder, OwnerText } from "@/components/owner-text";
import { ArrowLink, Container, SectionHead } from "@/components/ui";
import { getAbout, getCertifications, getExperience, getProfile, getShowcaseProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Ibrahima Mamby Bah, Cloud Infrastructure & Linux Engineer: background, capabilities, credentials, and engineering approach.",
  path: "/about",
});

export default function AboutPage() {
  const profile = getProfile();
  const { sections } = getAbout();
  const experience = getExperience();
  const certifications = getCertifications();
  const projects = getShowcaseProjects();
  const intro = sections.find((section) => section.id === "introduction");
  const rest = sections.filter((section) => section !== intro);

  return (
    <>
      <Container className="pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid-editorial gap-y-12">
          <p className="type-label col-span-12 md:col-span-3 md:pt-4">About</p>
          <div className="col-span-12 md:col-span-9 lg:col-span-6">
            <h1 className="type-display text-balance">{profile.name}</h1>
            <p className="mt-4 text-[1.375rem] font-semibold tracking-[-0.015em] text-brand">{profile.role}</p>
            {intro ? (
              <div className="mt-8 space-y-5 text-[1.1875rem] leading-relaxed text-ink-muted">
                {intro.paragraphs.map((paragraph, i) => (
                  <p key={i} className={i === 0 ? "text-ink" : undefined}>
                    <OwnerText value={paragraph} />
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <aside aria-label="Fact sheet" className="col-span-12 md:col-span-9 md:col-start-4 lg:col-span-3 lg:col-start-10">
            {profile.portrait ? (
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                sizes="(min-width: 1024px) 320px, 100vw"
                preload
                className="mb-8 aspect-[4/5] w-full object-cover"
              />
            ) : isPreview ? (
              <OwnerPlaceholder className="mb-8">Optional portrait: add a photo to /public and set <code>portrait</code> in content/profile.ts.</OwnerPlaceholder>
            ) : null}
            <dl className="border-t border-ink text-[0.9375rem]">
              <Fact term="Role">{profile.role}</Fact>
              <Fact term="Focus">{profile.focusAreas.join(", ")}</Fact>
              {certifications.length > 0 ? <Fact term="Certified">{certifications.map((c) => c.abbreviation).join(", ")}</Fact> : null}
              <Fact term="Site">{profile.brand}</Fact>
            </dl>
          </aside>
        </div>
      </Container>

      {rest.length > 0 ? (
        <Container className="pb-24 sm:pb-32">
          <div className="border-t border-ink">
            {rest.map((section, position) => (
              <section key={section.id} aria-labelledby={`${section.id}-heading`} className="reveal grid-editorial gap-y-4 border-b border-rule py-10">
                <p aria-hidden="true" className="type-label col-span-12 text-brand md:col-span-1">
                  {String(position + 1).padStart(2, "0")}
                </p>
                <h2 id={`${section.id}-heading`} className="type-heading col-span-12 md:col-span-3">
                  {section.heading}
                </h2>
                <div className="col-span-12 md:col-span-8 lg:col-span-6">
                  <div className="space-y-4 text-ink-muted">
                    {section.paragraphs.map((paragraph, i) => (
                      <p key={i}>
                        <OwnerText value={paragraph} />
                      </p>
                    ))}
                  </div>
                  {section.list.length > 0 ? (
                    <ul className="mt-5 space-y-2.5">
                      {section.list.map((item, i) => (
                        <li key={i} className="grid grid-cols-[1.5rem_1fr]">
                          <span aria-hidden="true" className="type-mono text-brand">
                            →
                          </span>
                          <span>
                            <OwnerText value={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </Container>
      ) : null}

      <section aria-labelledby="capabilities-heading" className="pb-24 sm:pb-32">
        <Container>
          <SectionHead id="capabilities-heading" label="Capabilities" title="What I work on, and where it shows." />
          <div className="mt-14 sm:mt-20">
            <CapabilitiesIndex capabilities={profile.capabilities} projects={projects} />
          </div>
          <Credentials items={certifications} className="mt-12" />
        </Container>
      </section>

      {experience.length > 0 ? (
        <section aria-labelledby="experience-heading" className="pb-24 sm:pb-32">
          <Container>
            <SectionHead id="experience-heading" label="Experience" title="Where I’ve done the work." />
            <div className="mt-14 sm:mt-20">
              <ExperienceTimeline items={experience} />
            </div>
          </Container>
        </section>
      ) : null}

      <Container className="pb-24">
        <div className="flex flex-wrap gap-x-10 gap-y-3 border-t border-ink pt-6">
          <ArrowLink href="/projects">See the work</ArrowLink>
          <ArrowLink href="/contact">Get in touch</ArrowLink>
        </div>
      </Container>
    </>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-rule py-3">
      <dt className="type-label pt-0.5">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
