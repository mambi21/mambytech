import type { NavItem } from "@/components/site-nav";
import { getExperience, getWriting } from "@/lib/content";

/**
 * Primary navigation. Experience and Writing only appear once they have
 * content that's visible in this build, so the menu never leads to an empty
 * page. The home page is reached through the logo.
 */
export function getPrimaryNav(): NavItem[] {
  return [
    { href: "/projects", label: "Work" },
    { href: "/about", label: "About" },
    ...(getExperience().length > 0 ? [{ href: "/experience", label: "Experience" }] : []),
    ...(getWriting().length > 0 ? [{ href: "/blog", label: "Writing" }] : []),
    { href: "/contact", label: "Contact" },
  ];
}
