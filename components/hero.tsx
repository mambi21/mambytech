import type { Profile } from "@/lib/content/schema";
import { Container, cx } from "./ui";

const cardTone = {
  green: { card: "bg-brand border-term-prompt/30", accent: "text-term-prompt" },
  gold: { card: "bg-term-line border-term-value/30", accent: "text-term-value" },
} as const;

/**
 * Home page hero: a dark rounded panel with the headline, introduction,
 * specialty pills, and the "professional journey" cards. Uses the site's
 * night palette (term), mint and gold accents, and forest green.
 */
export function Hero({ profile }: { profile: Profile }) {
  return (
    <Container className="pt-6 sm:pt-10">
      <section aria-labelledby="intro-heading" className="rounded-[1.875rem] bg-term px-6 pt-16 pb-10 text-term-text sm:px-12 sm:pt-24 sm:pb-12">
        <p className="text-xs font-semibold tracking-[0.08em] text-term-prompt uppercase sm:text-sm">{profile.eyebrow}</p>
        <h1
          id="intro-heading"
          className="mt-6 text-[2.375rem] leading-[1.14] font-semibold tracking-[-0.035em] text-white sm:text-[clamp(2.375rem,5.5vw,4.125rem)]"
        >
          {profile.headline}
          <span className="block text-term-prompt">{profile.headlineAccent}</span>
        </h1>
        <p className="mt-6 max-w-[47.5rem] text-[1.0625rem] leading-relaxed text-term-text/85 sm:text-xl">{profile.introduction}</p>
        <ul aria-label="Specialties" className="mt-7 flex flex-wrap gap-3">
          {profile.specialties.map((item) => (
            <li key={item} className="rounded-full bg-term-line px-4 py-2.5 text-[0.8125rem] text-term-text sm:text-sm">
              {item}
            </li>
          ))}
        </ul>

        {profile.journey.length > 0 ? (
          <div className="mt-16 sm:mt-20">
            <h2 className="mb-5 text-xs font-semibold tracking-[0.08em] text-term-dim uppercase sm:text-[0.8125rem]">My professional journey</h2>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5">
              {profile.journey.map((item) => {
                const tone = cardTone[item.tone];
                return (
                  <li key={item.title} className={cx("flex flex-col rounded-[1.375rem] border p-6 sm:min-h-[19.375rem] sm:rounded-3xl sm:p-8", tone.card)}>
                    <span aria-hidden="true" className="mb-5 text-3xl sm:mb-6 sm:text-4xl">
                      {item.symbol}
                    </span>
                    <p className={cx("text-[0.6875rem] font-semibold tracking-[0.06em] uppercase sm:text-[0.8125rem]", tone.accent)}>{item.kicker}</p>
                    <h3 className="mt-3 text-[1.3125rem] leading-tight font-semibold tracking-[-0.02em] text-white sm:mt-4 sm:text-[1.6875rem]">{item.title}</h3>
                    <p className="mt-3 mb-7 text-[0.9375rem] leading-relaxed text-term-text sm:mt-4 sm:text-[1.0625rem]">{item.text}</p>
                    <p className={cx("mt-auto text-[0.6875rem] font-semibold tracking-[0.04em] uppercase sm:text-[0.8125rem]", tone.accent)}>{item.organization}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>
    </Container>
  );
}
