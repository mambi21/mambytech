import type { Profile } from "@/lib/content/schema";

/**
 * Technical focus areas as one panel divided into columns. Unconfirmed
 * skills only exist in preview mode, where they are marked with "?".
 */
export function SkillsPanel({ groups }: { groups: Profile["skillGroups"] }) {
  return (
    <ul className="grid border-y border-rule sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group, index) => (
        <li
          key={group.area}
          className={[
            "border-rule py-7 sm:px-6",
            index > 0 ? "border-t sm:border-t-0" : "",
            index % 2 === 1 ? "sm:border-l" : "sm:pl-0",
            index >= 2 ? "sm:border-t lg:border-t-0" : "",
            index > 0 ? "lg:border-l lg:pl-6" : "lg:pl-0",
          ].join(" ")}
        >
          <h3 className="type-subheading">{group.area}</h3>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">{group.description}</p>
          {group.items.length > 0 ? (
            <ul className="mt-4 space-y-1 font-mono text-[0.8125rem]" aria-label={`${group.area} skills`}>
              {group.items.map((item) => (
                <li key={item.name} className={item.confirmed ? "text-ink" : "text-owner"}>
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
          ) : null}
        </li>
      ))}
    </ul>
  );
}
