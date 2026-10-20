import type { Profile } from "@/lib/content/schema";

export function CapabilitiesIndex({ capabilities }: { capabilities: Profile["capabilities"] }) {
  return (
    <ul className="mt-6 grid gap-x-12 sm:grid-cols-2">
      {capabilities.map((area) => (
        <li key={area.area} className="border-b border-rule py-6">
          <h3 className="type-subheading">{area.area}</h3>
          <p className="mt-2 max-w-xl text-[0.9375rem] text-ink-muted">{area.summary}</p>
          <p className="type-mono mt-3 text-xs text-ink-subtle">{area.tools.filter((tool) => tool.confirmed).map((tool) => tool.name).join(" · ")}</p>
        </li>
      ))}
    </ul>
  );
}
