import type { Metadata } from "next";
import Link from "next/link";
import { ArticleList } from "@/components/articles";
import { CapabilitiesIndex, Credentials } from "@/components/capabilities";
import { ExperienceTimeline } from "@/components/experience";
import { StackFigure } from "@/components/figures";
import { ProjectShowcase } from "@/components/projects";
import { ArrowIcon, ArrowLink, Container, SectionHead } from "@/components/ui";
import { getCertifications, getExperience, getFeaturedProjects, getProfile, getWriting } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ibrahima Mamby Bah · MambyTech",
    description:
      "Ibrahima Mamby Bah — Cloud Infrastructure & Linux Engineer focused on building, automating, and maintaining reliable systems. Selected work across AWS, Linux operations, and product engineering.",
    path: "/",
  }),
  title: { absolute: "Ibrahima Mamby Bah · MambyTech" },
};

export default function HomePage() {
  const profile = getProfile();
  const projects = getFeaturedProjects();
  const experience = getExperience();
  const certifications = getCertifications();
  const posts = getWriting().slice(0, 4);

  // Section numbers follow what's actually on the page.
  const sections = [
    projects.length > 0 && { id: "work", label: "Work" },
    { id: "capabilities", label: "Capabilities" },
    experience.length > 0 && { id: "experience", label: "Experience" },
    posts.length > 0 && { id: "writing", label: "Writing" },
  ].filter((section): section is { id: string; label: string } => Boolean(section));
  const number = (id: string) => String(sections.findIndex((section) => section.id === id) + 1).padStart(2, "0");

  const [lead, accent] = splitAccent(profile.headline);

  return (
    <>
      <section aria-labelledby="intro-heading" className="pb-24 sm:pb-32">
        <Container>
          <div className="type-label grid-editorial gap-y-2 border-b border-rule py-4">
            <p className="col-span-12 sm:col-span-6 lg:col-span-3">{profile.name}</p>
            <p className="col-span-12 hidden sm:col-span-6 sm:block lg:col-span-4">{profile.role}</p>
            <nav aria-label="On this page" className="col-span-12 hidden lg:col-span-5 lg:block">
              <ul className="flex justify-end gap-6">
                {[...sections, { id: "contact", label: "Contact" }].map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="link-draw hover:text-ink">
                      <span className="text-brand">{String(index + 1).padStart(2, "0")}</span> {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="grid-editorial gap-y-12 pt-12 sm:pt-16 lg:pt-20">
            <div className="col-span-12 lg:col-span-6">
              <h1 id="intro-heading" className="type-hero text-balance">
                {lead}
                <span className="text-brand">{accent}</span>
              </h1>
              <p className="mt-10 max-w-[30rem] text-[1.25rem] leading-[1.5] tracking-[-0.01em] text-ink sm:text-[1.375rem]">{profile.introduction}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href="#work"
                  className="group inline-flex min-h-12 items-center gap-3 bg-brand px-6 py-3 text-[0.9375rem] font-semibold text-paper transition-colors hover:bg-brand-hover"
                >
                  Explore selected work
                  <ArrowIcon direction="down" className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
                <ArrowLink href="/contact">Get in touch</ArrowLink>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-3">
              <StackFigure />
            </div>
          </div>
        </Container>
      </section>

      {projects.length > 0 ? (
        <section id="work" aria-labelledby="work-heading" className="pb-24 sm:pb-36">
          <Container className="mb-16 sm:mb-24">
            <SectionHead
              id="work-heading"
              index={number("work")}
              label="Selected work"
              title="Systems across the cloud, the operating system, and the product."
              aside={
                <p className="type-lead measure">
                  Each project is shown with what is confirmed today. Full case studies, with the problem, the decisions, and
                  verified results, follow as they are written.
                </p>
              }
            />
          </Container>
          <ProjectShowcase projects={projects} />
        </section>
      ) : null}

      <section id="capabilities" aria-labelledby="capabilities-heading" className="pb-24 sm:pb-36">
        <Container>
          <SectionHead
            id="capabilities-heading"
            index={number("capabilities")}
            label="Capabilities"
            title="What I work on, and where it shows."
            aside={
              isPreview ? <p className="text-[0.9375rem] text-owner">Preview: “?” marks unconfirmed tools, hidden in production.</p> : null
            }
          />
          <div className="mt-14 sm:mt-20">
            <CapabilitiesIndex capabilities={profile.capabilities} projects={projects} />
          </div>
          <Credentials items={certifications} className="mt-12" />
        </Container>
      </section>

      {experience.length > 0 ? (
        <section id="experience" aria-labelledby="experience-heading" className="pb-24 sm:pb-36">
          <Container>
            <SectionHead id="experience-heading" index={number("experience")} label="Experience" title="Where I’ve done the work." />
            <div className="mt-14 sm:mt-20">
              <ExperienceTimeline items={experience} />
            </div>
          </Container>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section id="writing" aria-labelledby="writing-heading" className="pb-24 sm:pb-36">
          <Container>
            <SectionHead
              id="writing-heading"
              index={number("writing")}
              label="Writing"
              title="Notes from the work."
              aside={<ArrowLink href="/blog">All writing</ArrowLink>}
            />
            <div className="mt-14 sm:mt-20">
              <ArticleList posts={posts} />
            </div>
          </Container>
        </section>
      ) : null}

      <section id="contact" aria-labelledby="contact-heading" className="bg-brand text-paper">
        <Container className="grid-editorial gap-y-10 py-20 sm:py-28">
          <p className="type-label col-span-12 !text-brand-tint lg:col-span-3">
            <span className="text-term-prompt">{String(sections.length + 1).padStart(2, "0")}</span> — Contact
          </p>
          <h2 id="contact-heading" className="type-display col-span-12 text-balance lg:col-span-7">
            Have a system that needs to work?
          </h2>
          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border-b border-paper/40 pb-1 text-[1.25rem] font-semibold transition-colors hover:border-paper"
            >
              Start a conversation
              <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="type-mono mt-4 text-[0.8125rem] text-brand-tint">Send a message and I’ll reply by email.</p>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Splits the headline before its last two words, which are set in the brand colour and kept together. */
function splitAccent(headline: string): [string, string] {
  const match = /^(.*\s)(\S+)\s+(\S+)$/.exec(headline);
  return match ? [match[1], `${match[2]} ${match[3]}`] : [headline, ""];
}
