import type { NavItem } from "@/components/site-nav";

/** Primary navigation. The home page is reached through the logo. */
export function getPrimaryNav(): NavItem[] {
  return [
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
}
