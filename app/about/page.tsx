import type { Metadata } from "next";
import Image from "next/image";
import { OwnerPlaceholder, OwnerText } from "@/components/owner-text";
import { ArrowLink, Container } from "@/components/ui";
import { getAbout, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { isPreview } from "@/lib/preview";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Ibrahima Mamby Bah: technical interests, engineering approach, and current learning focus across cloud infrastructure, Linux, DevOps and software.",
  path: "/about",
});

export default function AboutPage() {
  const profile = getProfile();
  const { sections } = getAbout();
  const intro = sections.find((section) => section.id === "introduction");
  const rest = sections.filter((section) => section !== intro);
  const firstName = profile.name.split(" ")[0];
  const showPortrait = profile.portrait || isPreview;

  return (
    <>
      <Container className="pt-14 sm:pt-20">
        <div className={showPortrait ? "grid gap-10 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start lg:gap-16" : ""}>
          <div>
            <p className="type-label">About</p>
            <h1 className="type-display mt-3">Hi, I’m {firstName}.</h1>
            {intro ? (
              <div className="measure mt-6 space-y-4 text-[1.1875rem] leading-relaxed text-ink-muted">
                {intro.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "text-ink" : undefined}>
                    <OwnerText value={paragraph} />
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          {profile.portrait ? (
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              sizes="256px"
              preload
              className="aspect-[4/5] w-full max-w-64 rounded-sm object-cover"
            />
          ) : isPreview ? (
            <OwnerPlaceholder className="flex aspect-[4/5] max-w-64 flex-col justify-end">
              Optional portrait: add a photo to /public and set <code>portrait</code> in content/profile.ts.
            </OwnerPlaceholder>
          ) : null}
        </div>
      </Container>

      <Container className="mt-16 sm:mt-20">
        {rest.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="grid gap-4 border-t border-rule py-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10"
          >
            <h2 id={`${section.id}-heading`} className="type-heading">
              {section.heading}
            </h2>
            <div className="measure">
              <div className="space-y-4 text-ink-muted">
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
            </div>
          </section>
        ))}

        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-ink pt-6">
          <ArrowLink href="/projects">See the projects</ArrowLink>
          <ArrowLink href="/contact">Get in touch</ArrowLink>
        </div>
      </Container>
    </>
  );
}
