import type { Profile } from "@/lib/content/schema";
import { ExpertiseIcon } from "./icons";

/** Four expertise cards shown under the hero. No scroll reveal: they sit at the fold and must not rest half-faded. */
export function ExpertiseCards({ items }: { items: Profile["expertise"] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li
          key={item.title}
          className="group rounded-2xl border border-rule bg-white p-6 shadow-[var(--shadow-card)] transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-field/60 hover:shadow-[var(--shadow-lift)]"
        >
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-tint text-brand ring-1 ring-brand/10 transition-colors duration-300 group-hover:bg-brand group-hover:text-paper">
            <ExpertiseIcon name={item.icon} />
          </span>
          <h3 className="mt-5 text-[1.0625rem] font-bold tracking-[-0.01em]">{item.title}</h3>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">{item.description}</p>
          <p className="mt-4 font-mono text-[0.8125rem] leading-6 text-ink-subtle">
            <span className="sr-only">Includes: </span>
            {item.items.join(" · ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
