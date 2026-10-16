import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/mambytech-logo-trimmed.png";
import { getProfile } from "@/lib/content";
import { getPrimaryNav } from "@/lib/navigation";
import { isPreview } from "@/lib/preview";
import { SiteNav } from "./site-nav";
import { ArrowLink, Container } from "./ui";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-3 z-[100] -translate-y-24 bg-brand px-4 py-3 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
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
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="-m-1 shrink-0 p-1">
          <Logo alt="MambyTech home" preload className="h-7 w-auto sm:h-8" />
        </Link>
        <SiteNav items={getPrimaryNav()} />
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const profile = getProfile();
  const social = Object.values(profile.links).filter((link) => link !== undefined);
  const year = new Date().getFullYear();
  const nav = [{ href: "/", label: "Home" }, ...getPrimaryNav(), { href: "/privacy", label: "Privacy" }];

  return (
    <footer className="mt-auto border-t border-ink bg-paper-2">
      <Container className="grid-editorial gap-y-10 py-14">
        <div className="col-span-12 md:col-span-5">
          <Logo className="h-7 w-auto" />
          <p className="mt-5 max-w-sm text-[0.9375rem] text-ink-muted">
            {profile.name}, {profile.role}. {profile.tagline}
          </p>
          <ArrowLink href="/contact" className="mt-6 text-[0.9375rem]">
            Get in touch
          </ArrowLink>
        </div>
        <nav aria-label="Footer" className="col-span-6 md:col-span-3 md:col-start-7">
          <h2 className="type-label">Index</h2>
          <ul className="mt-4 space-y-1.5 text-[0.9375rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw text-ink-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 md:col-span-3">
          {social.length > 0 ? (
            <>
              <h2 className="type-label">Elsewhere</h2>
              <ul className="mt-4 mb-8 space-y-1.5 text-[0.9375rem]">
                {social.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="me noopener noreferrer" className="link-draw text-ink-muted hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <h2 className="type-label">Colophon</h2>
          <p className="type-mono mt-4 text-[0.8125rem] text-ink-muted">
            Set in Instrument Sans and IBM Plex Mono. Built with Next.js, hosted on Cloudflare.
          </p>
        </div>
        <p className="type-label col-span-12 border-t border-rule pt-6">
          © {year} {profile.name} · {profile.brand}
        </p>
      </Container>
    </footer>
  );
}
