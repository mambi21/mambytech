import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/mambytech-logo-trimmed.png";
import { getProfile } from "@/lib/content";
import { primaryNav } from "@/lib/navigation";
import { isPreview } from "@/lib/preview";
import { SiteNav } from "./site-nav";
import { Container } from "./ui";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-paper shadow-lg transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>
  );
}

export function PreviewBanner() {
  if (!isPreview) return null;
  return (
    <aside aria-label="Preview mode notice" className="border-b border-owner-line/50 bg-owner-bg text-owner">
      <Container className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2 text-sm">
        <strong className="font-semibold">Preview mode</strong>
        <span>Draft projects and unconfirmed content are visible and labelled. Not for public deployment.</span>
      </Container>
    </aside>
  );
}

/** The approved MambyTech logo (original artwork, trimmed by scripts/brand-assets.mjs). */
export function Logo({ alt = "MambyTech", preload, className }: { alt?: string; preload?: boolean; className?: string }) {
  return <Image src={logo} alt={alt} preload={preload} sizes="150px" className={className ?? "h-8 w-auto"} />;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="-m-1 p-1">
          <Logo alt="MambyTech home" preload className="h-7 w-auto sm:h-8" />
        </Link>
        <SiteNav items={primaryNav} />
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const profile = getProfile();
  const social = Object.values(profile.links).filter((link) => link !== undefined);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-rule bg-paper-2 sm:mt-32">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo className="h-7 w-auto" />
          <p className="mt-4 text-[0.9375rem] text-ink-muted">
            {profile.tagline} The portfolio of {profile.name}.
          </p>
        </div>
        <div className="flex gap-16">
          <nav aria-label="Footer">
            <h2 className="type-label">Site</h2>
            <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
              {[...primaryNav, { href: "/privacy", label: "Privacy" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink-muted hover:text-ink hover:underline hover:underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {social.length > 0 ? (
            <div>
              <h2 className="type-label">Elsewhere</h2>
              <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
                {social.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="me noopener noreferrer" className="text-ink-muted hover:text-ink hover:underline hover:underline-offset-4">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
      <Container className="pb-8">
        <p className="border-t border-rule pt-6 text-sm text-ink-subtle">
          © {year} {profile.name}
        </p>
      </Container>
    </footer>
  );
}
