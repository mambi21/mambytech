import { containsOwnerInput } from "@/lib/content/owner-input";
import type { Experience } from "@/lib/content/schema";
import { formatMonth } from "@/lib/format";
import { OwnerText } from "./owner-text";
import { Tag } from "./ui";

function DateText({ value }: { value: string }) {
  if (containsOwnerInput(value)) return <OwnerText value={value} />;
  return value === "present" ? <>Present</> : <time dateTime={value}>{formatMonth(value)}</time>;
}

/** Career timeline, most recent first. */
export function ExperienceTimeline({ items, headingLevel = "h3" }: { items: Experience[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ol className="relative space-y-6 before:absolute before:top-3 before:bottom-3 before:left-[0.6875rem] before:w-px before:bg-rule sm:before:left-[0.9375rem]">
      {items.map((item, index) => (
        <li key={`${item.organization}-${index}`} className="reveal relative pl-10 sm:pl-14">
          <span
            aria-hidden="true"
            className="absolute top-6 left-0 flex size-[1.375rem] items-center justify-center rounded-full border border-brand/30 bg-paper sm:size-8"
          >
            <span className="size-2 rounded-full bg-brand sm:size-2.5" />
          </span>
          <article className="rounded-2xl border border-rule bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <Heading className="min-w-0 flex-1 text-[1.1875rem] font-bold leading-snug tracking-[-0.015em]">
                <OwnerText value={item.role} />
              </Heading>
              <p className="font-mono text-[0.8125rem] text-ink-subtle sm:max-w-[45%] sm:text-right">
                <DateText value={item.start} /> – <DateText value={item.end} />
              </p>
            </div>
            <p className="mt-1 font-semibold text-brand">
              {item.organization}
              {item.location ? <span className="font-normal text-ink-subtle"> · {item.location}</span> : null}
            </p>
            <p className="mt-3 text-ink-muted">
              <OwnerText value={item.summary} />
            </p>
            {item.highlights.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {item.highlights.map((highlight, i) => (
                  <li key={i} className="grid grid-cols-[1.25rem_1fr] text-[0.9375rem] text-ink-muted">
                    <span aria-hidden="true" className="text-brand">
                      –
                    </span>
                    <span>
                      <OwnerText value={highlight} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {item.technologies.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                {item.technologies.map((tech) => (
                  <li key={tech}>
                    <Tag>{tech}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        </li>
      ))}
    </ol>
  );
}
