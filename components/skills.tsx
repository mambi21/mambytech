import type { Profile } from "@/lib/content/schema";

/** Widens the cards on an incomplete last row so the four-column grid has no gaps. */
function lastRowSpan(index: number, count: number) {
  const remainder = count % 4;
  if (remainder === 0 || index < count - remainder) return "";
  if (remainder === 1) return "lg:col-span-4";
  if (remainder === 2) return "lg:col-span-2";
  return index === count - 1 ? "lg:col-span-2" : "";
}

/**
 * Skills grouped by area, as cards of chips. No proficiency bars or
 * percentages. Unconfirmed skills only exist in preview mode, where they are
 * marked with "?".
 */
export function SkillsPanel({ groups }: { groups: Profile["skillGroups"] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group, index) => (
        <li key={group.area} className={`reveal rounded-2xl border border-rule bg-white p-5 shadow-[var(--shadow-card)] ${lastRowSpan(index, groups.length)}`}>
          <h3 className="text-[0.9375rem] font-bold tracking-[-0.01em]">{group.area}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-subtle">{group.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${group.area} skills`}>
            {group.items.map((item) => (
              <li
                key={item.name}
                className={
                  item.confirmed
                    ? "rounded-md border border-brand/15 bg-brand-tint px-2 py-0.5 text-[0.8125rem] font-medium text-brand"
                    : "rounded-md border border-dashed border-owner-line bg-owner-bg px-2 py-0.5 text-[0.8125rem] text-owner"
                }
              >
                {item.name}
                {item.confirmed ? null : (
                  <>
                    <span aria-hidden="true"> ?</span>
                    <span className="sr-only"> (unconfirmed)</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
