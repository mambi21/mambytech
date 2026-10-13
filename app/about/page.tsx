import type { Metadata } from "next";
import Image from "next/image";
import { CertificationCards } from "@/components/certifications";
import { ExperienceTimeline } from "@/components/experience";
import { OwnerPlaceholder, OwnerText } from "@/components/owner-text";
import { SkillsPanel } from "@/components/skills";
import { ArrowLink, ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { getAbout, getCertifications, getExperience, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";
import mark from "@/public/brand/mambytech-mark-trimmed.png";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Ibrahima Mamby Bah, Cloud Infrastructure & Linux Engineer: background, technical skills, certifications, and engineering approach.",
  path: "/about",
});

export default function AboutPage() {
  const profile = getProfile();
  const { sections } = getAbout();
  const experience = getExperience();
  const certifications = getCertifications();
  const intro = sections.find((section) => section.id === "introduction");
  const rest = sections.filter((section) => section !== intro);
  const firstName = profile.name.split(" ")[0];

  return (
    <>
      <div className="relative overflow-hidden border-b border-rule">
        <div aria-hidden="true" className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <Container className="relative grid items-center gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="type-display mt-3">
              Hi, I’m <span className="text-brand">{firstName}</span>.
            </h1>
            <p className="mt-4 text-xl font-semibold tracking-[-0.01em]">{profile.role}</p>
            {intro ? (
              <div className="measure mt-6 space-y-4 text-[1.125rem] leading-relaxed text-ink-muted">
                {intro.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    <OwnerText value={paragraph} />
                  </p>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects">See my projects</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Get in touch
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm lg:mr-0">
            {profile.portrait ? (
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                sizes="384px"
                preload
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
              />
            ) : (
              <ProfileCard focus={profile.focusAreas} tagline={profile.tagline} />
            )}
            {!profile.portrait && isPreview ? (
              <OwnerPlaceholder className="mt-4">
                Optional portrait: add a photo to /public and set <code>portrait</code> in content/profile.ts. It replaces this card.
              </OwnerPlaceholder>
            ) : null}
          </div>
        </Container>
      </div>

      {rest.length > 0 ? (
        <Container className="mt-16 sm:mt-20">
          <div className="grid gap-5 md:grid-cols-2">
            {rest.map((section) => (
              <section
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="reveal rounded-2xl border border-rule bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
              >
                <h2 id={`${section.id}-heading`} className="type-heading">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4 text-ink-muted">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>
                      <OwnerText value={paragraph} />
                    </p>
                  ))}
                </div>
                {section.list.length > 0 ? (
                  <ul className="mt-5 space-y-2.5">
                    {section.list.map((item, index) => (
                      <li key={index} className="grid grid-cols-[1.25rem_1fr] text-ink">
                        <span aria-hidden="true" className="text-brand">
                          –
                        </span>
                        <span>
                          <OwnerText value={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </Container>
      ) : null}

      {experience.length > 0 ? (
        <section aria-labelledby="experience-heading" className="mt-20 sm:mt-24">
          <Container>
            <SectionHeading id="experience-heading" title="Experience" eyebrow="Career" />
            <div className="mt-8 max-w-4xl">
              <ExperienceTimeline items={experience} />
            </div>
          </Container>
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <section aria-labelledby="certifications-heading" className="mt-20 sm:mt-24">
          <Container>
            <SectionHeading id="certifications-heading" title="Certifications" eyebrow="Credentials" />
            <div className="mt-8">
              <CertificationCards items={certifications} />
            </div>
          </Container>
        </section>
      ) : null}

      {profile.skillGroups.length > 0 ? (
        <section aria-labelledby="skills-heading" className="mt-20 sm:mt-24">
          <Container>
            <SectionHeading id="skills-heading" title="Technical Skills" eyebrow="Toolbox" />
            <div className="mt-8">
              <SkillsPanel groups={profile.skillGroups} />
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

/** Stand-in for a portrait: the MambyTech mark and focus areas on a dark panel. */
function ProfileCard({ focus, tagline }: { focus: string[]; tagline: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-term p-8 text-term-text shadow-[var(--shadow-lift)]">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(127_207_169/0.2),transparent)]"
      />
      <div className="relative">
        <Image src={mark} alt="" sizes="128px" className="h-16 w-auto rounded-xl" />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.08em] text-term-prompt">Focus areas</p>
        <ul className="mt-3 space-y-2.5">
          {focus.map((area) => (
            <li key={area} className="flex items-center gap-3 font-medium text-white">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-term-prompt" />
              {area}
            </li>
          ))}
        </ul>
        <p className="mt-8 border-t border-term-line pt-5 font-mono text-sm text-term-dim">{tagline}</p>
      </div>
    </div>
  );
}
