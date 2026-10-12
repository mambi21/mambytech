import type { NavItem } from "@/components/site-nav";

/**
 * Primary navigation. Only add destinations that have published content —
 * e.g. add { href: "/writing", label: "Writing" } once the Writing section
 * exists and has posts (see docs/CONTENT.md).
 */
export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];
