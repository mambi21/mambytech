import type { Metadata } from "next";
import { ArticleGrid } from "@/components/articles";
import { CertificationCards } from "@/components/certifications";
import { ExperienceTimeline } from "@/components/experience";
import { ExpertiseCards } from "@/components/expertise";
import { HeroVisual } from "@/components/hero-visual";
import { ProjectGrid } from "@/components/projects";
import { SkillsPanel } from "@/components/skills";
import { ArrowIcon, ArrowLink, ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { getCertifications, getExperience, getFeaturedProjects, getProfile, getWriting } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ibrahima Mamby Bah · MambyTech",
    description:
      "Ibrahima Mamby Bah — Cloud Infrastructure & Linux Engineer. Building Infrastructure. Engineering Solutions. Cloud infrastructure, Linux, DevOps and software projects.",
    path: "/",
  }),
  title: { absolute: "Ibrahima Mamby Bah · MambyTech" },
};

export default function HomePage() {
  const profile = getProfile();
  const featured = getFeaturedProjects().slice(0, 3);
  const experience = getExperience();
  const certifications = getCertifications();
  const posts = getWriting().slice(0, 3);
  const handle = profile.name.toLowerCase().replace(/\s+/g, "-");
  const [firstName, ...rest] = profile.name.split(" ");

  return (
    <>
      <section aria-labelledby="intro-heading" className="relative overflow-hidden">
        <div aria-hidden="true" className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
        <div
          aria-hidden="true"
          className="absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(230_238_233/0.95),transparent)]"
        />
        <Container className="relative grid items-center gap-12 pt-12 pb-14 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pt-12 lg:pb-12">
          <div className="min-w-0">
            <Eyebrow>{profile.focusAreas.join(" · ")}</Eyebrow>
            <h1 id="intro-heading" className="type-hero mt-5 text-balance">
              Hi, I’m {firstName}{" "}
              <span className="relative whitespace-nowrap text-brand">
                <span className="relative z-10">{rest.join(" ")}</span>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-[0.06em] h-[0.28em] rounded-sm bg-term-prompt/45" />
              </span>
              .
            </h1>
            <p className="mt-5 text-[1.3125rem] font-semibold tracking-[-0.01em] text-ink sm:text-2xl">{profile.role}</p>
            <p className="type-lead mt-4 max-w-[36rem]">{profile.introduction}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/projects">
                Explore My Work
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Get in touch
              </ButtonLink>
            </div>
          </div>
          <HeroVisual profile={profile} handle={handle} />
        </Container>
      </section>

      <section aria-labelledby="expertise-heading">
        <Container>
          <h2 id="expertise-heading" className="sr-only">
            Technical expertise
          </h2>
          <ExpertiseCards items={profile.expertise} />
        </Container>
      </section>

      <section aria-labelledby="work-heading" className="mt-20 sm:mt-28">
        <Container>
          <SectionHeading id="work-heading" title="Featured Projects" eyebrow="Selected work">
            {featured.length > 0 ? <ArrowLink href="/projects">View all projects</ArrowLink> : null}
          </SectionHeading>
          {featured.length > 0 ? (
            <div className="mt-8">
              <ProjectGrid projects={featured} />
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-field/50 bg-white/60 px-6 py-10 text-center">
              <p className="mx-auto max-w-md text-ink-muted">
                Case studies are being written up and will be published here once they’re complete.
              </p>
              <ArrowLink href="/contact" className="mt-4">
                Ask about my work
              </ArrowLink>
            </div>
          )}
        </Container>
      </section>

      {profile.skillGroups.length > 0 ? (
        <section aria-labelledby="skills-heading" className="mt-20 sm:mt-28">
          <Container>
            <SectionHeading id="skills-heading" title="Technical Skills" eyebrow="Toolbox">
              {isPreview ? <span className="text-owner">Preview: “?” marks unconfirmed skills, hidden in production.</span> : null}
            </SectionHeading>
            <div className="mt-8">
              <SkillsPanel groups={profile.skillGroups} />
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

      {experience.length > 0 ? (
        <section aria-labelledby="experience-heading" className="mt-20 sm:mt-28">
          <Container>
            <SectionHeading id="experience-heading" title="Experience" eyebrow="Career">
              <ArrowLink href="/experience">Full timeline</ArrowLink>
            </SectionHeading>
            <div className="mt-8 max-w-4xl">
              <ExperienceTimeline items={experience.slice(0, 2)} />
            </div>
          </Container>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section aria-labelledby="articles-heading" className="mt-20 sm:mt-28">
          <Container>
            <SectionHeading id="articles-heading" title="Latest Articles" eyebrow="Blog">
              <ArrowLink href="/blog">View all articles</ArrowLink>
            </SectionHeading>
            <div className="mt-8">
              <ArticleGrid posts={posts} />
            </div>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="contact-heading" className="mt-20 sm:mt-28">
        <Container>
          <div className="reveal relative overflow-hidden rounded-3xl bg-term px-6 py-12 text-term-text sm:px-12 sm:py-14">
            <div aria-hidden="true" className="bg-grid absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute -right-24 -bottom-40 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(127_207_169/0.18),transparent)]"
            />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-term-prompt">Get in touch</p>
                <h2 id="contact-heading" className="mt-3 text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em] text-white sm:text-[2.125rem]">
                  Questions about a project, or infrastructure to build?
                </h2>
                <p className="mt-3 text-term-dim">Send a message and I’ll reply by email.</p>
              </div>
              <ButtonLink href="/contact" variant="secondary" className="shrink-0 border-transparent">
                Contact Me
                <ArrowIcon />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
