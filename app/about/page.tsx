import type { Metadata } from "next";
import Image from "next/image";
import { ConnectSection } from "@/components/connect-section";
import { ArrowLink, Container, PageHeader } from "@/components/ui";
import { getAbout, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Ibrahima Mamby Bah: enterprise Linux since 2020, AWS infrastructure, DevOps, and software engineering.",
  path: "/about",
});

export default function AboutPage() {
  const profile = getProfile();
  const { sections } = getAbout();

  return (
    <>
      <PageHeader label="About" title={profile.name}>
        <p>{profile.role}</p>
      </PageHeader>
      <Container className="pb-16 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <aside>
            {profile.portrait ? (
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                width={profile.portrait.width}
                height={profile.portrait.height}
                sizes="(min-width: 1024px) 300px, 100vw"
                className="mb-6 h-auto w-full"
              />
            ) : null}
            <p className="type-label text-brand">Enterprise Linux since 2020</p>
            <p className="mt-4 max-w-sm text-ink-muted">From day-to-day systems operations to cloud infrastructure and the software built on top of it.</p>
            <ArrowLink href="/projects" className="mt-6 text-[0.9375rem]">
              See my work
            </ArrowLink>
          </aside>
          <div className="max-w-[65ch] space-y-10">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2 id={`${section.id}-heading`} className="type-heading">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4 text-ink-muted">
                  {section.paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
                {section.list.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
                    {section.list.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </Container>
      <ConnectSection />
    </>
  );
}
