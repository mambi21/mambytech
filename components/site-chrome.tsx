import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/mambytech-logo-trimmed.png";
import logoOnDark from "@/public/brand/mambytech-logo-on-dark.png";
import { getProfile } from "@/lib/content";
import { getPrimaryNav } from "@/lib/navigation";
import { isPreview } from "@/lib/preview";
import { SiteNav } from "./site-nav";
import { ArrowIcon, Container } from "./ui";

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
    <header className="sticky top-0 z-50 border-b border-rule/80 bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <Container className="relative flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" className="-m-1 shrink-0 p-1">
          <Logo alt="MambyTech home" preload className="h-7 w-auto sm:h-8" />
        </Link>
        <SiteNav items={getPrimaryNav()} cta={{ href: "/contact", label: "Contact Me" }} />
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const profile = getProfile();
  const social = Object.values(profile.links).filter((link) => link !== undefined);
  const year = new Date().getFullYear();
  const nav = [...getPrimaryNav(), { href: "/privacy", label: "Privacy" }];

  return (
    <footer className="mt-24 bg-term text-term-text sm:mt-32">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image src={logoOnDark} alt="MambyTech" sizes="150px" className="h-8 w-auto" />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-term-dim">
              {profile.tagline} The portfolio of {profile.name}, {profile.role}.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-term-prompt underline decoration-term-prompt/40 underline-offset-4 hover:decoration-term-prompt"
            >
              Get in touch
              <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex gap-16">
            <nav aria-label="Footer">
              <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-term-dim">Site</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-10 gap-y-2 text-[0.9375rem]">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-term-text hover:text-white hover:underline hover:underline-offset-4">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {social.length > 0 ? (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-term-dim">Elsewhere</h2>
                <ul className="mt-4 space-y-2 text-[0.9375rem]">
                  {social.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} rel="me noopener noreferrer" className="text-term-text hover:text-white hover:underline hover:underline-offset-4">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <p className="mt-12 border-t border-term-line pt-6 text-sm text-term-dim">
          © {year} {profile.name} · {profile.brand}
        </p>
      </Container>
    </footer>
  );
}
