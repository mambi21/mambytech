import { containsOwnerInput } from "@/lib/content/owner-input";
import type { Experience } from "@/lib/content/schema";
import { formatMonth } from "@/lib/format";
import { OwnerText } from "./owner-text";

function DateText({ value }: { value: string }) {
  if (containsOwnerInput(value)) return <OwnerText value={value} />;
  return value === "present" ? <>Present</> : <time dateTime={value}>{formatMonth(value)}</time>;
}

/**
 * Career timeline, most recent first: dates in a mono column, role and
 * organisation set large, then what the role involved. Hairline rules only.
 */
export function ExperienceTimeline({ items, headingLevel = "h3" }: { items: Experience[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ol className="border-t border-ink">
      {items.map((item, index) => (
        <li key={`${item.organization}-${index}`} className="reveal grid grid-cols-12 gap-x-8 gap-y-4 border-b border-rule py-8 lg:py-10">
          <p className="type-mono col-span-12 text-ink-subtle lg:col-span-3">
            <DateText value={item.start} /> — <DateText value={item.end} />
          </p>
          <div className="col-span-12 lg:col-span-4">
            <Heading className="type-heading">
              <OwnerText value={item.role} />
            </Heading>
            <p className="mt-1.5 font-semibold text-brand">
              {item.organization}
              {item.location ? <span className="font-normal text-ink-subtle"> · {item.location}</span> : null}
            </p>
          </div>
          <div className="col-span-12 text-ink-muted lg:col-span-5">
            <p>
              <OwnerText value={item.summary} />
            </p>
            {item.highlights.length > 0 ? (
              <ul className="mt-4 space-y-2 text-[0.9375rem]">
                {item.highlights.map((highlight, i) => (
                  <li key={i} className="grid grid-cols-[1.5rem_1fr]">
                    <span aria-hidden="true" className="type-mono text-brand">
                      →
                    </span>
                    <span>
                      <OwnerText value={highlight} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {item.technologies.length > 0 ? <p className="type-mono mt-4 text-[0.8125rem] text-ink-subtle">{item.technologies.join(" / ")}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
