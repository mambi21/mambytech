import type { NavItem } from "@/components/site-nav";
import { getExperience, getWriting } from "@/lib/content";

/**
 * Primary navigation. Experience and Blog only appear once they have content
 * that's visible in this build, so the menu never leads to an empty page.
 */
export function getPrimaryNav(): NavItem[] {
  return [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    ...(getExperience().length > 0 ? [{ href: "/experience", label: "Experience" }] : []),
    { href: "/projects", label: "Projects" },
    ...(getWriting().length > 0 ? [{ href: "/blog", label: "Blog" }] : []),
    { href: "/contact", label: "Contact" },
  ];
}
